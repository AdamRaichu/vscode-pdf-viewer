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

  async getFileBlobUri(uri) {
    var r = new Promise(function (resolve, reject) {
      const p = vscode.workspace.fs.readFile(uri);
      var z = new JSZip();
      z.file("filename.pdf", p);
      z.files[0].async("blob").then(
        function (f) {
          resolve(URL.createObjectURL(f));
        },
        function (err) {
          vscode.window.showErrorMessage("There was an error converting the pdf file to a url.");
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
  <script>
    window.addEventListener("message", e => {
      if (e.data.command === "setFrameURI") {
        document.getElementById("frame").src = e.data.URI;
      }
    });
  </script>
  <link rel="stylesheet" href="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "iframe.css"))}">
</head>

<body>

  <iframe id="frame" src="data:text/html,PDF Viewer is loading your content..."
    frameborder="0"
    marginheight="0"
    marginwidth="0"
    width="100%"
    height="100%"
    scrolling="auto">
  </iframe>

</body>

</html>`;
    panel.webview.postMessage({ command: "setFrameURI", URI: await document.getFileBlobUri(document.uri) });
  }

  async openCustomDocument(uri, _context, _token) {
    return new PDFDoc(uri);
  }
}
