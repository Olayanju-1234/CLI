const path = require('path');
const inquirer = require('inquirer');

const baseConfig = {
    builds
    : [{ 
        src: 'src/app.js',
        use: '@now/node-server'
    }],
    routes: [
        { src: '/.*', dest: 'src/app.js' }
]
}

async function nodeExpressConfig(config) {
    let mainFile = 'src/app.js';
    
    try {
        const packageJSON = require(path.join(process.cwd(), 'package.json'))
        mainFile = packageJSON.main;
    } catch (error) {
    }

    const answers = await inquirer.prompt([
        {
            type: 'text',
            name: 'main',
            message: 'What is the path to your express entry point?',
            default: mainFile,
        }
    ]);

    baseConfig.builds[0].src = answers.main;
    baseConfig.routes[0].dest = answers.main;

    return {
        ...config,
        ...baseConfig
    }
}

module.exports = nodeExpressConfig