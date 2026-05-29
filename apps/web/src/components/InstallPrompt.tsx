import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type Platform = "android" | "ios" | "other";

const STORAGE_KEY = "hp.install-dismissed";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !("MSStream" in window)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari standalone
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function InstallPrompt() {
  const [platform] = useState<Platform>(() => detectPlatform());
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // iOS Safari doesn't fire beforeinstallprompt — show our manual hint after a delay
    if (platform === "ios") {
      const t = setTimeout(() => setOpen(true), 1500);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      };
    }
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, [platform]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4"
      >
        <div className="pointer-events-auto w-full max-w-md rounded-xl border border-border bg-bg p-4 shadow-cardHover">
          <div className="flex items-start gap-3">
            <img
              src="/pwa-icon.svg"
              alt=""
              width={40}
              height={40}
              className="rounded-md"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-text">
                Install HealthPulse
              </p>
              {platform === "ios" ? (
                <p className="mt-1 text-xs text-muted">
                  Tap{" "}
                  <span className="font-medium text-text">Share</span> in
                  Safari, then{" "}
                  <span className="font-medium text-text">
                    Add to Home Screen
                  </span>{" "}
                  to use it like an app.
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted">
                  Add it to your device for a faster, full-screen experience.
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={dismiss}
              className="rounded-md px-3 py-1.5 text-xs text-muted transition hover:text-text"
            >
              Not now
            </button>
            {platform !== "ios" && deferred && (
              <button
                type="button"
                onClick={install}
                className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:bg-accent/90"
              >
                Install
              </button>
            )}
            {platform === "ios" && (
              <button
                type="button"
                onClick={dismiss}
                className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:bg-accent/90"
              >
                Got it
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
