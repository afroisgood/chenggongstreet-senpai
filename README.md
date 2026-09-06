# 成功街學姊 互動活動網頁

三頁式活動互動網站：
- `/#/` 前台頁面（大螢幕投影）
- `/#/join` 互動頁面（參與者手機掃 QR code 進入）
- `/#/admin` 管理後台（密碼 `sean2026`）

技術：React + Vite，Firebase Firestore 做即時資料同步，部署到 GitHub Pages。

## 開發前設定

### 1. 建立 Firebase 專案

1. 到 [Firebase Console](https://console.firebase.google.com) 建立新專案
2. 左側選單「Build → Firestore Database」→ 建立資料庫（正式環境模式即可，之後會覆蓋規則）
3. 「Firestore Database → 規則」貼上本專案根目錄的 [`firestore.rules`](firestore.rules) 內容並發布
   > 這份規則沒有帳號系統，屬於輕量欄位檢查（例如留言長度上限），不是嚴格權限控管。因為是活動期間短期使用的工具，這個取捨可接受；如果之後想加強，可以考慮加上 Firebase Anonymous Auth + App Check。
4. 「專案設定（齒輪圖示）→ 一般 → 你的應用程式」新增一個「Web」應用程式，複製產生的 `firebaseConfig`
5. 貼到 [`src/lib/firebase.js`](src/lib/firebase.js) 取代裡面的假設值

### 2. 本機開發

```bash
npm install
npm run dev
```

### 3. 部署到 GitHub Pages

Repo：`afroisgood/chenggongstreet-senpai`

1. 建立 GitHub repo 並 push 這個專案
2. GitHub repo →「Settings → Pages」→ Build and deployment 的 Source 選擇 **GitHub Actions**（不是 Deploy from a branch）
3. push 到 `main` 分支後，[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 會自動 build 並部署
4. 網址會是 `https://afroisgood.github.io/chenggongstreet-senpai/`

## 活動當天操作流程

1. 大螢幕投影開啟前台網址 `https://afroisgood.github.io/chenggongstreet-senpai/#/`（首頁右下角有 QR code 可讓參與者掃描加入）
2. 主持人另開一個分頁登入後台 `.../#/admin`（密碼 `sean2026`）
3. 依序在後台切換活動階段：開頭破冰 → 投票一～四 → 提問靈感菜單（記得先在後台輸入當場題目文字）→ 文字雲階段
4. 前台會即時反映後台切換的階段、投票長條圖與留言牆；文字雲階段前台會自動全螢幕顯示

## 專案結構

```
src/
  data/stages.js       固定的活動階段與投票題目內容
  lib/firebase.js       Firebase 初始化（需要填入 firebaseConfig）
  lib/data.js           Firestore 讀寫封裝（留言、投票、階段設定）
  context/              參與者暱稱 / participantId / 投票紀錄（存在瀏覽器 localStorage）
  components/           GraffitiTitle、VoteBarChart、CommentWall、WordCloud、QRCodeBlock
  pages/                FrontStage、Interactive、Admin 三個路由頁面
```
