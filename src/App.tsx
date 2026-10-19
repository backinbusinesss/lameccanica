import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { MenuSection } from "@/components/sections/MenuSection";
import { StorySection } from "@/components/sections/StorySection";
import { PromosSection } from "@/components/sections/PromosSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ReservePage } from "@/pages/ReservePage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AdminApp } from "@/admin/AdminApp";
import { ContentProvider, useContent } from "@/lib/content";
import { Spinner } from "@/admin/ui";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        window.setTimeout(() => {
          const top = element.getBoundingClientRect().top + window.scrollY - 84;
          window.scrollTo({ top, behavior: "smooth" });
        }, 60);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

function Seo() {
  const { content } = useContent();
  const seo = content?.settings.seo;
  useEffect(() => {
    if (!seo) return;
    document.title = seo.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", seo.description);
  }, [seo]);
  return null;
}

function HomePage() {
  return (
    <>
      <Hero />
      <MenuSection />
      <StorySection />
      <PromosSection />
      <EventsSection />
      <ReviewsSection />
      <LocationSection />
      <NewsletterSection />
    </>
  );
}

function SiteShell() {
  const { loading, error, content } = useContent();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-6 text-ember" />
          <p className="text-[0.6rem] font-bold tracking-[0.3em] text-dim uppercase">
            La Maccanica
          </p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl">Qualcosa non ha funzionato.</h1>
          <p className="mt-3 text-[0.9rem] text-dim">
            {error ?? "Contenuti non disponibili."} Riprova tra poco o chiamaci.
          </p>
          <button onClick={() => window.location.reload()} className="btn btn-flame mt-6">
            Ricarica
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prenota" element={<ReservePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <div className="grain min-h-screen bg-ink">
        <ScrollToTop />
        <Seo />
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<SiteShell />} />
        </Routes>
      </div>
    </ContentProvider>
  );
}
