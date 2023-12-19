const vscode = acquireVsCodeApi();
const oldState = vscode.getState();
var workerSrc = "";

if (oldState) {
  previewPdf(oldState.base64Data);
}

window.addEventListener("message", (event) => {
  if (event.data.command === "base64") {
    workerSrc = event.data.workerUri;
    previewPdf(event.data.data);
    vscode.setState({ base64Data: event.data.data });
  }
});

function previewPdf(base64Data) {
  document.getElementById("loading")?.remove();

  var PDFJS = window["pdfjs-dist/build/pdf"];

  PDFJS.GlobalWorkerOptions.workerSrc = workerSrc;

  var loadingTask = PDFJS.getDocument("data:application/pdf;base64," + base64Data);

  loadingTask.promise.then(
    function (pdf) {
      var canvasdiv = document.getElementById("canvas");
      var totalPages = pdf.numPages;

      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        pdf.getPage(pageNumber).then(function (page) {
          var scale = 1.5;
          var viewport = page.getViewport({ scale: scale });

          var canvas = document.createElement("canvas");
          canvasdiv.appendChild(canvas);

          // Prepare canvas using PDF page dimensions
          var context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          var renderContext = { canvasContext: context, viewport: viewport };

          var renderTask = page.render(renderContext);
        });
      }
    },
    function (reason) {
      // PDF loading error
      console.error(reason);
    }
  );
}
