const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const nodeExpressConfig = require('../configs/nodeExpress');
const staticConfig = require('../configs/static');
const reactConfig = require('../configs/reactConfig');


const existingConfig =  fs.existsSync('now.json')

async function createConfig() {

    let config = {
        version: 2,
    };

    const answers = await inquirer.prompt([
        {
            type: 'text',
            name: 'name',
            message: 'What is the name of your project?',
            default: path.basename(process.cwd())
        },
        {
            type: 'list',
            name: 'type',
            message: 'What type of project is this?',
            choices: ['node-express', 'static', 'react', 'static-build', 'lambda'],
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
                config = await reactConfig(config);
                break;
            default:
                break;
        }
        console.log(config);
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

