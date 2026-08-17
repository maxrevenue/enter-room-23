"use client";

import { useState, type FormEvent } from "react";

type AccessGateProps = {
  title: string;
  description: string;
};

type GateStatus = "idle" | "loading" | "success";

export default function AccessGate({ title, description }: AccessGateProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<GateStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    setError(null);
    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        setStatus("idle");
        setError("We could not receive your request. Please try again.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("idle");
      setError("We could not receive your request. Please try again.");
    }
  }

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-theme-bg px-6 py-24">
      <div className="w-full max-w-md text-center">
        <h1 className="font-serif text-2xl uppercase tracking-[0.2em] text-theme-text">
          {title}
        </h1>

        <p className="mt-6 text-sm leading-relaxed text-theme-muted">
          {description}
        </p>

        {status === "success" ? (
          <p className="mt-10 text-sm leading-relaxed text-theme-muted">
            Your request has been received. We will be in touch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-3">
            <label htmlFor="access-gate-email" className="sr-only">
              Email address
            </label>
            <input
              id="access-gate-email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              required
              autoComplete="email"
              disabled={status === "loading"}
              className="w-full border border-theme-border bg-transparent px-4 py-3 text-sm text-theme-text placeholder:text-theme-muted/70 focus:border-theme-muted focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-zinc-100 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-black hover:bg-white disabled:opacity-50"
            >
              {status === "loading" ? "PROCESSING..." : "Subscribe"}
            </button>
            {error ? (
              <p className="text-xs tracking-wide text-theme-muted" role="alert">
                {error}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
