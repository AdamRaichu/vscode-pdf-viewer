const vscode = require("vscode");

export default class PDFDoc extends vscode.CustomDocument {
  constructor(uri){
    super()
    this.uri = uri;
  }
}