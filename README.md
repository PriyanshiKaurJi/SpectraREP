Here's the README.md script:

# Spectra - WhatsApp Multi-Function Bot  

![Spectra Bot](https://github.com/Mr-Perfect-Spector/Spectra/raw/main/assets/banner.png)  

**Creator & Owner:** Mr Perfect  
**Contributor:** Priyanshi Kaur  
**Repository:** [Spectra GitHub Repo](https://github.com/Mr-Perfect-Spector/Spectra.git)  

## ⚡ About Spectra  
Spectra is a powerful multi-function WhatsApp bot that provides various automation and utility features. It is designed to handle multiple tasks efficiently while ensuring a seamless user experience.  

### 🛠 Features  
- Multi-device support  
- Customizable prefix commands  
- Admin-only mode  
- Auto-read and logging options  
- Anti-spam protection  
- Database integration (SQLite/MongoDB)  
- Webhook support  
- Auto-restart and server uptime monitoring  
- Continuous updates with new features  

## 🚀 Getting Started  

### 📌 Requirements  
- Node.js (latest LTS version)  
- A valid WhatsApp session (session ID required)  
- Database (SQLite or MongoDB)  
- Stable internet connection  

### 🔧 Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Mr-Perfect-Spector/Spectra.git
   cd Spectra

2. Install dependencies:

npm install


3. Configure the bot by editing config.js (see below).


4. Start the bot:

node index.js



⚙️ Configuration (config.js)

📱 WhatsApp Account Settings

"whatsappAccount": {
  "phoneNumber": "",
  "sessionPath": "./session",
  "qrTimeout": 60,
  "multiDevice": true
}

phoneNumber: Your WhatsApp number.

sessionPath: Path to store session data.

qrTimeout: Time limit (in seconds) to scan the QR code.

multiDevice: Set to true for multi-device support.


🤖 Bot Settings

"botSettings": {
  "botName": "Spectra",
  "prefix": "+",
  "ownerNumber": "YOUR_NUMBER",
  "language": "en",
  "timeZone": "Asia/nepal"
}

botName: The bot's display name.

prefix: The command prefix (default: +).

ownerNumber: The primary owner/admin of the bot.

language: Default language (English).

timeZone: The bot's timezone settings.


🔒 Admin & Whitelist Mode

"adminOnly": {
  "enable": false,
  "adminNumbers": ["ADMIN_NUMBER", "Add More If You Want"]
},
"whiteListMode": {
  "enable": false,
  "allowedNumbers": [""]
}

adminOnly.enable: Restrict bot usage to admins only.

adminNumbers: List of authorized admin numbers.

whiteListMode.enable: Restrict usage to whitelisted numbers.


🔄 Auto-Read & Message Handling

"messageHandling": {
  "autoRead": true,
  "deleteCommandMessages": false,
  "logMessages": true
}

autoRead: Automatically mark messages as read.

deleteCommandMessages: Delete messages after executing commands.

logMessages: Log incoming messages.


🚫 Anti-Spam System

"antiSpam": {
  "enable": true,
  "cooldownTime": 5
}

enable: Activate the anti-spam system.

cooldownTime: Set cooldown time (in seconds) between commands.


🔗 Webhooks & Logging

"webhooks": {
  "enable": false,
  "url": ""
},
"logEvents": {
  "enable": true,
  "logErrors": true,
  "logCommands": true
}

webhooks.enable: Enable webhook integration.

logEvents.enable: Enable logging of bot activities.

logErrors: Log bot errors.

logCommands: Log executed commands.


🔄 Auto-Restart & Uptime Monitoring

"serverUptime": {
  "enable": true,
  "port": 3001
},
"autoRestart": {
  "enable": false,
  "time": null
}

serverUptime.enable: Monitor bot uptime.

port: Server port for uptime monitoring.

autoRestart.enable: Auto-restart bot at a scheduled time.


📜 Usage

To see available commands, type:

+help

The bot will display all supported commands.

New commands will be added in future updates.


⚠️ Disclaimer

This bot is under copyright license.

Unauthorized copying, modification, or redistribution is strictly prohibited.


🎯 Contribution

Want to contribute? Fork the repo and submit a pull request!

📞 Support

For queries, contact the creator Mr Perfect or contributor Priyanshi Kaur.

And if you want to contribute in our project we are happy to have you. 

