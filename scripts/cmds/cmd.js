const fs = require('fs');
const path = require('path');

const commandDir = path.resolve(__dirname);
const uninstallFolder = path.resolve(__dirname, 'uninstall');

if (!fs.existsSync(uninstallFolder)) {
    fs.mkdirSync(uninstallFolder, { recursive: true });
}

global.cc.loadCommand = function (commandName) {
    try {
        const commandPath = path.join(commandDir, `${commandName}.js`);
        if (!fs.existsSync(commandPath)) return `❌ Command "${commandName}" does not exist.`;

        delete require.cache[require.resolve(commandPath)];
        const command = require(commandPath);
        global.commands.set(command.name, command);

        return `✅ Loaded "${commandName}" successfully.`;
    } catch (error) {
        return `❌ Failed to load "${commandName}": ${error.message}`;
    }
};

global.cc.loadAll = function () {
    const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'));
    let successCount = 0, failCount = 0, results = [];

    for (const file of commandFiles) {
        const commandName = file.replace('.js', '');
        const message = global.cc.loadCommand(commandName);
        message.includes('✅') ? successCount++ : failCount++;
        results.push(message);
    }

    return `📂 ${successCount} commands loaded.\n❌ ${failCount} failed.\n\n${results.join('\n')}`;
};

global.cc.unloadCommand = function (commandName) {
    try {
        const commandPath = path.join(commandDir, `${commandName}.js`);
        if (!fs.existsSync(commandPath)) return `❌ Command "${commandName}" does not exist.`;

        delete require.cache[require.resolve(commandPath)];
        global.commands.delete(commandName);

        return `✅ Unloaded "${commandName}" successfully.`;
    } catch (error) {
        return `❌ Failed to unload "${commandName}": ${error.message}`;
    }
};

global.cc.unloadAll = function () {
    const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'));
    let successCount = 0, failCount = 0, results = [];

    for (const file of commandFiles) {
        const commandName = file.replace('.js', '');
        const message = global.cc.unloadCommand(commandName);
        message.includes('✅') ? successCount++ : failCount++;
        results.push(message);
    }

    return `🗑 ${successCount} commands unloaded.\n❌ ${failCount} failed.\n\n${results.join('\n')}`;
};

global.cc.deleteCommand = function (commandName) {
    try {
        const commandPath = path.join(commandDir, `${commandName}.js`);
        if (!fs.existsSync(commandPath)) return `❌ Command "${commandName}" does not exist.`;

        fs.unlinkSync(commandPath);
        return `🗑 Deleted "${commandName}" successfully.`;
    } catch (error) {
        return `❌ Failed to delete "${commandName}": ${error.message}`;
    }
};

global.cc.deleteAll = function () {
    const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'));
    let successCount = 0, failCount = 0, results = [];

    for (const file of commandFiles) {
        const commandName = file.replace('.js', '');
        const message = global.cc.deleteCommand(commandName);
        message.includes('🗑') ? successCount++ : failCount++;
        results.push(message);
    }

    return `🚮 ${successCount} commands deleted.\n❌ ${failCount} failed.\n\n${results.join('\n')}`;
};

global.cc.cancelCommand = function (commandName) {
    try {
        const commandPath = path.join(commandDir, `${commandName}.js`);
        const uninstallPath = path.join(uninstallFolder, `${commandName}.js`);

        if (!fs.existsSync(commandPath)) return `❌ Command "${commandName}" does not exist.`;

        fs.renameSync(commandPath, uninstallPath);
        return `🔁 Moved "${commandName}" to uninstall folder.`;
    } catch (error) {
        return `❌ Failed to cancel "${commandName}": ${error.message}`;
    }
};

global.cc.shareCommand = function (commandName) {
    try {
        const commandPath = path.join(commandDir, `${commandName}.js`);
        if (!fs.existsSync(commandPath)) return `❌ Command "${commandName}" does not exist.`;

        return fs.readFileSync(commandPath, 'utf-8');
    } catch (error) {
        return `❌ Failed to fetch "${commandName}": ${error.message}`;
    }
};

global.cc.installCommand = function (commandName, commandCode) {
    try {
        if (!commandName || !commandCode) return `❌ Provide command name and code.`;

        const commandPath = path.join(commandDir, `${commandName}.js`);
        fs.writeFileSync(commandPath, commandCode);
        
        setTimeout(() => {
            global.cc.loadCommand(commandName);
        }, 5000);

        return `⚙️ Installing "${commandName}"...`;
    } catch (error) {
        return `❌ Error installing "${commandName}": ${error.message}`;
    }
};

module.exports = {
    name: 'cmd',
    description: 'Manage bot commands dynamically.',
    permission: 0,
    cooldowns: 5,
    dmUser: true,
    run: async ({ sock, m, args }) => {
        const command = args[0]?.toLowerCase();
        const commandName = args[1]?.toLowerCase();
        const commandCode = args.slice(2).join(' ');

        let message;
        switch (command) {
            case 'load': message = global.cc.loadCommand(commandName); break;
            case 'loadall': message = global.cc.loadAll(); break;
            case 'unload': message = global.cc.unloadCommand(commandName); break;
            case 'unloadall': message = global.cc.unloadAll(); break;
            case 'delete': message = global.cc.deleteCommand(commandName); break;
            case 'deleteall': message = global.cc.deleteAll(); break;
            case 'cancel': message = global.cc.cancelCommand(commandName); break;
            case 'share': message = global.cc.shareCommand(commandName); break;
            case 'install': message = global.cc.installCommand(commandName, commandCode); break;
            default: message = `❌ Invalid command. Use: load, loadall, unload, unloadall, delete, deleteall, cancel, share, install.`; break;
        }

        await sock.sendMessage(m.key.remoteJid, { text: message });
    },
};