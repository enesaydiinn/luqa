"use client";
import { track } from "@/lib/tracking";
export function ContactLink({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      onClick={() => track("contact_click", { method: "email" })}
    >
      {email}
    </a>
  );
}
