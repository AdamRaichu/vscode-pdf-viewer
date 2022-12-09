const vscode = require("vscode");

export default class PDFDoc {
  constructor(uri) {
    this._uri = uri;
  }

  async dispose() {}
  get uri() {
    return this.uri;
  }
}
