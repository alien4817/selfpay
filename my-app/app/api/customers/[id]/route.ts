import { NextResponse } from "next/server";
// 使用靜態導入，確保在服務器端正確加載
import { Client } from "@notionhq/client";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 檢查環境變數
    const token = process.env.NOTION_TOKEN;
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "NOTION_TOKEN 環境變數未設置" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { id: pageId } = await params;

    // 創建 Notion client 實例
    const notion = new Client({
      auth: token
    });

    // 構建要更新的 properties
    const properties: any = {};

    if ("顧客姓名" in body) {
      properties["顧客姓名"] = { title: [{ text: { content: body["顧客姓名"] } }] };
    }
    if ("聯絡電話" in body) {
      properties["聯絡電話"] = { phone_number: body["聯絡電話"] ?? null };
    }
    if ("電子郵件" in body) {
      properties["電子郵件"] = { email: body["電子郵件"] ?? null };
    }
    if ("地址" in body) {
      properties["地址"] = body["地址"] ? { rich_text: [{ text: { content: body["地址"] } }] } : { rich_text: [] };
    }
    if ("自費項目" in body) {
      properties["自費項目"] = body["自費項目"] ? { select: { name: body["自費項目"] } } : { select: null };
    }
    if ("費用金額" in body) {
      properties["費用金額"] = typeof body["費用金額"] === "number" ? { number: body["費用金額"] } : { number: null };
    }
    if ("購買日期" in body) {
      properties["購買日期"] = body["購買日期"] ? { date: { start: body["購買日期"] } } : { date: null };
    }
    if ("狀態" in body) {
      properties["狀態"] = body["狀態"] ? { status: { name: body["狀態"] } } : { status: null };
    }
    if ("備註" in body) {
      properties["備註"] = body["備註"] ? { rich_text: [{ text: { content: body["備註"] } }] } : { rich_text: [] };
    }
    if ("來源管道" in body) {
      properties["來源管道"] = body["來源管道"] ? { select: { name: body["來源管道"] } } : { select: null };
    }
    if ("後續追蹤日期" in body) {
      properties["後續追蹤日期"] = body["後續追蹤日期"] ? { date: { start: body["後續追蹤日期"] } } : { date: null };
    }
    if ("顧客滿意度" in body) {
      properties["顧客滿意度"] = body["顧客滿意度"] ? { select: { name: body["顧客滿意度"] } } : { select: null };
    }

    await notion.pages.update({
      page_id: pageId,
      properties
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message || "Failed to update customer"
      },
      { status: 500 }
    );
  }
}
