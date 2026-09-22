"use client";

import { useState } from "react";

export function ContactForm({ services }: { services: string[] }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("sending");
    const form = new FormData(formElement);
    const body = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send your message");
      formElement.reset();
      setStatus("sent");
      setMessage("Thanks — your message has been received.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send your message");
    }
  }

  const input = "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900";
  return <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium">Name<input className={`${input} mt-1`} name="name" required minLength={2} /></label>
      <label className="text-sm font-medium">Email<input className={`${input} mt-1`} name="email" required type="email" /></label>
      <label className="text-sm font-medium">Phone<input className={`${input} mt-1`} name="phone" /></label>
      <label className="text-sm font-medium">Company<input className={`${input} mt-1`} name="company" /></label>
    </div>
    <label className="block text-sm font-medium">Service
      <select className={`${input} mt-1`} name="service"><option value="">Select a service</option>{services.map(s => <option key={s}>{s}</option>)}</select>
    </label>
    <label className="block text-sm font-medium">How can we help?<textarea className={`${input} mt-1 min-h-32`} name="message" required minLength={10} /></label>
    <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <button disabled={status === "sending"} className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-60">
      {status === "sending" ? "Sending…" : "Send enquiry"}
    </button>
    {message && <p role="status" className={status === "error" ? "text-red-600" : "text-green-700"}>{message}</p>}
  </form>;
}
