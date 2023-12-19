import PDFEdit from "./editor.js";
import PdfViewerApi from "./api.js";

exports.activate = function (context) {
  PDFEdit.register();
  return PdfViewerApi;
};
