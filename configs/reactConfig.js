const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');

const baseConfig = {
    builds: [
        {
            src: 'package.json',
            use: '@now/static-build',
            config: {
                distDir: 'build'
            },
        }
    ],
    routes: [
       { 
        handle: 'filesystem',
        src: '/.*',
        dest: 'index.html'
    }
]
}

async function reactConfig(config) {
    const answers = await inquirer.prompt([
        {
            type: 'text',
            name: 'directory',
            message: 'What is the build directory?',
            default: 'build',
        },
        {
            type: 'confirm',
            name: 'addBuildScript',
            message: 'Do you want to add/update a now-build script to your package.json?',
            default: true,
        },
    ]);

    if (answers.addBuildScript) {
        try {
            const packageJSONPath = path.join(process.cwd(), 'package.json');
            const packageJSON = require(packageJSONPath);
            const buildScript = (packageJSON.scripts || {})['now-build'] || 'npm run build';   
            const buildAnswers = await inquirer.prompt([
                {
                    type: 'text',
                    name: 'buildScript',
                    message: 'What is the build command?',
                    default: buildScript,
                },
            ]);
            packageJSON.scripts = packageJSON.scripts || {};
            packageJSON.scripts['now-build'] = buildAnswers.buildScript;
            fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2), 'utf8');
        } catch (error) {
            console.error('package.json does not exists');
            process.exit(1);
        }
    }

    baseConfig.builds[0].config.distDir = answers.directory;


    return {
        ...config,
        ...baseConfig
    }
}

module.exports = reactConfig