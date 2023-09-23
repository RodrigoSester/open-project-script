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
    exec(`cd ${this.path} && start bash -c "${this.npmCommand}"`);
  }
}

module.exports = Project;
