"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { content } from "@/config/content";
import type { Product } from "@/types";
import { track } from "@/lib/tracking";
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}
export function LeadForm({
  products,
  selectedId,
}: {
  products: Product[];
  selectedId?: string;
}) {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
      null,
    ),
    [loading, setLoading] = useState(false);
  const captcha = useRef<HTMLDivElement>(null),
    captchaId = useRef<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      message: "",
      product_id: selectedId || null,
      marketing_consent: false,
      website: "",
      started_at: 0,
    },
  });
  useEffect(() => {
    setValue("started_at", Date.now());
  }, [setValue, result?.ok]);
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!key || !captcha.current) return;
    const render = () => {
      if (captcha.current && window.turnstile)
        captchaId.current = window.turnstile.render(captcha.current, {
          sitekey: key,
          callback: (v: string) => setValue("turnstile_token", v),
          "expired-callback": () => setValue("turnstile_token", ""),
        });
    };
    let s: HTMLScriptElement | undefined;
    if (window.turnstile) render();
    else {
      s = document.createElement("script");
      s.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    }
    return () => {
      if (captchaId.current) window.turnstile?.remove(captchaId.current);
      s?.remove();
    };
  }, [setValue, result?.ok]);
  async function submit(values: LeadInput) {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/preorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response
        .json()
        .catch(() => ({
          message:
            "Ön talep hizmeti bu önizlemede bağlı değil. Kaydınız oluşturulmadı.",
        }));
      setResult({ ok: response.ok, message: data.message });
      if (response.ok) {
        track("generate_lead", { item_id: values.product_id });
        reset();
      } else if (captchaId.current) {
        window.turnstile?.reset(captchaId.current);
        setValue("turnstile_token", "");
      }
    } catch {
      setResult({
        ok: false,
        message:
          "Bağlantı kurulamadı. Kaydınız oluşturulmadı; lütfen daha sonra tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  }
  if (result?.ok)
    return (
      <div className="success-state" role="status">
        <CheckCircle2 size={36} strokeWidth={1} />
        <h3>İlginiz için teşekkür ederiz.</h3>
        <p>{result.message}</p>
        <button className="text-link" onClick={() => setResult(null)}>
          Yeni bir talep oluştur <ArrowRight size={16} />
        </button>
      </div>
    );
  return (
    <form
      className="lead-form"
      onSubmit={(event) => void handleSubmit(submit)(event)}
      noValidate
    >
      <div className="form-row">
        <label>
          Ad Soyad <span>*</span>
          <input
            autoComplete="name"
            {...register("full_name")}
            placeholder="Adınız ve soyadınız"
            aria-invalid={!!errors.full_name}
          />
          {errors.full_name && (
            <small className="field-error">{errors.full_name.message}</small>
          )}
        </label>
        <label>
          E-posta <span>*</span>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="ornek@eposta.com"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <small className="field-error">{errors.email.message}</small>
          )}
        </label>
      </div>
      <div className="form-row">
        <label>
          İlgilendiğiniz parça
          <select {...register("product_id", { setValueAs: (v) => v || null })}>
            <option value="">Koleksiyonun tamamı</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Telefon <span className="optional">(isteğe bağlı)</span>
          <input
            type="tel"
            autoComplete="tel"
            {...register("phone")}
            placeholder="+90"
          />
          {errors.phone && (
            <small className="field-error">{errors.phone.message}</small>
          )}
        </label>
      </div>
      <label>
        Mesajınız <span className="optional">(isteğe bağlı)</span>
        <textarea
          {...register("message")}
          rows={3}
          placeholder="Bizimle paylaşmak istediğiniz bir detay…"
        />
        {errors.message && (
          <small className="field-error">{errors.message.message}</small>
        )}
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Web sitesi
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>
      <label className="checkbox-label">
        <input type="checkbox" {...register("privacy_acknowledged")} />
        <span>
          <Link href="/kvkk" target="_blank">
            KVKK Aydınlatma Metni’ni
          </Link>{" "}
          okudum, kişisel verilerimin talebimin yanıtlanması amacıyla işlenmesi
          hakkında bilgilendirildim. *
        </span>
      </label>
      {errors.privacy_acknowledged && (
        <small className="field-error">
          {errors.privacy_acknowledged.message}
        </small>
      )}
      <label className="checkbox-label">
        <input type="checkbox" {...register("marketing_consent")} />
        <span>
          Koleksiyon haberleri ve pazarlama iletişimi için e-posta almak
          istiyorum. (İsteğe bağlı)
        </span>
      </label>
      <div ref={captcha} />
      <p className="form-notice">{content.leadNotice}</p>
      {!content.legalReady && (
        <p className="form-status">
          Koleksiyon önizleme aşamasındadır. Ön talep kaydı, işletme bilgileri
          ve aydınlatma metni tamamlandıktan sonra açılacaktır.
        </p>
      )}
      {result && (
        <p className="form-error" role="alert">
          {result.message}
        </p>
      )}
      <button className="button" type="submit" disabled={loading}>
        {loading ? "Gönderiliyor…" : "Ön Talep Gönder"}
        {loading ? (
          <LoaderCircle className="spin" size={17} />
        ) : (
          <ArrowRight size={17} />
        )}
      </button>
    </form>
  );
}
