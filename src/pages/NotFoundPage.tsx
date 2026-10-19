import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6 pt-24">
      <div className="text-center">
        <p className="font-display text-[clamp(5rem,18vw,12rem)] leading-none text-cream/10">404</p>
        <h1 className="-mt-6 font-display text-3xl">Questa pagina non è nel menu.</h1>
        <p className="mt-3 text-[0.9rem] text-dim">
          Forse è finita in cucina. Torna alla home e riparti dal burger.
        </p>
        <Link to="/" className="btn btn-flame mt-7">
          <ArrowLeft className="size-4" /> Torna alla home
        </Link>
      </div>
    </div>
  );
}
