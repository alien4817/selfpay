import { NextResponse } from "next/server";
import { getNotionClient } from "@/lib/notion";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id: pageId } = await params;

    const notion = getNotionClient();

    const properties: Record<string, unknown> = {};
    const isNonEmptyString = (value: unknown): value is string =>
      typeof value === "string" && value.trim().length > 0;

    if ("顧客姓名" in body) {
      const name = isNonEmptyString(body["顧客姓名"]) ? body["顧客姓名"] : "（未命名）";
      properties["顧客姓名"] = { title: [{ text: { content: name } }] };
    }
    if ("病歷號" in body) {
      if (typeof body["病歷號"] === "number" && Number.isFinite(body["病歷號"])) {
        properties["病歷號"] = { number: body["病歷號"] };
      }
    }
    if ("聯絡電話" in body) {
      if (isNonEmptyString(body["聯絡電話"])) {
        properties["聯絡電話"] = { rich_text: [{ text: { content: body["聯絡電話"] } }] };
      }
    }
    if ("聯絡電話2" in body) {
      if (isNonEmptyString(body["聯絡電話2"])) {
        properties["聯絡電話2"] = { rich_text: [{ text: { content: body["聯絡電話2"] } }] };
      }
    }
    if ("地址" in body) {
      if (isNonEmptyString(body["地址"])) {
        properties["地址"] = { rich_text: [{ text: { content: body["地址"] } }] };
      }
    }
    if ("電子郵件" in body) {
      if (isNonEmptyString(body["電子郵件"])) {
        properties["電子郵件"] = { email: body["電子郵件"] };
      }
    }
    if ("介紹者" in body) {
      if (isNonEmptyString(body["介紹者"])) {
        properties["介紹者"] = { rich_text: [{ text: { content: body["介紹者"] } }] };
      }
    }
    if ("來源管道" in body) {
      if (isNonEmptyString(body["來源管道"])) {
        properties["來源管道"] = { select: { name: body["來源管道"] } };
      }
    }
    if ("指定醫師" in body) {
      if (isNonEmptyString(body["指定醫師"])) {
        properties["指定醫師"] = { people: [{ id: body["指定醫師"] }] };
      }
    }
    if ("購買日期" in body) {
      if (isNonEmptyString(body["購買日期"])) {
        properties["購買日期"] = { date: { start: body["購買日期"] } };
      }
    }
    if ("自費項目意願" in body) {
      if (isNonEmptyString(body["自費項目意願"])) {
        properties["自費項目意願"] = { select: { name: body["自費項目意願"] } };
      }
    }
    if ("高檢項目" in body) {
      if (isNonEmptyString(body["高檢項目"])) {
        properties["高檢項目"] = { rich_text: [{ text: { content: body["高檢項目"] } }] };
      }
    }
    if ("預算金額" in body) {
      if (typeof body["預算金額"] === "number" && Number.isFinite(body["預算金額"])) {
        properties["預算金額"] = { number: body["預算金額"] };
      }
    }
    if ("狀態" in body) {
      if (isNonEmptyString(body["狀態"])) {
        properties["狀態"] = { status: { name: body["狀態"] } };
      }
    }
    if ("後續追蹤日期" in body) {
      if (isNonEmptyString(body["後續追蹤日期"])) {
        properties["後續追蹤日期"] = { date: { start: body["後續追蹤日期"] } };
      }
    }
    if ("顧客滿意度" in body) {
      if (isNonEmptyString(body["顧客滿意度"])) {
        properties["顧客滿意度"] = { select: { name: body["顧客滿意度"] } };
      }
    }
    if ("備註" in body) {
      if (isNonEmptyString(body["備註"])) {
        properties["備註"] = { rich_text: [{ text: { content: body["備註"] } }] };
      }
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
