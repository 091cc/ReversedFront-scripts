# reversed-front-scripts

> 🇹🇼 [正體中文](#正體中文) ・ 🇺🇸/🇬🇧 [English](#english)

---

## 正體中文

### 📖 專案介紹

`reversed-front-scripts` 是一個收錄前端逆向腳本的公開儲存庫，透過逆向分析網頁遊戲前端介面所得出的自動化腳本集合，供學習與研究使用。

### 📂 檔案結構

```
reversed-front-scripts/
├── LICENSE
└── autoBattler.js
```

### 📜 腳本說明

#### `autoBattler.js` — 自動排名戰腳本

- **適用網址：** https://reversedfront.github.io/2.28/assets

自動化執行排名戰的完整流程，包含：

- 開啟時局選單
- 選擇排名戰模式
- 確認進入對戰
- 偵測進入戰鬥畫面後自動開啟連打（Auto）
- 偵測結算畫面後自動領取獎勵並返回主選單
- 支援多次循環執行

### 🚀 使用方式

1. 開啟 https://reversedfront.github.io/2.28/assets
2. 進入瀏覽器開發者工具（按 `F12`）
3. 切換至 **Console** 分頁
4. 將 `autoBattler.js` 的完整內容貼上並按下 `Enter`
5. 腳本將自動開始執行

> 若需調整執行次數，請修改腳本底部的 `TARGET_CYCLES` 變數。

**中途停止腳本：**

在 Console 中貼上以下指令即可：

```javascript
for (let i = 1; i < 99999; i++) clearInterval(i);
for (let i = 1; i < 99999; i++) clearTimeout(i);
```

或直接按 `F5` 重新整理頁面。

### ⚠️ 免責聲明

本儲存庫中所有腳本**僅供學習與技術研究用途**。

使用本腳本所造成的任何後果，包含但不限於**帳號封禁、資料遺失或任何形式的損失**，作者概不負責。使用者須自行承擔一切風險。

### 📄 授權條款

本專案採用 [LICENSE](./LICENSE) 所載明的授權條款。

---

## English

### 📖 About

`reversed-front-scripts` is a public repository of browser-side automation scripts derived from reverse engineering web game front-end interfaces, intended for educational and research purposes.

### 📂 Repository Structure

```
reversed-front-scripts/
├── LICENSE
└── autoBattler.js
```

### 📜 Script Overview

#### `autoBattler.js` — Auto Rank Battle Script

- **Target URL:** https://reversedfront.github.io/2.28/assets

Automates the full ranked battle flow, including:

- Opening the Battle Period menu
- Selecting Rank Battle mode
- Confirming match entry
- Enabling auto-battle once the battle screen loads
- Claiming rewards and returning to the main menu after the match ends
- Supports multiple sequential cycles

### 🚀 Usage

1. Navigate to https://reversedfront.github.io/2.28/assets
2. Launch your browser's developer tools (`F12`)
3. Navigate to the **Console** tab
4. Paste the full contents of `autoBattler.js` and press `Enter`
5. The script will begin executing automatically

> To change the number of cycles, modify the `TARGET_CYCLES` variable at the bottom of the script.

**To stop the script mid-execution:**

Paste the following into the Console:

```javascript
for (let i = 1; i < 99999; i++) clearInterval(i);
for (let i = 1; i < 99999; i++) clearTimeout(i);
```

Or simply refresh the page with `F5`.

### ⚠️ Disclaimer

All scripts in this repository are provided **for educational and research purposes only**.

The author assumes **no responsibility** for any consequences arising from the use of these scripts, including but not limited to **account bans, data loss, or any other damages**. Use at your own risk.

### 📄 License

This project is licensed under the terms stated in [LICENSE](./LICENSE).
