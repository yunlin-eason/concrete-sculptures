# 阿峰雕塑 — 水泥雕塑作品集網站

以 **Astro 5 + React 19 + TypeScript + Tailwind CSS 4 + Shadcn UI** 打造的靜態作品集網站，展示雲林在地水泥雕塑公共藝術。

**線上版本：** <https://yunlin-eason.github.io/concrete-sculptures/>

## 功能特色

- 作品集瀏覽（卡片牆 + hover 滑動動畫）
- 單一 / 多件作品的 Collection 頁面，支援圖片輪播
- Google My Maps 嵌入作品地圖
- Google Analytics 4 流量追蹤
- 圖片自動轉 WebP（`scripts/build-assets.mjs`，增量建置）
- GitHub Pages + Actions 自動部署

---

## 目錄結構

```
src/
├── components/               # 頁面元件
│   ├── Header.astro          # 頂部導覽列
│   ├── Footer.astro          # 頁尾
│   ├── About.astro           # 關於我區塊
│   ├── Collections.astro     # 作品集卡片牆
│   ├── CollectionCard.tsx    # 卡片元件（React，hover 輪播）
│   ├── CollectionView.tsx    # 作品詳情頁互動區（React Island）
│   ├── ImageGallery.tsx      # 圖片輪播元件
│   └── MapSection.astro      # 作品地圖 + 清單表格
├── components/ui/            # Shadcn UI 元件
├── content.config.ts         # Astro Content Collection 定義
├── data/
│   ├── site.ts               # ★ 網站設定、個人資料、GA、地圖連結
│   ├── collectionsOrder.ts   # ★ 作品集排序
│   └── collections/          # ★ 作品集 Markdown（共 27 件）
│       ├── loofah-monroe.md
│       ├── garlic-superman.md
│       └── ...
├── layouts/
│   └── Layout.astro          # 全站 Layout（含 GA script）
├── pages/
│   ├── index.astro           # 首頁（關於我、作品集、地圖）
│   └── collections/
│       └── [...slug].astro   # Collection 詳情頁（支援子作品路由）
├── styles/
│   └── global.css            # Tailwind CSS 4 + Shadcn 樣式
├── lib/
│   ├── utils.ts              # 工具函式（cn）
│   └── images.ts             # 圖片路徑解析（檔案系統掃描）
└── raw-assets/
    └── images/               # 原始圖片（build-assets 轉 WebP 到 public/）

public/
└── images/
    ├── profile.webp          # ★ 個人照片
    └── collections/          # ★ 作品圖片（按 collection/work 分資料夾）

scripts/
└── build-assets.mjs          # 圖片轉檔腳本（raw-assets → public，增量 + WebP）

docs/                         # 開發文件
└── google-analytics-setup.md # GA4 整合指南
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

# 圖片轉檔（raw-assets → public，增量）
node scripts/build-assets.mjs

# 圖片全部重新轉檔
node scripts/build-assets.mjs --clean
```

---

## 如何編輯內容

### 1. 修改個人資料

編輯 `src/data/site.ts`：

```ts
export const aboutData = {
  name: '阿峰',
  photo: '/images/profile.webp',
  story: `你的故事...`,        // 修改自我介紹（用 \n\n 分段）
  email: 'yunlin.eason@gmail.com',
  social: {
    instagram: 'https://www.instagram.com/eason_li_0701',
    threads: 'https://www.threads.com/@eason_li_0701',
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

### 3. Google Analytics

在 `src/data/site.ts` 中設定 GA Measurement ID：

```ts
export const gaId = 'G-XXXXXXXXXX'; // 留空字串則不載入 GA
```

詳細設定步驟請參考 `docs/google-analytics-setup.md`。

### 4. 新增作品集

在 `src/data/collections/` 新增 Markdown 檔案，例如 `new-collection.md`：

```markdown
---
title: "作品名稱"
location: "展出地點, 鄉鎮市, 雲林縣"
locationUrl: "https://maps.app.goo.gl/..."
excerpt: "一句話介紹。"
works:
  - slug: "work-slug"
    title: "作品名稱"
    description: "作品描述"
---

你的文章內容（支援 Markdown 語法）
```

同時把圖片放到 `public/images/collections/new-collection/work-slug/` ，命名為 `0.webp`、`1.webp`……

> **提示：** 如果 collection 只有一件作品，`works` 可以省略，系統會以 collection slug 作為 work slug。

### 5. 調整作品集排序

編輯 `src/data/collectionsOrder.ts`，將新的 collection slug 插入到想要的位置。

### 6. 替換圖片

- 個人照片：替換 `public/images/profile.webp`
- 作品圖片：放在 `public/images/collections/{collection-slug}/{work-slug}/` 下
- 使用原始格式（jpg/png）放入 `src/raw-assets/images/`，再執行 `node scripts/build-assets.mjs` 自動轉 WebP

---

## 部署到 GitHub Pages

### 首次設定

1. **建立 GitHub Repository**

   ```bash
   gh repo create --public --source=. --remote=upstream --push concrete-sculptures
   ```

2. **更新 `astro.config.mjs`**

   將 `site` 和 `base` 改為你的 GitHub 資訊：

   ```js
   export default defineConfig({
     site: 'https://YOUR_USERNAME.github.io',
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
# 1. 編輯內容檔案（site.ts / collections/*.md / 圖片）
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
| [Astro 5](https://astro.build) | 靜態網站產生器 |
| [React 19](https://react.dev) | UI 互動元件（Islands） |
| [TypeScript](https://typescriptlang.org) | 型別安全 |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first CSS |
| [Shadcn UI](https://ui.shadcn.com) | UI 元件庫 |
| [Motion](https://motion.dev) | 動畫效果 |
| [Google Analytics 4](https://analytics.google.com) | 流量追蹤 |
| GitHub Pages + Actions | 自動部署 |
