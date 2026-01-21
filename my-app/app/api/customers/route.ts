import { NextResponse } from "next/server";
import { getNotionClient, DATABASE_ID, DATA_SOURCE_ID } from "@/lib/notion";
import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";

export async function GET() {
  try {
    if (!DATABASE_ID) {
      console.error("NOTION_DATABASE_ID is not set");
      return NextResponse.json(
        {
          ok: false,
          error:
            "NOTION_DATABASE_ID 環境變數未設置。請確保在 .env.local 中設置正確的資料庫 ID，並且該資料庫已與您的 Notion 整合分享。",
          rows: []
        },
        { status: 500 }
      );
    }

    const notion = getNotionClient();

    const queryParams = {
      sorts: [{ property: "購買日期", direction: "descending" }],
      page_size: 50
    };
    const data =
      typeof (notion as any).dataSources?.query === "function"
        ? await (notion as any).dataSources.query({
            data_source_id: DATA_SOURCE_ID,
            ...queryParams
          })
        : await (notion as any).databases.query({
            database_id: DATABASE_ID,
            ...queryParams
          });

    const rows = data.results.map((p: any) => {
      const props = p.properties;
      return {
        id: p.id,
        顧客姓名: props["顧客姓名"]?.title?.[0]?.plain_text ?? "",
        病歷號: props["病歷號"]?.number ?? null,
        聯絡電話: props["聯絡電話"]?.rich_text?.[0]?.plain_text ?? "",
        聯絡電話2: props["聯絡電話2"]?.rich_text?.[0]?.plain_text ?? "",
        地址: props["地址"]?.rich_text?.[0]?.plain_text ?? props["地址"]?.text ?? "",
        電子郵件: props["電子郵件"]?.email ?? "",
        介紹者: props["介紹者"]?.rich_text?.[0]?.plain_text ?? "",
        來源管道: props["來源管道"]?.select?.name ?? "",
        指定醫師: props["指定醫師"]?.people?.[0]?.name ?? "",
        購買日期: props["購買日期"]?.date?.start ?? "",
        自費項目意願: props["自費項目意願"]?.select?.name ?? "",
        高檢項目: props["高檢項目"]?.rich_text?.[0]?.plain_text ?? "",
        預算金額: props["預算金額"]?.number ?? null,
        狀態: props["狀態"]?.status?.name ?? "",
        後續追蹤日期: props["後續追蹤日期"]?.date?.start ?? "",
        顧客滿意度: props["顧客滿意度"]?.select?.name ?? "",
        備註: props["備註"]?.rich_text?.[0]?.plain_text ?? props["備註"]?.text ?? ""
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
    if (!DATABASE_ID) {
      return NextResponse.json(
        { ok: false, error: "NOTION_DATABASE_ID 環境變數未設置" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const notion = getNotionClient();

    const isNonEmptyString = (value: unknown): value is string =>
      typeof value === "string" && value.trim().length > 0;

    const properties: CreatePageParameters["properties"] = {
      顧客姓名: {
        title: [
          {
            text: {
              content: isNonEmptyString(body["顧客姓名"]) ? body["顧客姓名"] : "（未命名）"
            }
          }
        ]
      }
    };

    if (typeof body["病歷號"] === "number" && Number.isFinite(body["病歷號"])) {
      properties["病歷號"] = { number: body["病歷號"] };
    }
    if (isNonEmptyString(body["聯絡電話"])) {
      properties["聯絡電話"] = { rich_text: [{ text: { content: body["聯絡電話"] } }] };
    }
    if (isNonEmptyString(body["聯絡電話2"])) {
      properties["聯絡電話2"] = { rich_text: [{ text: { content: body["聯絡電話2"] } }] };
    }
    if (isNonEmptyString(body["地址"])) {
      properties["地址"] = { rich_text: [{ text: { content: body["地址"] } }] };
    }
    if (isNonEmptyString(body["電子郵件"])) {
      properties["電子郵件"] = { email: body["電子郵件"] };
    }
    if (isNonEmptyString(body["介紹者"])) {
      properties["介紹者"] = { rich_text: [{ text: { content: body["介紹者"] } }] };
    }
    if (isNonEmptyString(body["來源管道"])) {
      properties["來源管道"] = { select: { name: body["來源管道"] } };
    }
    if (isNonEmptyString(body["指定醫師"])) {
      properties["指定醫師"] = { people: [{ id: body["指定醫師"] }] };
    }
    if (isNonEmptyString(body["購買日期"])) {
      properties["購買日期"] = { date: { start: body["購買日期"] } };
    }
    if (isNonEmptyString(body["自費項目意願"])) {
      properties["自費項目意願"] = { select: { name: body["自費項目意願"] } };
    }
    if (isNonEmptyString(body["高檢項目"])) {
      properties["高檢項目"] = { rich_text: [{ text: { content: body["高檢項目"] } }] };
    }
    if (typeof body["預算金額"] === "number" && Number.isFinite(body["預算金額"])) {
      properties["預算金額"] = { number: body["預算金額"] };
    }
    if (isNonEmptyString(body["狀態"])) {
      properties["狀態"] = { status: { name: body["狀態"] } };
    }
    if (isNonEmptyString(body["後續追蹤日期"])) {
      properties["後續追蹤日期"] = { date: { start: body["後續追蹤日期"] } };
    }
    if (isNonEmptyString(body["顧客滿意度"])) {
      properties["顧客滿意度"] = { select: { name: body["顧客滿意度"] } };
    }
    if (isNonEmptyString(body["備註"])) {
      properties["備註"] = { rich_text: [{ text: { content: body["備註"] } }] };
    }

    const created = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties
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
