"use client";
import React from "react";
import { useEffect, useState } from "react";

type Row = {
  id: string;
  顧客姓名: string;
  自費項目: string;
  費用金額: number | null;
  購買日期: string;
  狀態: string;
  聯絡電話: string;
  備註: string;
  後續追蹤日期: string;
};

const STATUS_OPTIONS = ["諮詢中", "追蹤中", "已購買", "已完成"];

export default function AdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    顧客姓名: "",
    聯絡電話: "",
    電子郵件: "",
    地址: "",
    自費項目: "健康檢查",
    費用金額: 0,
    購買日期: "",
    狀態: "諮詢中",
    備註: "",
    來源管道: "院內宣傳",
    後續追蹤日期: "",
    顧客滿意度: "普通"
  });

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/customers");
      const text = await r.text();
      if (!text) {
        throw new Error("伺服器返回空響應");
      }
      const j = JSON.parse(text);
      
      if (!r.ok) {
        const errorMsg = j.error || `HTTP 錯誤 (狀態碼: ${r.status})`;
        console.error("API Error:", errorMsg);
        alert(`載入資料失敗: ${errorMsg}`);
        setRows([]);
        return;
      }
      
      setRows(j.rows ?? []);
    } catch (error: any) {
      console.error("Error loading customers:", error);
      const errorMsg = error.message || "未知錯誤";
      alert(`載入資料失敗: ${errorMsg}`);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createRecord() {
    const r = await fetch("/api/customers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...form,
        費用金額: Number(form.費用金額)
      })
    });
    if (r.ok) {
      setForm((f: any) => ({ ...f, 顧客姓名: "", 聯絡電話: "", 電子郵件: "", 地址: "", 備註: "" }));
      await load();
    } else {
      alert("新增失敗");
    }
  }

  async function quickUpdate(id: string, patch: any) {
    const r = await fetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch)
    });
    if (r.ok) await load();
    else alert("更新失敗");
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    location.href = "/login";
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>管理後台</h2>
        <button onClick={logout}>登出</button>
      </div>

      <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <h3>新增顧客/自費紀錄</h3>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}>
          <input placeholder="顧客姓名" value={form.顧客姓名} onChange={e => setForm({ ...form, 顧客姓名: e.target.value })} />
          <input placeholder="聯絡電話" value={form.聯絡電話} onChange={e => setForm({ ...form, 聯絡電話: e.target.value })} />
          <input placeholder="電子郵件" value={form.電子郵件} onChange={e => setForm({ ...form, 電子郵件: e.target.value })} />

          <input placeholder="地址" value={form.地址} onChange={e => setForm({ ...form, 地址: e.target.value })} />

          <select value={form.自費項目} onChange={e => setForm({ ...form, 自費項目: e.target.value })}>
            {["醫美注射","雷射治療","植牙","健康檢查","營養補充","物理治療","康復器材","美容療程","基因檢測"].map(x => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>

          <input placeholder="費用金額" type="number" value={form.費用金額} onChange={e => setForm({ ...form, 費用金額: e.target.value })} />

          <input placeholder="購買日期(YYYY-MM-DD)" value={form.購買日期} onChange={e => setForm({ ...form, 購買日期: e.target.value })} />

          <select value={form.狀態} onChange={e => setForm({ ...form, 狀態: e.target.value })}>
            {STATUS_OPTIONS.map(x => <option key={x} value={x}>{x}</option>)}
          </select>

          <input placeholder="後續追蹤日期(YYYY-MM-DD)" value={form.後續追蹤日期} onChange={e => setForm({ ...form, 後續追蹤日期: e.target.value })} />

          <select value={form.來源管道} onChange={e => setForm({ ...form, 來源管道: e.target.value })}>
            {["轉介紹","網路廣告","院內宣傳","社群媒體","搜尋引擎","實體活動","老客戶回訪"].map(x => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>

          <select value={form.顧客滿意度} onChange={e => setForm({ ...form, 顧客滿意度: e.target.value })}>
            {["非常滿意","滿意","普通","不滿意","非常不滿意"].map(x => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>

          <input placeholder="備註" value={form.備註} onChange={e => setForm({ ...form, 備註: e.target.value })} />
        </div>

        <div style={{ marginTop: 10 }}>
          <button onClick={createRecord}>新增</button>
        </div>
      </section>

      <section>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>最近 50 筆</h3>
          <button onClick={load} disabled={loading}>{loading ? "讀取中..." : "重新整理"}</button>
        </div>

        <div style={{ overflowX: "auto", marginTop: 10 }}>
          <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>顧客姓名</th>
                <th>電話</th>
                <th>自費項目</th>
                <th>金額</th>
                <th>購買日期</th>
                <th>狀態</th>
                <th>後續追蹤日期</th>
                <th>備註</th>
                <th>快速操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.顧客姓名}</td>
                  <td>{r.聯絡電話}</td>
                  <td>{r.自費項目}</td>
                  <td>{r.費用金額 ?? ""}</td>
                  <td>{r.購買日期}</td>
                  <td>
                    <select
                      value={r.狀態}
                      onChange={(e) => quickUpdate(r.id, { 狀態: e.target.value })}
                    >
                      <option value=""></option>
                      {STATUS_OPTIONS.map(x => <option key={x} value={x}>{x}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      defaultValue={r.後續追蹤日期}
                      placeholder="YYYY-MM-DD"
                      onBlur={(e) => quickUpdate(r.id, { 後續追蹤日期: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      defaultValue={r.備註}
                      onBlur={(e) => quickUpdate(r.id, { 備註: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => quickUpdate(r.id, { 狀態: "已完成" })}>標記完成</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
