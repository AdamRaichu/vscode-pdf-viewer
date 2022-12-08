const vscode = require("vscode");

export default class PDFDoc {
  constructor(uri){
    super()
    this._uri = uri;
  }

  async dispose() {};
  uri = this._uri;
}