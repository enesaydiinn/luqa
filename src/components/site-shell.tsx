"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import { content } from "@/config/content";
import type { Product } from "@/types";
import { LeadForm } from "@/features/lead-form";
import { track } from "@/lib/tracking";
import { homeContent } from "@/config/home-content";

type Overlay = "search" | "favorites" | "lead" | "cookies" | null;
function subscribePreferences(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("luqa-preferences", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("luqa-preferences", callback);
  };
}
function readPreference(key: string, fallback: string) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
const SiteContext = createContext<{
  favorites: string[];
  toggleFavorite: (id: string) => void;
  inquire: (id?: string) => void;
}>({ favorites: [], toggleFavorite: () => {}, inquire: () => {} });
export const useSite = () => useContext(SiteContext);
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`wordmark ${light ? "wordmark-light" : ""}`}>
      <Image
        src="/images/wordmark-transparent.png"
        alt="LUQA"
        width={490}
        height={155}
        priority
      />
    </span>
  );
}
function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <div className="dialog-heading">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label="Pencereyi kapat"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function SiteShell({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [overlay, setOverlay] = useState<Overlay>(null),
    [menu, setMenu] = useState(false),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<string | undefined>(),
    [analyticsChoice, setAnalyticsChoice] = useState(false);
  const savedFavorites = useSyncExternalStore(
    subscribePreferences,
    () => readPreference("luqa-favorites", "[]"),
    () => "[]",
  );
  const favorites = useMemo<string[]>(() => {
    try {
      const v = JSON.parse(savedFavorites);
      return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  }, [savedFavorites]);
  const analytics = useSyncExternalStore(
    subscribePreferences,
    () => readPreference("luqa-analytics", "false") === "true",
    () => false,
  );
  useEffect(() => {
    if (analytics) track("page_view", { page_path: pathname });
  }, [pathname, analytics]);
  useEffect(() => {
    if (
      !analytics ||
      !process.env.NEXT_PUBLIC_GA4_ID ||
      !/^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA4_ID)
    )
      return;
    const id = process.env.NEXT_PUBLIC_GA4_ID;
    Reflect.set(window, `ga-disable-${id}`, false);
    const s = document.createElement("script");
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: false });
    window.gtag("event", "page_view", { page_path: pathname });
    return () => {
      s.remove();
    };
  }, [analytics]); // eslint-disable-line react-hooks/exhaustive-deps
  function toggleFavorite(id: string) {
    const next = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];
    try {
      localStorage.setItem("luqa-favorites", JSON.stringify(next));
      window.dispatchEvent(new Event("luqa-preferences"));
    } catch {}
  }
  function inquire(id?: string) {
    setSelected(id);
    setOverlay("lead");
  }
  function navigate() {
    setMenu(false);
    setOverlay(null);
  }
  const matches = products.filter((p) =>
    overlay === "favorites"
      ? favorites.includes(p.id)
      : `${p.name} ${p.short_description}`
          .toLocaleLowerCase("tr")
          .includes(query.toLocaleLowerCase("tr")),
  );
  return (
    <SiteContext.Provider value={{ favorites, toggleFavorite, inquire }}>
      <a className="skip-link" href="#main">
        İçeriğe geç
      </a>
      <div className="announcement">
        <Link href="/koleksiyon">{homeContent.announcement}</Link>
        <span aria-hidden="true">|</span>
        <span>{homeContent.announcementDetail}</span>
      </div>
      <header className="header">
        <Link
          href="/"
          className="logo-link"
          aria-label="LUQA ana sayfa"
          onClick={navigate}
        >
          <Logo />
        </Link>
        <nav className="desktop-nav" aria-label="Ana menü">
          {content.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={pathname === n.href ? "page" : undefined}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Ürün ara"
            onClick={() => {
              setQuery("");
              setOverlay("search");
            }}
          >
            <Search size={21} strokeWidth={1.35} />
          </button>
          <button
            className="icon-button favorites-button"
            aria-label={`Favorilerim, ${favorites.length} ürün`}
            onClick={() => setOverlay("favorites")}
          >
            <Heart size={21} strokeWidth={1.35} />
            {favorites.length > 0 && (
              <span className="count">{favorites.length}</span>
            )}
          </button>
          <span className="header-divider" />
          <button className="header-request" onClick={() => inquire()}>
            Ön Talep <ArrowUpRight size={15} />
          </button>
          <button
            className="icon-button mobile-toggle"
            aria-label={menu ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      {menu && (
        <nav className="mobile-nav" aria-label="Mobil menü">
          {content.nav.map((n, i) => (
            <Link key={n.href} href={n.href} onClick={navigate}>
              <span>0{i + 1}</span>
              {n.label}
              <ArrowUpRight size={18} />
            </Link>
          ))}
          <button
            className="button"
            onClick={() => {
              setMenu(false);
              inquire();
            }}
          >
            Ön Talep Oluştur <ArrowRight size={16} />
          </button>
        </nav>
      )}
      {children}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" aria-label="LUQA ana sayfa">
              <Logo />
            </Link>
            <p>
              Gündelik yaşamın içinde,
              <br />
              özenle saklanan bir zarafet.
            </p>
            <span className="eyebrow">A LIFETIME OF BEAUTY</span>
          </div>
          <div>
            <span className="footer-title">LUQA’YI KEŞFEDİN</span>
            <Link href="/koleksiyon">LUQA HOME Koleksiyonu</Link>
            <Link href="/hakkimizda">Marka Hikâyemiz</Link>
            <Link href="/tasarim">Tasarım Anlayışımız</Link>
            <Link href="/iletisim">İletişim</Link>
          </div>
          <div>
            <span className="footer-title">SİZE YARDIMCI OLALIM</span>
            <button onClick={() => inquire()}>Ön Talep Oluştur</button>
            <Link href="/iletisim#sorular">Sıkça Sorulan Sorular</Link>
            <button onClick={() => setOverlay("favorites")}>Favorilerim</button>
          </div>
          <div className="footer-note">
            <span className="footer-title">BİRLİKTE BAŞLAYAN BİR HİKÂYE</span>
            <p>
              Yeni koleksiyonun gelişmelerini
              <br />
              ilk siz keşfedin.
            </p>
            <button className="text-link" onClick={() => inquire()}>
              İletişimde Kalalım <ArrowUpRight size={17} />
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} LUQA. Tüm hakları saklıdır.</span>
          <div>
            <Link href="/kvkk">KVKK Aydınlatma Metni</Link>
            <Link href="/gizlilik">Gizlilik Politikası</Link>
            <button
              onClick={() => {
                setAnalyticsChoice(analytics);
                setOverlay("cookies");
              }}
            >
              Çerez Tercihleri
            </button>
          </div>
          <span>TÜRKİYE · TR</span>
        </div>
      </footer>
      {overlay && (
        <Dialog
          title={
            overlay === "search"
              ? "Koleksiyonda arayın"
              : overlay === "favorites"
                ? "Seçtiğiniz parçalar"
                : overlay === "cookies"
                  ? "Çerez tercihleriniz"
                  : "Bir hikâyenin başlangıcı"
          }
          onClose={() => setOverlay(null)}
        >
          {(overlay === "search" || overlay === "favorites") && (
            <>
              {overlay === "search" && (
                <div className="search-input">
                  <Search size={20} />
                  <input
                    autoFocus
                    placeholder="Bir ürün veya detay arayın…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Koleksiyonda ara"
                  />
                </div>
              )}
              <p className="muted small">
                {overlay === "favorites"
                  ? "Beğendiğiniz konseptleri burada saklayın."
                  : `${matches.length} konsept tasarım`}
              </p>
              <div className="search-results">
                {matches.map((p) => (
                  <Link
                    className="search-result"
                    key={p.id}
                    href={`/urun/${p.slug}`}
                    onClick={() => {
                      navigate();
                      track("select_item", { item_id: p.id });
                    }}
                  >
                    <Image
                      src={p.product_images[0].image_url}
                      alt={p.product_images[0].alt_text}
                      width={120}
                      height={90}
                    />
                    <div>
                      <span className="eyebrow">LUQA HOME</span>
                      <h3>{p.name}</h3>
                      <p>{p.short_description}</p>
                    </div>
                    <ArrowUpRight size={20} />
                  </Link>
                ))}
                {matches.length === 0 && (
                  <div className="empty-state">
                    <Heart size={30} strokeWidth={1} />
                    <h3>
                      {overlay === "favorites"
                        ? "Henüz bir parça seçmediniz."
                        : "Aradığınız parça bulunamadı."}
                    </h3>
                    <p>
                      {overlay === "favorites"
                        ? "Ürünlerdeki kalp simgesine dokunarak favorilerinizi oluşturun."
                        : "Farklı bir kelimeyle tekrar deneyin."}
                    </p>
                    <Link
                      className="text-link"
                      href="/koleksiyon"
                      onClick={navigate}
                    >
                      Koleksiyonu Keşfet <ArrowRight size={17} />
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
          {overlay === "lead" && (
            <>
              <p className="muted">
                İlginizi çeken parçayı bize bildirin. Koleksiyonun gelişmelerini
                sizinle paylaşalım.
              </p>
              <LeadForm products={products} selectedId={selected} />
            </>
          )}
          {overlay === "cookies" && (
            <div className="cookie-settings">
              <p>
                Bu site, tercihlerinizi cihazınızda saklamak için yerel depolama
                ve yönetici girişi için gerekli oturum çerezleri kullanır.
              </p>
              <div className="cookie-row">
                <div>
                  <strong>Gerekli</strong>
                  <p>Oturum ve kaydettiğiniz tercihler.</p>
                </div>
                <span className="small">
                  <Check size={14} /> Her zaman etkin
                </span>
              </div>
              <label className="cookie-row">
                <div>
                  <strong>İsteğe bağlı analitik</strong>
                  <p>
                    Google Analytics ile site kullanımını anlamamıza yardımcı
                    olur.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsChoice}
                  onChange={(e) => setAnalyticsChoice(e.target.checked)}
                />
              </label>
              <button
                className="button"
                onClick={() => {
                  localStorage.setItem(
                    "luqa-analytics",
                    String(analyticsChoice),
                  );
                  window.dispatchEvent(new Event("luqa-preferences"));
                  if (process.env.NEXT_PUBLIC_GA4_ID)
                    Reflect.set(
                      window,
                      `ga-disable-${process.env.NEXT_PUBLIC_GA4_ID}`,
                      !analyticsChoice,
                    );
                  if (!analyticsChoice) {
                    window.gtag?.("consent", "update", {
                      analytics_storage: "denied",
                    });
                    Object.keys(
                      Object.fromEntries(
                        document.cookie
                          .split(";")
                          .map((c) => c.trim().split("=")),
                      ),
                    )
                      .filter((k) => k.startsWith("_ga"))
                      .forEach((k) => {
                        document.cookie = `${k}=; Max-Age=0; path=/`;
                        document.cookie = `${k}=; Max-Age=0; path=/; domain=.${location.hostname}`;
                      });
                  }
                  setOverlay(null);
                }}
              >
                Tercihlerimi Kaydet <SlidersHorizontal size={16} />
              </button>
              <Link className="text-link" href="/cerez" onClick={navigate}>
                Çerez politikasını okuyun <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </Dialog>
      )}
    </SiteContext.Provider>
  );
}
