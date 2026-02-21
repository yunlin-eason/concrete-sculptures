# 水泥雕塑工作室 — 個人網站

以 Astro + React + TypeScript + Tailwind CSS + Shadcn UI 打造的靜態個人網站。

## 目錄結構

```
src/
├── components/          # 頁面元件
│   ├── Header.astro     # 頂部導覽列
│   ├── Footer.astro     # 頁尾
│   ├── About.astro      # 關於我區塊
│   ├── Works.astro      # 作品集卡片牆
│   └── MapSection.astro # 作品地圖 + 清單
├── components/ui/       # Shadcn UI 元件
├── content.config.ts    # 作品集 Collection 定義
├── data/
│   ├── site.ts          # ★ 網站設定、個人資料、地圖連結
│   └── works/           # ★ 作品 Markdown 文章（23件）
│       ├── garlic-superhero.md
│       ├── peanut-kid.md
│       ├── loofah-monroe.md
│       └── ...（共23件）
├── layouts/
│   └── Layout.astro     # 全站 Layout
├── pages/
│   ├── index.astro      # 首頁（三大區塊）
│   └── works/
│       └── [slug].astro # 個別作品部落格頁
├── styles/
│   └── global.css       # Tailwind + Shadcn 樣式
└── lib/
    └── utils.ts         # 工具函式

public/
└── images/
    ├── profile.jpg      # ★ 個人照片（請替換）
    └── works/           # ★ 作品封面圖（請替換）
```

帶有 ★ 的檔案是你需要編輯 / 替換的內容。

---

## 開發

```bash
# 安裝相依套件
npm install

# 啟動開發伺服器 (http://localhost:4321)
npm run dev

# 建置靜態網站
npm run build

# 預覽建置結果
npm run preview
```

---

## 如何編輯內容

### 1. 修改個人資料

編輯 `src/data/site.ts`：

```ts
export const aboutData = {
  name: '阿峰',
  photo: '/images/profile.jpg',
  story: `你的故事...`,        // 修改自我介紹（用 \n\n 分段）
  email: 'yunlin.eason@gmail.com',
  social: {
    instagram: 'https://instagram.com/s7887177',
    threads: 'https://threads.net/@s7887177',
  },
};
```

### 2. 修改 Google 地圖

在 `src/data/site.ts` 中更新嵌入連結：

```ts
export const mapEmbedUrl =
  'https://www.google.com/maps/d/embed?mid=YOUR_MAP_ID&ehbc=2E312F';
```

取得方式：Google My Maps → 分享 → 嵌入地圖 → 複製 iframe 中 `src` 的 URL。

### 3. 新增作品

在 `src/data/works/` 新增 Markdown 檔案，例如 `new-work.md`：

```markdown
---
title: "作品名稱"
year: 2025          # 可選
location: "展出地點" # 可選
locationUrl: "https://maps.app.goo.gl/..." # 可選，Google Maps 連結
pieces: 1
cover: "/images/works/new-work.jpg" # 可選，預設使用 placeholder
date: "2025-01-01"  # 可選
excerpt: "一句話介紹這件作品。"
---

你的文章內容（支援 Markdown 語法）...
```

同時把封面圖放到 `public/images/works/new-work.jpg`。

### 4. 替換圖片

- 個人照片：替換 `public/images/profile.jpg`
- 作品封面：放在 `public/images/works/` 下，檔名需與 Markdown frontmatter 的 `cover` 對應

---

## 部署到 GitHub Pages

### 首次設定

1. **建立 GitHub Repository**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yunlin-eason/concrete-sculptures.git
   git push -u origin main
   ```

2. **更新 `astro.config.mjs`**

   將 `site` 和 `base` 改為你的 GitHub 資訊：

   ```js
   export default defineConfig({
     site: 'https://yunlin-eason.github.io',
     base: '/concrete-sculptures',
     // ...
   });
   ```

   > 如果 repo 名稱不是 `concrete-sculptures`，`base` 要改成對應名稱。
   > 如果使用 `YOUR_USERNAME.github.io` 作為 repo 名稱，`base` 設為 `'/'`。

3. **啟用 GitHub Pages**

   到 GitHub repo → Settings → Pages → Source 選擇 **GitHub Actions**。

4. **推送即自動部署**

   之後每次 `git push` 到 `main` 分支都會自動觸發部署。

### 手動更新內容的流程

```bash
# 1. 編輯內容檔案（site.ts / works/*.md / 圖片）
# 2. 本地預覽確認
npm run dev

# 3. 提交並推送
git add .
git commit -m "更新作品：新作品名稱"
git push
```

GitHub Actions 會自動建置並部署到 GitHub Pages。

---

## 技術棧

| 技術 | 用途 |
|------|------|
| [Astro](https://astro.build) | 靜態網站產生器 |
| [React](https://react.dev) | UI 互動元件 |
| [TypeScript](https://typescriptlang.org) | 型別安全 |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS |
| [Shadcn UI](https://ui.shadcn.com) | UI 元件庫 |
| GitHub Pages + Actions | 部署 |
