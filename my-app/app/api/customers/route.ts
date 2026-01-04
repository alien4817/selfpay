import { NextResponse } from "next/server";
// 使用靜態導入，確保在服務器端正確加載
import { Client } from "@notionhq/client";

const DATABASE_ID = process.env.NOTION_DATABASE_ID || "";

export async function GET() {
  try {
    // 檢查環境變數
    const token = process.env.NOTION_TOKEN;
    if (!token) {
      console.error("NOTION_TOKEN is not set");
      return NextResponse.json(
        { ok: false, error: "NOTION_TOKEN 環境變數未設置", rows: [] },
        { status: 500 }
      );
    }
    if (!DATABASE_ID) {
      console.error("NOTION_DATABASE_ID is not set");
      return NextResponse.json(
        { ok: false, error: "NOTION_DATABASE_ID 環境變數未設置", rows: [] },
        { status: 500 }
      );
    }

    // 創建 Notion client 實例
    const notion = new Client({
      auth: token
    });

    // 取最近 50 筆（依購買日期 desc）
    // 使用類型斷言，因為 TypeScript 類型定義可能不完整
    const data = await (notion.databases as any).query({
      database_id: DATABASE_ID,
      sorts: [{ property: "購買日期", direction: "descending" }],
      page_size: 50
    });

    // 只回傳前端需要的欄位（避免太雜）
    const rows = data.results.map((p: any) => {
      const props = p.properties;
      return {
        id: p.id,
        顧客姓名: props["顧客姓名"]?.title?.[0]?.plain_text ?? "",
        聯絡電話: props["聯絡電話"]?.phone_number ?? "",
        電子郵件: props["電子郵件"]?.email ?? "",
        地址: props["地址"]?.rich_text?.[0]?.plain_text ?? props["地址"]?.text ?? "",
        自費項目: props["自費項目"]?.select?.name ?? "",
        費用金額: props["費用金額"]?.number ?? null,
        購買日期: props["購買日期"]?.date?.start ?? "",
        狀態: props["狀態"]?.status?.name ?? "",
        備註: props["備註"]?.rich_text?.[0]?.plain_text ?? props["備註"]?.text ?? "",
        來源管道: props["來源管道"]?.select?.name ?? "",
        後續追蹤日期: props["後續追蹤日期"]?.date?.start ?? "",
        顧客滿意度: props["顧客滿意度"]?.select?.name ?? ""
      };
    });

    return NextResponse.json({ ok: true, rows });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      name: error.name,
      type: typeof error
    });
    const errorMessage = error.message || "Failed to fetch customers";
    const errorDetails = error.code ? ` (${error.code})` : "";
    return NextResponse.json(
      { 
        ok: false, 
        error: `${errorMessage}${errorDetails}`,
        rows: [] 
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // 檢查環境變數
    const token = process.env.NOTION_TOKEN;
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "NOTION_TOKEN 環境變數未設置" },
        { status: 500 }
      );
    }
    if (!DATABASE_ID) {
      return NextResponse.json(
        { ok: false, error: "NOTION_DATABASE_ID 環境變數未設置" },
        { status: 500 }
      );
    }

    const body = await req.json();

    // 創建 Notion client 實例
    const notion = new Client({
      auth: token
    });

    // 你也可以在這裡做欄位驗證（費用必須>=0、日期格式等等）
    const created = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        "顧客姓名": { title: [{ text: { content: body["顧客姓名"] ?? "（未命名）" } }] },
        "聯絡電話": { phone_number: body["聯絡電話"] ?? null },
        "電子郵件": { email: body["電子郵件"] ?? null },
        "地址": { rich_text: body["地址"] ? [{ text: { content: body["地址"] } }] : [] },
        "自費項目": body["自費項目"] ? { select: { name: body["自費項目"] } } : { select: null },
        "費用金額": typeof body["費用金額"] === "number" ? { number: body["費用金額"] } : { number: null },
        "購買日期": body["購買日期"] ? { date: { start: body["購買日期"] } } : { date: null },
        "狀態": body["狀態"] ? { status: { name: body["狀態"] } } : { status: null },
        "備註": body["備註"] ? { rich_text: [{ text: { content: body["備註"] } }] } : { rich_text: [] },
        "來源管道": body["來源管道"] ? { select: { name: body["來源管道"] } } : { select: null },
        "後續追蹤日期": body["後續追蹤日期"] ? { date: { start: body["後續追蹤日期"] } } : { date: null },
        "顧客滿意度": body["顧客滿意度"] ? { select: { name: body["顧客滿意度"] } } : { select: null }
        // 負責醫師（People）通常要用 Notion user id 才能寫入；如果你要我也幫你做，我會加一個「醫師名單→user id」對照表
      }
    });

    return NextResponse.json({ ok: true, id: (created as any).id });
  } catch (error: any) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message || "Failed to create customer"
      },
      { status: 500 }
    );
  }
}
