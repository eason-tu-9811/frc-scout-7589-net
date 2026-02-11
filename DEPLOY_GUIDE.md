# FRC Scouting System 部署與設定指南

這是一個專為 FRC 比賽設計的數據蒐集與分析系統，支援 GitHub Pages 部署與 Google 試算表同步。

## 第一部分：部署到 GitHub Pages

1.  **建立 GitHub 儲存庫**：
    *   在 GitHub 上建立一個新的公開儲存庫（Repository）。
    *   將此專案的所有檔案上傳到該儲存庫。

2.  **開啟 GitHub Pages**：
    *   進入儲存庫的 **Settings** -> **Pages**。
    *   在 **Build and deployment** 下，將 **Source** 改為 `GitHub Actions`。

3.  **使用 GitHub Action 自動部署**（推薦）：
    *   在專案根目錄建立 `.github/workflows/deploy.yml`，貼入以下內容：
    ```yaml
    name: Deploy to GitHub Pages
    on:
      push:
        branches: [main]
    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - uses: actions/setup-node@v3
            with:
              node-version: 18
          - run: npm install
          - run: npm run build
          - uses: JamesIves/github-pages-deploy-action@v4
            with:
              folder: dist/public
    ```

## 第二部分：設定 Google 試算表後端

為了讓數據能自動儲存到 Google 試算表，請執行以下步驟：

1.  **建立試算表**：
    *   開啟一個新的 Google 試算表。
    *   點擊上方選單的 **擴充功能** -> **Apps Script**。

2.  **貼入後端腳本**：
    *   刪除所有程式碼，貼入以下內容：
    ```javascript
    function doPost(e) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var data = JSON.parse(e.postData.contents);
      
      // 根據您的評分項目自動排列標題 (第一行)
      if (sheet.getLastRow() == 0) {
        sheet.appendRow(["時間", "場次", "隊伍", "詳細數據"]);
      }
      
      sheet.appendRow([
        new Date(),
        data.matchNumber,
        data.teamNumber,
        JSON.stringify(data.data)
      ]);
      
      return ContentService.createTextOutput("Success");
    }
    ```

3.  **部署為 Web 應用程式**：
    *   點擊右上角的 **部署** -> **新部署**。
    *   類型選擇 **網頁應用程式**。
    *   「誰可以存取」選擇 **所有人** (Anyone)。
    *   部署後，複製產生的 **網頁應用程式 URL**。

## 第三部分：網頁設定

1.  開啟部署好的網頁。
2.  點擊側邊欄的 **系統設定**。
3.  在 **Google Apps Script URL** 欄位中，貼上剛才複製的 URL。
4.  點擊 **儲存**。

現在，您每次在網頁中輸入數據並提交時，資料就會自動同步到您的 Google 試算表中了！
