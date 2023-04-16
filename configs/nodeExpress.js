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
        const packageJSON = require(process.cwd() + '/package.json')
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
    console.log(answers);
    return {
        ...baseConfig,
        ...config
    }
}

module.exports = {
    nodeExpressConfig
}