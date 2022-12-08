const vscode = require("vscode");
const PDFDoc = require("./doc");

export default class PDFEdit {
  static register() {
    const provider = new PDFEdit();
    return vscode.window.registerCustomEditorProvider(PDFEdit.viewType, provider);
  }

  static viewType = "pdfViewer.PDFEdit";

  constructor() {}

  async resolveCustomEditor(_document, panel, _token) {
    panel.webview.html = `<!DOCTYPE html>
<html>

<head>
  <style type="text/css">
    html {
      overflow: auto;
    }

    html,
    body,
    div,
    iframe {
      margin: 0px;
      padding: 0px;
      height: 100%;
      border: none;
    }

    iframe {
      display: block;
      width: 100%;
      border: none;
      overflow-y: auto;
      overflow-x: hidden;
    }
  </style>
</head>

<body>

  <iframe id="frame" src="https://adamraichu.github.io/"
    frameborder="0"
    marginheight="0"
    marginwidth="0"
    width="100%"
    height="100%"
    scrolling="auto">
  </iframe>

</body>

</html>`;
  }

  async openCustomDocument(uri, _context, _token) {
    return new PDFDoc(uri);
  }
}
