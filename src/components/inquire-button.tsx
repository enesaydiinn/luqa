"use client";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useSite } from "./site-shell";
export function InquireButton({
  id,
  children = "Bu Ürünle İlgileniyorum",
  className = "button",
}: {
  id?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { inquire } = useSite();
  return (
    <button className={className} onClick={() => inquire(id)}>
      {children}
      {className.includes("text-link") ? (
        <ArrowUpRight size={18} />
      ) : (
        <ArrowRight size={17} />
      )}
    </button>
  );
}
