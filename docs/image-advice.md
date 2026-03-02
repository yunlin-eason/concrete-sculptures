# 圖片管理建議

## 問題

把原始照片直接用 Git 追蹤，repo 會快速膨脹（每張 JPG 3–10 MB，20 個作品就超過 200 MB）。Git 對二進位檔案沒有差異壓縮，歷史紀錄只會越來越大。

## 建議方案

### 方案 1：Git LFS（最簡單）

用 [Git Large File Storage](https://git-lfs.com/) 把圖片存在 LFS 伺服器，repo 裡只留指標檔。

```bash
# 安裝
git lfs install

# 追蹤圖片
git lfs track "public/images/**/*.jpg"
git lfs track "public/images/**/*.png"
git lfs track "public/images/**/*.webp"

git add .gitattributes
git commit -m "enable Git LFS for images"
```

- **優點**：不用改工作流程，push / pull 照舊
- **缺點**：GitHub 免費額度 1 GB 儲存 + 1 GB/月 頻寬，超過要付費

### 方案 2：外部圖床（推薦長期使用）

把圖片放到 CDN / 物件儲存，Markdown 裡直接用外部 URL。

| 服務 | 免費額度 | 適合度 |
|---|---|---|
| **Cloudflare R2** | 10 GB 存、無出流量費 | ★★★★★ |
| **Cloudflare Images** | $5/月 10 萬張 | ★★★★ |
| **Imgur** | 免費、但有壓縮 | ★★★ |
| **AWS S3 + CloudFront** | 免費方案 5 GB | ★★★ |

推薦 **Cloudflare R2**：免費 10 GB，無出流量費，搭配自訂域名就是完美圖床。

### 方案 3：建置時壓縮（搭配方案 1 或 2）

不管圖片放哪裡，都應該先壓縮再上傳：

```bash
# 安裝壓縮工具
npm install -D sharp-cli

# 或用 CLI 批次壓縮
# 把所有圖片轉成 webp，品質 80，最大寬度 1600px
find public/images -name "*.jpg" -exec sh -c '
  npx sharp -i "$1" -o "${1%.jpg}.webp" --format webp --quality 80 --resize 1600
' _ {} \;
```

或在 `astro.config.mjs` 中用 Astro 的 `<Image>` 元件，讓建置時自動最佳化。

### 方案 4：GitHub Actions 自動壓縮

在 CI 裡加一個壓縮步驟，push 原圖，deploy 壓縮後的版本：

```yaml
- name: Optimize images
  run: |
    npx @squoosh/cli --webp '{"quality":80}' --resize '{"width":1600}' \
      -d public/images/optimized public/images/collections/**/*.jpg
```

## 建議的做法

1. **短期**：先用 Git LFS，馬上解決 repo 太大的問題
2. **中期**：上傳前手動壓縮圖片（寬度不超過 1600px，轉 WebP，品質 80）
3. **長期**：遷移到 Cloudflare R2，搭配自訂域名，永久免費且極快

## 圖片壓縮參考

| 用途 | 建議寬度 | 格式 | 品質 | 預估大小 |
|---|---|---|---|---|
| 封面 / Gallery | 1600px | WebP | 80 | 100–300 KB |
| 縮圖 / 卡片 | 600px | WebP | 75 | 20–60 KB |
| 原始備份 | 原尺寸 | JPG | 原始 | 3–10 MB |

只要把原始照片壓到 WebP 1600px，整個 repo 圖片大小大約可以從 200+ MB 降到 20–30 MB。
