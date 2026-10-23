"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Copy } from "lucide-react";

type Status = "idle" | "copied" | "error";

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const flash = (next: Status) => {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2200);
  };

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        // Repli pour les contextes non sécurisés / anciens navigateurs
        const ta = document.createElement("textarea");
        ta.value = email;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (!ok) throw new Error("copy failed");
      }
      flash("copied");
    } catch {
      flash("error");
    }
  }

  const label =
    status === "copied" ? "Copied!" : status === "error" ? "Copy failed — select it manually" : "Copy email";

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={copy}
        className="group inline-flex items-center gap-2 rounded-[var(--radius-sm)] py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--foreground-secondary)] transition-colors hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]"
        aria-label="Copy email address to clipboard"
      >
        <span className="relative inline-flex h-4 w-4 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status === "copied" ? "check" : "copy"}
              initial={reduce ? false : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 inline-flex items-center justify-center"
            >
              {status === "copied" ? (
                <Check className="h-4 w-4 text-[var(--primary)]" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
        <span aria-hidden>{label}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied" ? "Email address copied to clipboard" : status === "error" ? "Copy failed" : ""}
      </span>
    </div>
  );
}
