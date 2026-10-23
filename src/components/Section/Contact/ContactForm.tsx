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

const EMPTY: ContactValues = { name: "", email: "", subject: "", message: "" };
const TIMEOUT_MS = 15_000;

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
        {optional && <span className={s.optional}> (optional)</span>}
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

  const fallback = email ? ` You can also email me at ${email}.` : "";
  const sending = status.kind === "sending";

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
      setStatus({
        kind: "error",
        message: "Please check the highlighted fields.",
      });
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
        const base =
          data?.error ?? "Something went wrong while sending your message.";
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
          (timedOut
            ? "The request took too long, so I can’t confirm the message was sent."
            : "Network error: your message was not sent.") + fallback,
      });
    } finally {
      window.clearTimeout(timeout);
      sendingRef.current = false;
    }
  };

  return (
    <div className={s.formWrap}>
      <h3 className={s.formTitle}>Or send a message</h3>

      {/* Annonce vocale des changements d'état importants */}
      <p className={s.srOnly} aria-live="polite" aria-atomic="true">
        {status.kind === "sending" && "Sending your message."}
        {status.kind === "success" && "Your message has been sent."}
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
              Message sent<span className={s.accent}>.</span>
            </p>
            <p className={s.successText}>Thank you for getting in touch.</p>
            <button
              type="button"
              className={s.textButton}
              onClick={() => setStatus({ kind: "idle" })}
            >
              Send another message
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
                label="Name"
                autoComplete="name"
                maxLength={LIMITS.name}
                value={values.name}
                error={errors.name}
                onChange={onChange}
              />
              <Field
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                maxLength={LIMITS.email}
                value={values.email}
                error={errors.email}
                onChange={onChange}
              />
              <Field
                name="subject"
                label="Subject"
                optional
                maxLength={LIMITS.subject}
                value={values.subject}
                error={errors.subject}
                onChange={onChange}
              />
              <Field
                name="message"
                label="Message"
                multiline
                maxLength={LIMITS.messageMax}
                value={values.message}
                error={errors.message}
                onChange={onChange}
              />

              {/* Champ piège anti-spam : invisible pour les humains */}
              <div className={s.hp} aria-hidden="true">
                <label htmlFor="contact-hp">Leave this field empty</label>
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
                  {sending ? "Sending…" : "Send message"}
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
