/* ==========================================================================
   Validation du formulaire : utilisée côté client (retour immédiat) ET côté
   serveur (seule validation qui fait foi). Aucune dépendance.
   ========================================================================== */

export const LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  messageMin: 10,
  messageMax: 5000,
} as const;

export type ContactField = "name" | "email" | "subject" | "message";
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
// eslint-disable-next-line no-control-regex
const CONTROL_EXCEPT_NEWLINE =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const asString = (v: unknown) => (typeof v === "string" ? v : "");

export function validateContact(
  input: Partial<Record<ContactField, unknown>>,
): {
  values: ContactValues;
  errors: ContactErrors;
} {
  // Champs d'une seule ligne : on retire les caractères de contrôle (anti injection d'en-têtes)
  const values: ContactValues = {
    name: asString(input.name).replace(CONTROL_CHARS, " ").trim(),
    email: asString(input.email).replace(CONTROL_CHARS, "").trim(),
    subject: asString(input.subject).replace(CONTROL_CHARS, " ").trim(),
    message: asString(input.message).replace(CONTROL_EXCEPT_NEWLINE, "").trim(),
  };

  const errors: ContactErrors = {};

  if (!values.name) errors.name = "Please tell me your name.";
  else if (values.name.length > LIMITS.name)
    errors.name = `Keep it under ${LIMITS.name} characters.`;

  if (!values.email) errors.email = "Please enter your email address.";
  else if (values.email.length > LIMITS.email || !EMAIL_RE.test(values.email))
    errors.email = "That email address doesn’t look right.";

  if (values.subject.length > LIMITS.subject)
    errors.subject = `Keep it under ${LIMITS.subject} characters.`;

  if (!values.message) errors.message = "Please write a message.";
  else if (values.message.length < LIMITS.messageMin)
    errors.message = `A few more words, please (at least ${LIMITS.messageMin} characters).`;
  else if (values.message.length > LIMITS.messageMax)
    errors.message = `Keep it under ${LIMITS.messageMax} characters.`;

  return { values, errors };
}
