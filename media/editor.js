console.log("media/editor.js is present");

window.addEventListener("message", (e) => {
  console.log({ e });
  if (e.data.command === "base64") {
    document.getElementById("loading").remove();

    var PDFJS = window["pdfjs-dist/build/pdf"];

    PDFJS.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.1.81/pdf.worker.min.js";

    var loadingTask = PDFJS.getDocument("data:application/pdf;base64," + e.data.data);

    loadingTask.promise.then(
      function (pdf) {
        var canvasdiv = document.getElementById("canvas");
        var totalPages = pdf.numPages;
        var data = [];

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
            renderTask.promise.then(function () {
              data.push(canvas.toDataURL("image/png"));
              console.log(data.length + " page(s) loaded in data");
            });
          });
        }
      },
      function (reason) {
        // PDF loading error
        console.error(reason);
      }
    );
  }
});
