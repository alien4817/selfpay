import { Client } from "@notionhq/client";

// 動態創建 Notion client，確保 token 存在
export function getNotionClient(): Client {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error("NOTION_TOKEN 環境變數未設置");
  }
  
  try {
    const client = new Client({
      auth: token
    });
    
    return client;
  } catch (error: any) {
    console.error("Failed to create Notion client:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      tokenExists: !!token,
      tokenLength: token?.length
    });
    throw new Error(`無法創建 Notion Client: ${error.message}`);
  }
}

// Notion 資料庫 ID（從環境變數讀取）
// 注意：在 API v2025-09-03 中，查詢需要使用 DATA_SOURCE_ID，但創建頁面仍使用 DATABASE_ID
export const DATABASE_ID = process.env.NOTION_DATABASE_ID || "";
export const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID || process.env.NOTION_DATABASE_ID || "";
