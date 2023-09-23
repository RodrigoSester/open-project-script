const consola = require('consola');
const {exec} = require('child_process');

/**
 * class Project
 */
class Project {
  /**
   *
   * @param {*} path
   * @param {*} npmCommand
   */
  constructor(path, npmCommand) {
    this.path = path;
    this.npmCommand = npmCommand;
  }

  /** */
  openVscode() {
    exec(`cd ${this.path} && code .`);
  }

  /** */
  run() {
    exec(`cd ${this.path} && start bash -c "${this.npmCommand}"`,
        async (error) => {
          if (error) {
            consola.fatal(`Error running project: ${error}`);
          }
        });
  }
}

module.exports = Project;
