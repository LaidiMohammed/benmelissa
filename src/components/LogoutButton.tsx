"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/me", { method: "POST" });
    window.location.href = "/";
  }
  return (
    <button onClick={logout} className="mt-8 flex min-h-[44px] items-center border border-champagne/40 px-6 text-sm text-champagne-clair">
      Se déconnecter
    </button>
  );
}
