import Link from "next/link";
import React from "react";
export default function Home() {
  return (
    <div>
      <h2>自費顧客管理</h2>
      <p><Link href="/admin">進入管理後台</Link></p>
      <p><Link href="/login">登入</Link></p>
    </div>
  );
}
