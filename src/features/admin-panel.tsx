"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, LogOut, ArrowRight, LoaderCircle } from "lucide-react";
import type { Product, LeadStatus } from "@/types";
import { content } from "@/config/content";
type AdminProduct = Omit<Product, "product_images"> & {
  product_images: (Product["product_images"][number] & { id: string })[];
};
type Lead = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
  product_id: string | null;
  marketing_consent: boolean;
  privacy_notice_version: string;
  products: { name: string } | null;
};
type Data = {
  stats: {
    total_products: number;
    published_products: number;
    total_leads: number;
    new_leads: number;
    per_product: { product_id: string; count: number }[];
  };
  products: AdminProduct[];
  leads: Lead[];
  settings: { key: string; value: string }[];
  collections: { id: string; name: string }[];
};
type Editor = Omit<Product, "product_images" | "created_at"> & { id: string };
const fields = [
  ["name", "Ürün Adı"],
  ["slug", "URL Kısa Adı"],
  ["short_description", "Kısa Açıklama"],
  ["description", "Açıklama"],
  ["design_story", "Tasarım Hikâyesi"],
  ["dimensions", "Ölçüler"],
  ["materials", "Malzemeler"],
  ["usage", "Kullanım Amacı"],
  ["care", "Bakım Önerileri"],
] as const;
const settingFields = [
  ["hero_title", "Ana Sayfa Başlığı (satır sonu kullanılabilir)"],
  ["hero_description", "Ana Sayfa Açıklaması"],
  ["hero_image", "Hero Görsel Yolu"],
  ["collection_description", "Koleksiyon Açıklaması"],
  ["story", "Marka Hikâyesi"],
  ["contact_email", "İletişim E-postası"],
  ["seo_title", "SEO Başlığı"],
  ["seo_description", "SEO Açıklaması"],
] as const;
function blank(collection: string): Editor {
  return {
    id: "",
    collection_id: collection,
    name: "",
    slug: "",
    short_description: "",
    description: "",
    design_story: "",
    dimensions: "Henüz kesinleşmemiştir.",
    materials: "Henüz kesinleşmemiştir.",
    usage: "",
    care: "",
    status: "concept",
    is_featured: false,
    is_published: false,
    price: null,
    currency: "TRY",
  };
}
export function AdminPanel() {
  const [data, setData] = useState<Data | null>(null),
    [checking, setChecking] = useState(true),
    [tab, setTab] = useState("dashboard"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [editor, setEditor] = useState<Editor | null>(null),
    [detail, setDetail] = useState<Lead | null>(null),
    [settings, setSettings] = useState<Record<string, string>>({});
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin", { cache: "no-store" });
      if (!res.ok) {
        setData(null);
        return;
      }
      const next: Data = await res.json();
      setData(next);
      setSettings(
        Object.fromEntries(next.settings.map((s) => [s.key, s.value])),
      );
    } catch {
      setData(null);
    } finally {
      setChecking(false);
    }
  }, []);
  // The initial request resolves asynchronously and never exposes server session data during SSR.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Loads the server session asynchronously after hydration.
    void refresh();
  }, [refresh]);
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: f.get("email"),
          password: f.get("password"),
        }),
      });
      const response = await r.json().catch(() => ({
        message: "Yönetici servisi bu önizlemede bağlı değil.",
      }));
      if (!r.ok) setError(response.message);
      else await refresh();
    } catch {
      setError("Giriş servisine ulaşılamadı.");
    } finally {
      setBusy(false);
    }
  }
  async function action(body: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await r.json();
      if (!r.ok) {
        setError(result.message);
        return false;
      }
      await refresh();
      return true;
    } catch {
      setError("İşlem tamamlanamadı. Bağlantınızı kontrol edin.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editor) return;
    const { id, ...product } = editor;
    if (await action({ action: "save_product", id: id || undefined, product }))
      setEditor(null);
  }
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor?.id) return;
    const productId = editor.id;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const r = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const result = await r.json();
      if (!r.ok) {
        setError(result.message);
        return;
      }
      await action({
        action: "add_image",
        product_id: productId,
        image_url: result.url,
        alt_text: `${editor.name} ürün görseli`,
        sort_order:
          data?.products.find((p) => p.id === productId)?.product_images
            .length || 0,
      });
    } catch {
      setError("Görsel yüklenemedi.");
    } finally {
      setBusy(false);
    }
  }
  function edit(p: AdminProduct) {
    const { product_images, created_at, ...item } = p;
    void product_images;
    void created_at;
    setEditor(item);
    setError("");
  }
  if (checking)
    return (
      <div className="empty-state">
        <LoaderCircle className="spin" />
        <p>Güvenli oturum kontrol ediliyor…</p>
      </div>
    );
  if (!data)
    return (
      <section className="admin-login">
        <span className="eyebrow">LUQA · YÖNETİM</span>
        <h1>
          Özenle yönetilen
          <br />
          <em>bir dünya.</em>
        </h1>
        <p className="muted small">
          Yalnızca yetkilendirilmiş yönetici hesapları içindir.
        </p>
        <form className="admin-form" onSubmit={login}>
          <label>
            E-posta
            <input name="email" type="email" required autoComplete="username" />
          </label>
          <label>
            Şifre
            <input
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="button" disabled={busy}>
            {busy ? "Kontrol Ediliyor…" : "Güvenli Giriş"}
            <ArrowRight size={16} />
          </button>
        </form>
        <p className="form-status">
          İlk yönetici hesabı, Supabase Auth ve admin_users yetkilendirmesiyle
          kurulur. Herkese açık kayıt yoktur.
        </p>
      </section>
    );
  const counts = [
    ["Toplam Ürün", data.stats.total_products],
    ["Yayındaki Ürün", data.stats.published_products],
    ["Toplam Ön Talep", data.stats.total_leads],
    ["Yeni Ön Talep", data.stats.new_leads],
  ];
  return (
    <>
      <div className="admin-top">
        <div>
          <span className="eyebrow">LUQA YÖNETİM</span>
          <h1>Koleksiyon Atölyesi</h1>
        </div>
        <button
          className="text-link"
          onClick={async () => {
            setBusy(true);
            try {
              const r = await fetch("/api/admin/logout", { method: "POST" });
              if (r.ok) setData(null);
              else setError("Çıkış yapılamadı. Tekrar deneyin.");
            } finally {
              setBusy(false);
            }
          }}
          disabled={busy}
        >
          Çıkış Yap <LogOut size={15} />
        </button>
      </div>
      <nav className="admin-tabs" aria-label="Yönetim bölümleri">
        {[
          ["dashboard", "Genel Bakış"],
          ["products", "Ürünler"],
          ["leads", "Ön Talepler"],
          ["settings", "İçerik"],
        ].map(([key, label]) => (
          <button
            className={tab === key ? "active" : ""}
            key={key}
            onClick={() => {
              setTab(key);
              setEditor(null);
              setError("");
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {tab === "dashboard" && (
        <>
          <div className="admin-stats">
            {counts.map(([label, value]) => (
              <div className="admin-stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <h2 style={{ fontSize: 32, marginBottom: 20 }}>Ürün bazında ilgi</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Durum</th>
                  <th>Ön Talep</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{content.statuses[p.status]}</td>
                    <td>
                      {data.stats.per_product.find(
                        (item) => item.product_id === p.id,
                      )?.count || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {tab === "products" && (
        <>
          <button
            className="button"
            onClick={() => setEditor(blank(data.collections[0]?.id || ""))}
          >
            <Plus size={16} /> Ürün Ekle
          </button>
          {editor && (
            <form className="admin-form admin-editor" onSubmit={saveProduct}>
              <h2>{editor.id ? "Ürünü Düzenle" : "Yeni Ürün"}</h2>
              {fields.map(([key, label]) => (
                <label key={key}>
                  {label}
                  {["name", "slug", "short_description"].includes(key) ? (
                    <input
                      required={key === "name" || key === "slug"}
                      maxLength={key === "short_description" ? 240 : 120}
                      value={editor[key]}
                      onChange={(e) =>
                        setEditor({ ...editor, [key]: e.target.value })
                      }
                    />
                  ) : (
                    <textarea
                      value={editor[key]}
                      onChange={(e) =>
                        setEditor({ ...editor, [key]: e.target.value })
                      }
                    />
                  )}
                </label>
              ))}
              <div className="form-row">
                <label>
                  Koleksiyon
                  <select
                    value={editor.collection_id}
                    onChange={(e) =>
                      setEditor({ ...editor, collection_id: e.target.value })
                    }
                    required
                  >
                    {data.collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Durum
                  <select
                    value={editor.status}
                    onChange={(e) =>
                      setEditor({
                        ...editor,
                        status: e.target.value as Product["status"],
                      })
                    }
                  >
                    {Object.entries(content.statuses).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Fiyat (boşsa gösterilmez, TRY)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editor.price ?? ""}
                  onChange={(e) =>
                    setEditor({
                      ...editor,
                      price:
                        e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={editor.is_featured}
                  onChange={(e) =>
                    setEditor({ ...editor, is_featured: e.target.checked })
                  }
                />
                <span>Ana sayfada öne çıkar</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={editor.is_published}
                  onChange={(e) =>
                    setEditor({ ...editor, is_published: e.target.checked })
                  }
                />
                <span>Yayında</span>
              </label>
              <div className="form-row">
                <button className="button" disabled={busy}>
                  Değişiklikleri Kaydet
                </button>
                <button
                  className="button outline"
                  type="button"
                  onClick={() => setEditor(null)}
                >
                  Vazgeç
                </button>
              </div>
              {editor.id && (
                <>
                  <h3 style={{ marginTop: 30 }}>Ürün Görselleri</h3>
                  <p className="small muted">
                    PNG, JPEG veya WebP · en fazla 5 MB. Görseller yüklenirken
                    WebP’ye dönüştürülür.
                  </p>
                  <label>
                    Görsel Yükle
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={upload}
                      disabled={busy}
                    />
                  </label>
                  {data.products
                    .find((p) => p.id === editor.id)
                    ?.product_images.map((im) => (
                      <div className="admin-message" key={im.id}>
                        <p>{im.alt_text}</p>
                        <p style={{ fontSize: 9, overflowWrap: "anywhere" }}>
                          {im.image_url}
                        </p>
                        <button
                          type="button"
                          className="text-link"
                          disabled={busy}
                          onClick={() =>
                            void action({ action: "delete_image", id: im.id })
                          }
                        >
                          Görseli Kaldır
                        </button>
                      </div>
                    ))}
                </>
              )}
            </form>
          )}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Durum</th>
                  <th>Yayın</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{content.statuses[p.status]}</td>
                    <td>{p.is_published ? "Yayında" : "Taslak"}</td>
                    <td>
                      <button onClick={() => edit(p)}>Düzenle</button> ·{" "}
                      <button
                        disabled={busy}
                        onClick={() => {
                          if (
                            confirm(
                              `${p.name} silinsin mi? Talebi olan ürünler silinemez.`,
                            )
                          )
                            void action({ action: "delete_product", id: p.id });
                        }}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {tab === "leads" && (
        <>
          <p className="small muted">
            En yeni 1000 kayıt gösterilir. Daha büyük arşivler Supabase
            üzerinden dışa aktarılabilir.
          </p>
          {detail && (
            <div className="admin-lead-detail">
              <h3>{detail.full_name}</h3>
              <p>
                E-posta: {detail.email}
                <br />
                Telefon: {detail.phone || "Belirtilmedi"}
                <br />
                Ürün: {detail.products?.name || "Koleksiyonun tamamı"}
                <br />
                Mesaj: {detail.message || "Belirtilmedi"}
                <br />
                Pazarlama izni:{" "}
                {detail.marketing_consent ? "Verildi" : "Verilmedi"}
                <br />
                Metin sürümü: {detail.privacy_notice_version}
              </p>
              <button className="text-link" onClick={() => setDetail(null)}>
                Detayı Kapat
              </button>
            </div>
          )}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Ad Soyad</th>
                  <th>Ürün</th>
                  <th>Durum</th>
                  <th>Detay</th>
                </tr>
              </thead>
              <tbody>
                {data.leads.map((l) => (
                  <tr key={l.id}>
                    <td>
                      {new Date(l.created_at).toLocaleDateString("tr-TR")}
                    </td>
                    <td>{l.full_name}</td>
                    <td>{l.products?.name || "Koleksiyon"}</td>
                    <td>
                      <select
                        aria-label={`${l.full_name} talep durumu`}
                        disabled={busy}
                        value={l.status}
                        onChange={(e) =>
                          void action({
                            action: "update_lead",
                            id: l.id,
                            status: e.target.value,
                          })
                        }
                      >
                        {Object.entries(content.leadStatuses).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </td>
                    <td>
                      <button onClick={() => setDetail(l)}>Görüntüle</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!data.leads.length && (
            <div className="empty-state">
              <h3>Henüz ön talep bulunmuyor.</h3>
              <p>Gelen talepler burada listelenecek.</p>
            </div>
          )}
        </>
      )}
      {tab === "settings" && (
        <form
          className="admin-form"
          onSubmit={(e) => {
            e.preventDefault();
            void action({ action: "save_settings", settings });
          }}
        >
          <p className="small muted">
            Bu alanlar ziyaretçi sayfalarında kullanılır. Hukuki işletme
            bilgileri, ortam değişkenlerinden yönetilir.
          </p>
          {settingFields.map(([key, label]) => (
            <label key={key}>
              {label}
              <textarea
                value={settings[key] || ""}
                onChange={(e) =>
                  setSettings({ ...settings, [key]: e.target.value })
                }
              />
            </label>
          ))}
          <button className="button" disabled={busy}>
            İçeriği Kaydet <ArrowRight size={16} />
          </button>
        </form>
      )}
    </>
  );
}
