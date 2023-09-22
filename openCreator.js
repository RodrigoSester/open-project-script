const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class Project {
  constructor(path, npmCommand) {
    this.path = path;
    this.npmCommand = npmCommand;
  }

  openVscode() {
    exec(`code ${this.path}`, (error) => {
      if (error) {
        console.error(`There is an error: ${error}`);
        return;
      }
    })
  }

  run() {
    const childProcess = exec(`cd ${this.path} && start bash -c "${this.npmCommand}"`, (npmError, npmStdout, npmStderr) => {
      console.log("LOG: -> exec -> npmStdout, npmStderr:", npmStdout, npmStderr);
      if (npmError) {
        console.error(`Error running npm command: ${npmError}`);
        return;
      }
    });

    childProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Dev or local? ', (userInput) => {
  switch (userInput) {
    case 'dev':
      openCreator('dev');
      break;
    case 'local':
      openCreator('local');
      break;
    default:
      console.log('Invalid input: ', userInput);
      break;
  }

  rl.close();
});

function openCreator(environment) {
  runFront(environment);

  if (environment === 'local') {
    runBack();
  }
}

function runFront(environment) {
  const path = 'C:/workspace/Creator/imersys_creator-v2';
  const npm = 'npm run dev';
  const frontCreator = new Project(path, npm);

  setEnv(frontCreator, environment);

  frontCreator.openVscode();
  frontCreator.run();
}

function setEnv(frontCreator, environment) {
  const envFilePath = path.join(frontCreator.path, '.env');
  const envFileContent = fs.readFileSync(envFilePath, 'utf-8');

  const CREATOR_URL = environment === 'dev' ? 'https://api.dev-plataforma.grupoa.education/v1/creator/bff' : 'http://localhost:3001/v1/creator/bff';

  const pattern = /^CREATOR_URL\s*=\s*".*?"\s*$/gm;

  const modifiedEnvContent = envFileContent.replace(pattern, `CREATOR_URL="${CREATOR_URL}"`);

  fs.writeFileSync(envFilePath, modifiedEnvContent, 'utf-8');
}

async function runBack() {
  const path = 'C:/workspace/Creator/imersys_creator-bff-api';
  const npm = 'npm run local';
  const backCreator = new Project(path, npm);

  backCreator.openVscode();
  backCreator.run();
}
