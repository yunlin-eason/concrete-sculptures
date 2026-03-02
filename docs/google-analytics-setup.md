# Google Analytics 4 整合指南

本專案已內建 GA4 支援，只需要在 Google 端完成設定，然後把 Measurement ID 貼到程式碼即可。

---

## 一、Google 端設定（你需要手動操作的部分）

### 步驟 1：建立 GA4 資源

1. 前往 [Google Analytics](https://analytics.google.com/)
2. 左下角點擊 **管理（Admin）**
3. 在「資源」欄位點擊 **建立資源（Create Property）**
4. 填寫：
   - **資源名稱：** `阿峰雕塑`（自訂）
   - **報表時區：** `(GMT+08:00) 台灣`
   - **幣別：** `新台幣 (TWD)`
5. 點下一步，選擇 **產業類別** 和 **公司規模**
6. 點擊 **建立（Create）**

### 步驟 2：設定資料串流

1. 建立資源後，系統會提示你設定資料串流，選擇 **網頁（Web）**
2. 填寫：
   - **網站網址：** `yunlin-eason.github.io/concrete-sculptures`
   - **串流名稱：** `阿峰雕塑官網`（自訂）
3. 點擊 **建立串流（Create Stream）**
4. 建立完成後，頁面會顯示 **評估 ID（Measurement ID）**，格式為：
   ```
   G-XXXXXXXXXX
   ```
5. **複製這組 ID**，這就是你需要的唯一資訊

### 步驟 3（選用）：調整資料保留期間

1. 管理 → 資源設定 → 資料收集與修改 → **資料保留（Data Retention）**
2. 將「事件資料保留」改為 **14 個月**（預設只有 2 個月）
3. 開啟「在新活動開始時重設使用者資料」

---

## 二、貼上 Measurement ID（程式碼端）

打開 `src/data/site.ts`，找到 `gaId`，將上面複製的 ID 貼上：

```ts
export const gaId = 'G-XXXXXXXXXX'; // ← 替換成你的 Measurement ID
```

存檔後推送即可：

```bash
git add .
git commit -m "feat: enable Google Analytics"
git push
```

部署完成後，回到 GA 後台 → **報表 → 即時（Realtime）**，自己打開網站瀏覽，應該會在 1-2 分鐘內看到即時使用者。

---

## 三、運作原理

程式碼已在 `src/layouts/Layout.astro` 中自動處理：

- 當 `gaId` 為空字串時，**不會載入任何 GA script**（零效能影響）
- 當 `gaId` 有值時，會在 `<head>` 注入標準 gtag.js 腳本
- 這是 Astro 靜態建置，GA 腳本會被直接嵌入 HTML，不需要任何 server-side 處理

---

## 四、停用 GA

如果之後想停用 GA，只需將 `gaId` 設回空字串：

```ts
export const gaId = ''; // GA 已停用
```

重新建置部署後，GA 腳本就不會出現在頁面上。
