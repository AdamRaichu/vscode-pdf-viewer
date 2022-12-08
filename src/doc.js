const vscode = require("vscode");

export default class PDFDoc {
  constructor(uri){
    this._uri = uri;
  }

  async dispose() {};
  uri = this._uri;
}