/** Validation partagée entre le client (UX) et le serveur (source de vérité). */

export const LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  messageMin: 10,
  message: 5000,
} as const;

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot : doit rester vide. */
  website?: string;
};

export type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: Partial<ContactPayload>): {
  values: ContactPayload;
  errors: FieldErrors;
} {
  const values: ContactPayload = {
    name: String(input.name ?? "").trim(),
    email: String(input.email ?? "").trim(),
    subject: String(input.subject ?? "").trim(),
    message: String(input.message ?? "").trim(),
    website: String(input.website ?? ""),
  };
  const errors: FieldErrors = {};

  if (!values.name) errors.name = "Please tell me your name.";
  else if (values.name.length > LIMITS.name) errors.name = "That name is too long.";

  if (!values.email) errors.email = "Please enter your email address.";
  else if (values.email.length > LIMITS.email || !EMAIL_RE.test(values.email))
    errors.email = "This email address doesn't look valid.";

  if (values.subject.length > LIMITS.subject) errors.subject = "That subject is too long.";

  if (!values.message) errors.message = "Please write a message.";
  else if (values.message.length < LIMITS.messageMin)
    errors.message = `Your message should be at least ${LIMITS.messageMin} characters.`;
  else if (values.message.length > LIMITS.message)
    errors.message = `Your message should stay under ${LIMITS.message} characters.`;

  return { values, errors };
}
