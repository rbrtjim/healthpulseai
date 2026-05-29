import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface Aura {
  from: string;
  to: string;
}

// Colors as hex so we can append alpha (e.g. "30" = ~19% opacity)
const AURAS: Record<string, Aura> = {
  "/": { from: "#60A5FA", to: "#1E4FA8" },
  "/auth": { from: "#A78BFA", to: "#1E4FA8" },
  "/dashboard": { from: "#60A5FA", to: "#1E4FA8" },
  "/journal/new": { from: "#2DD4BF", to: "#0F766E" },
  "/journal": { from: "#22C55E", to: "#15803D" },
  "/journal/wellbeing": { from: "#22C55E", to: "#15803D" },
  "/history": { from: "#F472B6", to: "#9D174D" },
  "/insights": { from: "#FBBF24", to: "#B45309" },
  "/account": { from: "#A78BFA", to: "#4F46E5" },
};

function pickAura(pathname: string): Aura {
  if (AURAS[pathname]) return AURAS[pathname];
  if (pathname.startsWith("/journal/wellbeing")) return AURAS["/journal/wellbeing"];
  if (pathname.startsWith("/journal/new")) return AURAS["/journal/new"];
  if (pathname.startsWith("/journal")) return AURAS["/journal"];
  return AURAS["/dashboard"];
}

export default function RouteAura() {
  const { pathname } = useLocation();
  const aura = pickAura(pathname);
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(90rem 50rem at 110% -10%, ${aura.from}33, transparent 60%),
              radial-gradient(70rem 40rem at -10% 110%, ${aura.to}26, transparent 60%)
            `,
          }}
        />
      </AnimatePresence>
    </div>
  );
}
