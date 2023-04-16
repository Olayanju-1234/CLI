#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const nodeExpressConfig = require('./configs/nodeExpress');
const staticConfig = require('./configs/static');
const frontend = require('./configs/frontendCon');

const nowPath = path.join(process.cwd(), 'now.json');
const existingConfig =  fs.existsSync(nowPath) ? require(nowPath) : {};

async function createConfig() {

    let config = {
        version: 2,
    };

    const answers = await inquirer.prompt([
        {
            type: 'text',
            name: 'name',
            message: 'What is the name of your project? (default: current directory name)',
            default: path.basename(process.cwd())
        },
        {
            type: 'list',
            name: 'type',
            message: 'What type of project is this?',
            choices: ['node-express', 'static', 'react', 'vue', 'static-build'],
        },
    ])
        config.name = answers.name;
        switch (answers.type) {
            case 'node-express':
                config = await nodeExpressConfig(config);
                break;
            case 'static':
                config = await staticConfig(config);
                break;
            case 'react':
                config = await frontend(config, 'build');
                break;
            case 'vue':
                config = await frontend(config);
                break;
            case 'static-build':
                config = await frontend(config);
                break;
            default:
                break;
        }
        
        const moreAnswers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'specifyAlias',
                message: 'Would you like to specify an alias?',
                default: true
            },
            {
                type: 'text',
                name: 'alias',
                message: 'What is the alias you want to use? (e.g. my-project.now.sh. You can specify multiple aliases)',
                default: answers.name,
                when: a => a.specifyAlias,
            },
        ]
        )
        config.alias = moreAnswers.alias ? moreAnswers.alias.split(',').map(a => a.trim()) : []; 

        fs.writeFileSync(nowPath, JSON.stringify(config, null, 2), 'utf8');

        console.log('now.json created! 🎉 To deploy, run `now`');

        process.exit(0);



}


if (existingConfig) {
inquirer.prompt([
    {
    type: 'confirm',
    name: 'overwrite',
    message: 'now.json exists. Do you want to overwrite the existing config?',
    default: false
    }
  ]).then(answers => {
    if (answers.overwrite) {
      createConfig()
    } else {
        console.log('Exiting 👋');
    }
  });
} else {
    createConfig();
}

