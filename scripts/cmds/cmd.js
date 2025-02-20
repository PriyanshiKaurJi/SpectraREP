const fs = require('fs');
const path = require('path');

const uninstallFolder = path.resolve(__dirname, 'uninstall');
if (!fs.existsSync(uninstallFolder)) {
    fs.mkdirSync(uninstallFolder);
}

global.cc.loadCommand = function (commandName) {
    try {
        const commandPath = path.resolve(__dirname, `${commandName}.js`);
        if (fs.existsSync(commandPath)) {
            const command = require(commandPath);
            global.commands.set(command.name, command);
            return `✅ | "${commandName}" has been loaded successfully.`;
        } else {
            return `Command "${commandName}" does not exist.`;
        }
    } catch (error) {
        return `Failed to load ${commandName}: ${error.message}`;
    }
};

global.cc.loadAll = function () {
    const commandFiles = fs.readdirSync(path.resolve(__dirname)).filter(file => file.endsWith('.js'));
    let successCount = 0;
    let failCount = 0;
    let result = [];

    for (const file of commandFiles) {
        const commandPath = path.resolve(__dirname, file);
        try {
            const command = require(commandPath);
            global.commands.set(command.name, command);
            successCount++;
            result.push(`${file} loaded successfully.`);
        } catch (error) {
            failCount++;
            result.push(`Failed to load ${file}: ${error.message}`);
        }
    }

    return `${successCount} Commands Loaded Successfully\n${failCount} Failed to Load\n${result.join('\n')}`;
};

global.cc.unloadCommand = function (commandName) {
    try {
        const commandPath = path.resolve(__dirname, `${commandName}.js`);
        if (fs.existsSync(commandPath)) {
            delete require.cache[require.resolve(commandPath)];
            global.commands.delete(commandName);
            return `✅ | "${commandName}" has been unloaded successfully.`;
        } else {
            return `Command "${commandName}" does not exist.`;
        }
    } catch (error) {
        return `Failed to unload ${commandName}: ${error.message}`;
    }
};

global.cc.unloadAll = function () {
    const commandFiles = fs.readdirSync(path.resolve(__dirname)).filter(file => file.endsWith('.js'));
    let successCount = 0;
    let failCount = 0;
    let result = [];

    for (const file of commandFiles) {
        const commandPath = path.resolve(__dirname, file);
        try {
            delete require.cache[require.resolve(commandPath)];
            global.commands.delete(file.replace('.js', ''));
            successCount++;
            result.push(`${file} unloaded successfully.`);
        } catch (error) {
            failCount++;
            result.push(`Failed to unload ${file}: ${error.message}`);
        }
    }

    return `${successCount} Commands Unloaded Successfully\n${failCount} Failed to Unload\n${result.join('\n')}`;
};

global.cc.deleteCommand = function (commandName) {
    try {
        const commandPath = path.resolve(__dirname, `${commandName}.js`);
        if (fs.existsSync(commandPath)) {
            fs.unlinkSync(commandPath);
            return `✅ | "${commandName}" has been deleted successfully.`;
        } else {
            return `Command "${commandName}" does not exist.`;
        }
    } catch (error) {
        return `Failed to delete ${commandName}: ${error.message}`;
    }
};

global.cc.deleteAll = function () {
    const commandFiles = fs.readdirSync(path.resolve(__dirname)).filter(file => file.endsWith('.js'));
    let successCount = 0;
    let failCount = 0;
    let result = [];

    for (const file of commandFiles) {
        const commandPath = path.resolve(__dirname, file);
        try {
            fs.unlinkSync(commandPath);
            successCount++;
            result.push(`${file} deleted successfully.`);
        } catch (error) {
            failCount++;
            result.push(`Failed to delete ${file}: ${error.message}`);
        }
    }

    return `${successCount} Commands Deleted Successfully\n${failCount} Failed to Delete\n${result.join('\n')}`;
};

