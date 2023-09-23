require('dotenv').config();

// utils
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const consola = require('consola');

// class
const Project = require('./src/class/Project');

// enum
const npmCommandEnum = require('./src/enum/npm-command.enum');
const environmentEnum = require('./src/enum/environment.enum');

// env
const {
  PROJECT_FRONT_PATH,
  PROJECT_BACK_PATH,
  URL_DEVELOPMENT,
  URL_LOCAL,
  ENV_FRONT,
} = process.env;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Dev or local? ', (userInput) => {
  const input = userInput.toLowerCase();
  switch (input) {
    case environmentEnum.DEVELOPMENT:
      openProject(environmentEnum.DEVELOPMENT);
      break;
    case environmentEnum.LOCAL:
      openProject(environmentEnum.LOCAL);
      break;
    default:
      consola.warn('Invalid input: ', userInput);
      break;
  }

  rl.close();
});

/**
 *
 * @param {*} environment
 */
function openProject(environment) {
  runFront(environment);

  if (environment === environmentEnum.LOCAL) {
    runBack();
  }
}

/**
 *
 * @param {*} environment
 */
function runFront(environment) {
  const path = PROJECT_FRONT_PATH;
  const npm = npmCommandEnum.dev;
  const frontCreator = new Project(path, npm);

  setEnv(frontCreator, environment);

  frontCreator.openVscode();
  frontCreator.run();
}

/**
 *
 * @param {*} frontCreator
 * @param {*} environment
 */
function setEnv(frontCreator, environment) {
  const envFilePath = path.join(frontCreator.path, '.env');
  const envFileContent = fs.readFileSync(envFilePath, 'utf-8');

  const projectUrl = environment === environmentEnum.DEVELOPMENT ?
    URL_DEVELOPMENT :
    URL_LOCAL;

  const pattern = `/^${ENV_FRONT}\s*=\s*".*?"\s*$/gm`;

  const modifiedEnvContent = envFileContent.replace(
      pattern,
      `${ENV_FRONT}="${projectUrl}"`,
  );

  fs.writeFileSync(envFilePath, modifiedEnvContent, 'utf-8');
}

/** */
async function runBack() {
  const path = PROJECT_BACK_PATH;
  const npm = npmCommandEnum.local;
  const backCreator = new Project(path, npm);

  backCreator.openVscode();
  backCreator.run();
}
