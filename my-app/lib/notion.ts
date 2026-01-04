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
    
    // 驗證 client 是否正確初始化
    if (!client || typeof client.databases?.query !== 'function') {
      throw new Error("Notion Client 初始化失敗：databases.query 方法不存在");
    }
    
    return client;
  } catch (error: any) {
    console.error("Failed to create Notion client:", error);
    throw new Error(`無法創建 Notion Client: ${error.message}`);
  }
}

export const DATABASE_ID = process.env.NOTION_DATABASE_ID || "";
