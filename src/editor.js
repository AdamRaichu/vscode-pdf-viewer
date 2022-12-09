const vscode = require("vscode");

class PDFDoc {
  constructor(uri) {
    this._uri = uri;
  }

  async dispose() {}
  get uri() {
    return this._uri;
  }
}

export default class PDFEdit {
  static register() {
    const provider = new PDFEdit();
    return vscode.window.registerCustomEditorProvider(PDFEdit.viewType, provider);
  }

  static viewType = "pdfViewer.PDFEdit";

  constructor() {}

  async resolveCustomEditor(_document, panel, _token) {
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
    // panel.webview.postMessage({ command: "setFrameURI", URI: "" });
  }

  async openCustomDocument(uri, _context, _token) {
    return new PDFDoc(uri);
  }
}
