const vscode = require("vscode");
const JSZip = require("jszip");

class PDFDoc {
  constructor(uri) {
    this._uri = uri;
  }

  async dispose() {}

  get uri() {
    return this._uri;
  }

  async getFileData(uri) {
    var r = new Promise(function (resolve, reject) {
      const p = vscode.workspace.fs.readFile(uri);
      var z = new JSZip();
      z.file("filename.pdf", p);
      z.files["filename.pdf"].async("base64").then(
        function (f) {
          resolve(f);
        },
        function (err) {
          vscode.window.showErrorMessage("There was an error converting the pdf file to base64.");
          reject(err);
        }
      );
    });
    return r;
  }
}

export default class PDFEdit {
  static register() {
    const provider = new PDFEdit();
    return vscode.window.registerCustomEditorProvider(PDFEdit.viewType, provider);
  }

  static viewType = "pdfViewer.PDFEdit";

  constructor() {}

  async resolveCustomEditor(document, panel, _token) {
    panel.webview.options = {
      enableScripts: true,
    };
    var extUri = vscode.extensions.getExtension("adamraichu.pdf-viewer").extensionUri;
    panel.webview.html = `<!DOCTYPE html>
<html>

<head>
  <script src="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "pdf.min.js"))}"></script>
  <script src="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "editor.js"))}"></script>
  <link rel="stylesheet" href="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "editor.css"))}">
</head>

<body>

  <div id="loading">Your PDF is loading...</div>
  <div id="canvas"></div>

</body>

</html>`;
    document.getFileData(document.uri).then(function (data) {
      panel.webview.postMessage({ command: "base64", data: data, workerUri: vscode.Uri.joinPath(extUri, "media", "pdf.worker.js") });
    });
  }

  async openCustomDocument(uri, _context, _token) {
    return new PDFDoc(uri);
  }
}
