import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@healthpulse/store";
import { supabase } from "../lib/supabase.js";
import Avatar from "../components/Avatar.js";
import { useTheme } from "../lib/theme.js";

interface FieldStatus {
  state: "idle" | "saving" | "saved" | "error";
  message?: string;
}

const idle: FieldStatus = { state: "idle" };

export default function AccountPage() {
  const nav = useNavigate();
  const user = useAuthStore((s) => s.user);
  const patchUser = useAuthStore((s) => s.patchUser);
  const clear = useAuthStore((s) => s.clear);
  const { theme, toggle } = useTheme();

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(user?.display_name ?? "");
  const [profileStatus, setProfileStatus] = useState<FieldStatus>(idle);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwStatus, setPwStatus] = useState<FieldStatus>(idle);

  if (!user) return null;

  const onPickAvatar = () => fileRef.current?.click();

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const upload = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upload.error) throw upload.error;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${pub.publicUrl}?t=${Date.now()}`;
      const upd = await supabase.auth.updateUser({ data: { avatar_url: url } });
      if (upd.error) throw upd.error;
      patchUser({ avatar_url: url });
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Could not upload photo.",
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const saveProfile = async () => {
    setProfileStatus({ state: "saving" });
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim() || null },
    });
    if (error) {
      setProfileStatus({ state: "error", message: error.message });
      return;
    }
    patchUser({ display_name: displayName.trim() || undefined });
    setProfileStatus({ state: "saved" });
    setTimeout(() => setProfileStatus(idle), 1800);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPwStatus({
        state: "error",
        message: "Password must be at least 8 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwStatus({ state: "error", message: "Passwords do not match." });
      return;
    }
    setPwStatus({ state: "saving" });
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwStatus({ state: "error", message: error.message });
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setPwStatus({ state: "saved", message: "Password updated." });
    setTimeout(() => setPwStatus(idle), 2200);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clear();
    nav("/");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
          Settings
        </p>
        <h1 className="mt-2 text-4xl font-light tracking-tight text-text">
          Your account
        </h1>
        <p className="mt-2 text-sm text-muted">
          Profile, security and preferences. Changes save individually.
        </p>
      </motion.header>

      <Section title="Profile">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              src={user.avatar_url}
              email={user.email}
              name={user.display_name}
              size={96}
            />
            <button
              type="button"
              onClick={onPickAvatar}
              disabled={uploading}
              className="rounded-md border border-border bg-bg px-3 py-1.5 text-xs font-medium text-text transition hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {uploading ? "Uploading…" : user.avatar_url ? "Replace" : "Upload"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onAvatarChange}
              className="hidden"
            />
            {uploadError && (
              <p className="text-xs text-rose-600 dark:text-rose-400">
                {uploadError}
              </p>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Display name
              </span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we address you?"
                className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <StatusPill status={profileStatus} />
              <button
                type="button"
                onClick={saveProfile}
                disabled={profileStatus.state === "saving"}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
              >
                Save profile
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Account">
        <dl className="divide-y divide-border">
          <Row label="Email">{user.email}</Row>
          <Row label="User ID">
            <code className="break-all text-xs">{user.id}</code>
          </Row>
        </dl>
      </Section>

      <Section title="Security">
        <form onSubmit={changePassword} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              New password
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              Confirm new password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <div className="flex items-center justify-between gap-3">
            <StatusPill status={pwStatus} />
            <button
              type="submit"
              disabled={
                pwStatus.state === "saving" ||
                newPassword.length === 0 ||
                confirmPassword.length === 0
              }
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
            >
              Update password
            </button>
          </div>
        </form>
      </Section>

      <Section title="Preferences">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text">Theme</p>
            <p className="mt-1 text-xs text-muted">
              Currently {theme}. Click to toggle.
            </p>
          </div>
          <button
            type="button"
            onClick={toggle}
            className="rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium text-text transition hover:border-accent hover:text-accent"
          >
            Switch to {theme === "dark" ? "light" : "dark"}
          </button>
        </div>
      </Section>

      <Section title="Sign out" tone="danger">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            End your session on this device. You'll need to sign in again next
            time.
          </p>
          <button
            type="button"
            onClick={signOut}
            className="rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-500/20 dark:text-rose-300"
          >
            Sign out
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  tone,
  children,
}: {
  title: string;
  tone?: "danger";
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border bg-bg p-6 shadow-card ${
        tone === "danger" ? "border-rose-500/20" : "border-border"
      }`}
    >
      <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted">
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd className="text-sm text-text">{children}</dd>
    </div>
  );
}

function StatusPill({ status }: { status: FieldStatus }) {
  if (status.state === "idle") return <span />;
  if (status.state === "saving")
    return <span className="text-xs text-muted">Saving…</span>;
  if (status.state === "saved")
    return (
      <span className="text-xs text-emerald-600 dark:text-emerald-400">
        {status.message ?? "Saved."}
      </span>
    );
  return (
    <span className="text-xs text-rose-600 dark:text-rose-400">
      {status.message ?? "Something went wrong."}
    </span>
  );
}
