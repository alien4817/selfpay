"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (r.ok) {
      router.push("/admin");
      return;
    }
    const j = await r.json().catch(() => ({}));
    setMsg(j.message ?? "登入失敗");
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>管理者登入</h2>
      <form onSubmit={onLogin} style={{ display: "grid", gap: 12 }}>
        <input placeholder="帳號" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="密碼" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">登入</button>
      </form>
      {msg && <p style={{ color: "crimson" }}>{msg}</p>}
    </div>
  );
}