module.exports = {
    name: 'cmd',
    description: 'Load, manage, install, unload, and delete commands',
    permission: 0,
    cooldowns: 5,
    dmUser: true,
    run: async ({ sock, m, args }) => {
        const command = args[0]?.toLowerCase();

        if (command === 'load') {
            const commandName = args[1]?.toLowerCase();
            if (commandName) {
                const message = global.cc.loadCommand(commandName);
                await sock.sendMessage(m.key.remoteJid, { text: message });
            } else {
                await sock.sendMessage(m.key.remoteJid, { text: 'Please specify a command to load.' });
            }
        } else if (command === 'loadall') {
            const message = global.cc.loadAll();
            await sock.sendMessage(m.key.remoteJid, { text: message });
        } else if (command === 'unload') {
            const commandName = args[1]?.toLowerCase();
            if (commandName) {
                const message = global.cc.unloadCommand(commandName);
                await sock.sendMessage(m.key.remoteJid, { text: message });
            } else {
                await sock.sendMessage(m.key.remoteJid, { text: 'Please specify a command to unload.' });
            }
        } else if (command === 'unloadall') {
            const message = global.cc.unloadAll();
            await sock.sendMessage(m.key.remoteJid, { text: message });
        } else if (command === 'delete') {
            const commandName = args[1]?.toLowerCase();
            if (commandName) {
                const message = global.cc.deleteCommand(commandName);
                await sock.sendMessage(m.key.remoteJid, { text: message });
            } else {
                await sock.sendMessage(m.key.remoteJid, { text: 'Please specify a command to delete.' });
            }
        } else if (command === 'deleteall') {
            const message = global.cc.deleteAll();
            await sock.sendMessage(m.key.remoteJid, { text: message });
        } else if (command === 'cancel') {
            const commandName = args[1]?.toLowerCase();
            if (commandName) {
                try {
                    const commandPath = path.resolve(__dirname, `${commandName}.js`);
                    if (fs.existsSync(commandPath)) {
                        const uninstallPath = path.resolve(uninstallFolder, `${commandName}.js`);
                        fs.renameSync(commandPath, uninstallPath);
                        await sock.sendMessage(m.key.remoteJid, { text: `${commandName} moved to uninstall folder.` });
                    } else {
                        await sock.sendMessage(m.key.remoteJid, { text: `Command ${commandName} does not exist.` });
                    }
                } catch (error) {
                    await sock.sendMessage(m.key.remoteJid, { text: `Failed to cancel ${commandName}: ${error.message}` });
                }
            } else {
                await sock.sendMessage(m.key.remoteJid, { text: 'Please specify a command to cancel.' });
            }
        } else if (command === 'share') {
            const commandName = args[1]?.toLowerCase();
            if (commandName) {
                try {
                    const commandPath = path.resolve(__dirname, `${commandName}.js`);
                    if (fs.existsSync(commandPath)) {
                        const code = fs.readFileSync(commandPath, 'utf-8');
                        await sock.sendMessage(m.key.remoteJid, { text: `Here is the code for ${commandName}:\n\n${code}`});
                    } else {
                        await sock.sendMessage(m.key.remoteJid, { text: `Command ${commandName} does not exist.` });
                    }
                } catch (error) {
                    await sock.sendMessage(m.key.remoteJid, { text: `Failed to fetch the code for ${commandName}: ${error.message}` });
                }
            } else {
                await sock.sendMessage(m.key.remoteJid, { text: 'Please specify a command to share.' });
            }
        } else if (command === 'install') {
            const commandName = args[1]?.toLowerCase();
            const commandCode = args.slice(2).join(' ');
            if (commandName && commandCode) {
                await sock.sendMessage(m.key.remoteJid, { text: `Installing command ${commandName}...` });

                try {
                    const commandDir = path.resolve(__dirname);
                    if (!fs.existsSync(commandDir)) {
                        fs.mkdirSync(commandDir, { recursive: true });
                    }

                    const commandPath = path.resolve(commandDir, `${commandName}.js`);
                    fs.writeFileSync(commandPath, commandCode);
                    setTimeout(async () => {
                        const message = `Successfully Installed ${commandName}`;
                        await sock.sendMessage(m.key.remoteJid, { text: message });
                    }, 7000); 
                } catch (error) {
                    await sock.sendMessage(m.key.remoteJid, { text: `Error while installing ${commandName}: ${error.message}` });
                }
            } else {
                await sock.sendMessage(m.key.remoteJid, { text: 'Please provide both command name and code.' });
            }
        } else {
            await sock.sendMessage(m.key.remoteJid, { text: 'Invalid option. Use load, loadall, unload, unloadall, delete, deleteall, cancel, share, or install.' });
        }
    },
};
