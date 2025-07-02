# 🚀 Text Expander Extension

This browser extension lets you define shortcuts that are automatically replaced with longer text snippets.  
It’s a handy tool to automate repetitive typing such as email addresses, signatures, canned responses, etc.

---

## ✨ Features

- 🔤 Replace shortcuts (e.g., `/email`) with predefined text.
- 📄 Manage shortcuts and their expansions centrally via a Google Sheet.
- 🔄 Automatic hourly synchronization with the Google Sheet.

---

## 📊 Google Sheet Setup

To make the extension work, you must create a **public Google Sheet** (shared with “anyone with the link”).

### 📑 Sheet Requirements

- **Sheet Name:** Must be named `Raccourci`
- **Column Structure:**
  - **Column A:** The shortcut keyword (e.g., `/email`)
  - **Column B:** The full text that replaces the shortcut

### ✅ Example

| Column A | Column B                                         |
|----------|--------------------------------------------------|
| email    | my.professional.email@example.com                |
| sign     | Kind regards,<br>Jean Dupont                     |
| thanks   | Thank you for your quick reply.                  |

---

## ⚙️ Installation & Configuration

> ⚠️ Since the extension is not published on the Chrome Web Store, you need to install it manually in Developer Mode.

### 🧩 Installation Steps

1. Open your browser (Google Chrome, Microsoft Edge, etc.)
2. Go to the extensions page:
   - Chrome → `chrome://extensions`
   - Edge → `edge://extensions`
3. Enable **Developer Mode** (toggle at the top right)
4. Click **"Load unpacked extension"**
5. Select the folder where this extension is located (e.g., `D:\IA\FuturIA\apps`)

---

### 🛠️ First-Time Setup

1. After installation, an icon will appear in your browser’s toolbar → Click it.
2. In the popup, enter the **Google Sheet ID**

#### 🔎 How to find your Google Sheet ID?

- Open your Google Sheet
- The URL will look like this:
