import PdfViewerApi from "./api";

const vscode = require("vscode");
const JSZip = require("jszip");

/**
 * @implements {import("..").PdfFileDataProvider}
 */
class PDFDoc {
  constructor(uri) {
    this._uri = uri;
  }

  async dispose() {}

  get uri() {
    return this._uri;
  }

  async getFileData() {
    var uri = this.uri;
    return new Promise(function (resolve, reject) {
      vscode.workspace.fs.readFile(uri).then(
        function (fileData) {
          return PdfViewerApi.PdfFileDataProvider.fromUint8Array(fileData)
            .getFileData()
            .then(function (data) {
              resolve(data);
            });
        },
        function (err) {
          reject(err);
        }
      );
    });
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
    PDFEdit.previewPdfFile(document, panel);
  }

  async openCustomDocument(uri, _context, _token) {
    return new PDFDoc(uri);
  }

  /**
   *
   * @param {import("..").PdfFileDataProvider} dataProvider The object containing the pdf file data.
   * @param {vscode.WebviewPanel} panel The webview panel object to use.
   */
  static previewPdfFile(dataProvider, panel) {
    const extUri = vscode.extensions.getExtension("adamraichu.pdf-viewer").extensionUri;
    panel.webview.options = {
      enableScripts: true,
    };
    panel.webview.html = `<!DOCTYPE html>
<html>

<head>
  <script defer src="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "pdf.min.js"))}"></script>
  <script defer src="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "editor.js"))}"></script>
  <link rel="stylesheet" href="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "editor.css"))}">
</head>

<body>

  <div id="loading">
    <h1>Your PDF is loading...</h1>
    <p>If you see this screen for more than a few seconds, close this editor tab and reopen the file.</p>
  </div>
  <div id="canvas"></div>

</body>

</html>`;
    dataProvider.getFileData().then(function (data) {
      panel.webview.postMessage({ command: "base64", data: data, workerUri: panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "pdf.worker.min.js")).toString(true) });
    });
  }
}
