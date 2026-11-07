"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE, fadeItem, stagger, useReveal } from "../About/section-motion";
import {
  LIMITS,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from "./contact-schema";
import s from "./Contact.module.css";
import { useScopedI18n } from "../../../../locales/client";

const EMPTY: ContactValues = { name: "", email: "", subject: "", message: "" };
const TIMEOUT_MS = 15_000;

/* Codes d'erreur connus (voir ContactForm.errors dans locales/*.ts) */
const ERROR_CODES = [
  "nameRequired",
  "nameTooLong",
  "emailRequired",
  "emailInvalid",
  "subjectTooLong",
  "messageRequired",
  "messageTooShort",
  "messageTooLong",
  "rateLimited",
  "spam",
  "server",
] as const;
type ErrorCode = (typeof ERROR_CODES)[number];
const isErrorCode = (v: string): v is ErrorCode =>
  (ERROR_CODES as readonly string[]).includes(v);

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

type FieldProps = {
  name: ContactField;
  label: string;
  optional?: boolean;
  multiline?: boolean;
  type?: string;
  autoComplete?: string;
  maxLength: number;
  value: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function Field({
  name,
  label,
  optional,
  multiline,
  type = "text",
  autoComplete,
  maxLength,
  value,
  error,
  onChange,
}: FieldProps) {
  const t = useScopedI18n("ContactForm");
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    value,
    onChange,
    maxLength,
    autoComplete,
    "aria-required": !optional,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: s.input,
  } as const;

  return (
    <motion.div
      className={s.field}
      variants={fadeItem}
      initial={false}
      data-invalid={Boolean(error)}
    >
      <label htmlFor={id} className={s.label}>
        {label}
        {optional && <span className={s.optional}> {t("optional")}</span>}
      </label>
      <div className={s.control}>
        {multiline ? (
          <textarea {...shared} rows={5} />
        ) : (
          <input {...shared} type={type} />
        )}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key="error"
            id={errorId}
            className={s.fieldError}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ContactForm({ email }: { email?: string }) {
  const t = useScopedI18n("ContactForm");
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const sendingRef = useRef(false); // verrou synchrone contre les doubles envois
  const startedAt = useRef(0);
  const reveal = useReveal<HTMLDivElement>();

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const fallback = email ? t("fallback", { email }) : "";
  const sending = status.kind === "sending";

  /* Code connu → texte traduit ; chaîne inconnue → affichée telle quelle */
  const tError = (value?: string) => {
    if (!value) return undefined;
    return isErrorCode(value) ? t(`errors.${value}`) : value;
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as ContactField;
    const value = e.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const focusFirstInvalid = () => {
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus();
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sendingRef.current) return;

    // Validation côté client (le serveur revalide de toute façon)
    const { values: clean, errors: found } = validateContact(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus({ kind: "error", message: t("status.checkFields") });
      focusFirstInvalid();
      return;
    }

    sendingRef.current = true;
    setErrors({});
    setStatus({ kind: "sending" });

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...clean,
          hp: honeypotRef.current?.value ?? "",
          elapsed: Date.now() - startedAt.current,
        }),
        signal: controller.signal,
      });
      const data: {
        ok?: boolean;
        error?: string;
        fieldErrors?: ContactErrors;
      } | null = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setValues(EMPTY);
        setStatus({ kind: "success" });
      } else {
        if (data?.fieldErrors) {
          setErrors(data.fieldErrors);
          focusFirstInvalid();
        }
        const base = tError(data?.error) ?? t("status.generic");
        // Le repli par email n'est pertinent que pour les erreurs côté service
        const serviceIssue = res.status >= 500 || res.status === 429;
        setStatus({
          kind: "error",
          message: serviceIssue ? base + fallback : base,
        });
      }
    } catch (err) {
      const timedOut = err instanceof DOMException && err.name === "AbortError";
      setStatus({
        kind: "error",
        message:
          (timedOut ? t("status.timeout") : t("status.network")) + fallback,
      });
    } finally {
      window.clearTimeout(timeout);
      sendingRef.current = false;
    }
  };

  return (
    <div className={s.formWrap}>
      <h3 className={s.formTitle}>{t("title")}</h3>

      {/* Annonce vocale des changements d'état importants */}
      <p className={s.srOnly} aria-live="polite" aria-atomic="true">
        {status.kind === "sending" && t("srSending")}
        {status.kind === "success" && t("srSent")}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {status.kind === "success" ? (
          <motion.div
            key="success"
            className={s.success}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <p className={s.successTitle}>
              {t("success.title")}
              <span className={s.accent}>.</span>
            </p>
            <p className={s.successText}>{t("success.text")}</p>
            <button
              type="button"
              className={s.textButton}
              onClick={() => setStatus({ kind: "idle" })}
            >
              {t("success.again")}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            className={s.form}
            noValidate
            onSubmit={onSubmit}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              ref={reveal.ref}
              className={s.fields}
              variants={stagger}
              initial={false}
              animate={reveal.state}
            >
              <Field
                name="name"
                label={t("fields.name")}
                autoComplete="name"
                maxLength={LIMITS.name}
                value={values.name}
                error={tError(errors.name)}
                onChange={onChange}
              />
              <Field
                name="email"
                label={t("fields.email")}
                type="email"
                autoComplete="email"
                maxLength={LIMITS.email}
                value={values.email}
                error={tError(errors.email)}
                onChange={onChange}
              />
              <Field
                name="subject"
                label={t("fields.subject")}
                optional
                maxLength={LIMITS.subject}
                value={values.subject}
                error={tError(errors.subject)}
                onChange={onChange}
              />
              <Field
                name="message"
                label={t("fields.message")}
                multiline
                maxLength={LIMITS.messageMax}
                value={values.message}
                error={tError(errors.message)}
                onChange={onChange}
              />

              {/* Champ piège anti-spam : invisible pour les humains */}
              <div className={s.hp} aria-hidden="true">
                <label htmlFor="contact-hp">{t("honeypot")}</label>
                <input
                  ref={honeypotRef}
                  id="contact-hp"
                  name="contact_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <motion.div
                className={s.submitRow}
                variants={fadeItem}
                initial={false}
              >
                <button
                  type="submit"
                  className={s.submit}
                  aria-disabled={sending}
                  aria-busy={sending}
                  onClick={(e) => sending && e.preventDefault()}
                >
                  {sending ? t("sending") : t("submit")}
                </button>

                <AnimatePresence initial={false}>
                  {status.kind === "error" && (
                    <motion.p
                      key="error"
                      role="alert"
                      className={s.errorBanner}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      {status.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
