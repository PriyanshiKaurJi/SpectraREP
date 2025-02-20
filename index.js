const chalk = require('chalk');
const figlet = require('figlet');


console.clear();
console.log('\n'.repeat(2));

const terminalWidth = process.stdout.columns || 80;
const line = chalk.bold.rgb(255, 165, 0)('─'.repeat(terminalWidth)); 

const spectraText = figlet.textSync('SPECTRA', {
  font: 'Small', 
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: terminalWidth, 
  whitespaceBreak: true
});

// Display banner
console.log(line);
console.log(chalk.blueBright(spectraText)); 
console.log(chalk.cyan.bold('Spectra Bot - A Simple WhatsApp Chat Bot'));
console.log(chalk.magenta('    Created By Mr - Perfect with ❤️'));
console.log(
  chalk.yellow.bold(
    'Source Code: https://github.com/Mr-Perfect-Spector/Spectra'
  )
);
console.log(line)

console.log(
  chalk.red.bold(
    '\n⚠️  WARNING: Do not attempt to claim this project as your own, modify the author, or remove credits.\n'
  )
);

console.log(line);


require('./bot.js');
