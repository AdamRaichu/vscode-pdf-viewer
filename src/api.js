import PDFEdit from "./editor";
const JSZip = require("jszip");
const vscode = require("vscode");

class DataTypeEnum {
  static BASE64STRING = "base64";
  static UINT8ARRAY = "u8array";
}

class PdfFileDataProvider {
  static DataTypeEnum = DataTypeEnum;

  type;
  data;
  name;

  /**
   *
   * @param {DataTypeEnum} type What type the data is.
   * @param {string|Uint8Array} data The file data.
   */
  constructor(type, data) {
    this.type = type;
    this.data = data;
    this.name = "PDF Preview (via API)";
  }

  static fromBase64String(base64Data) {
    return new PdfFileDataProvider(DataTypeEnum.BASE64STRING, base64Data);
  }

  static fromUint8Array(u8array) {
    return new PdfFileDataProvider(DataTypeEnum.UINT8ARRAY, u8array);
  }

  withName(newName) {
    this.name = newName;
    return this;
  }

  getFileData() {
    var _data = this.data;
    var _type = this.type;
    return new Promise(function (resolve, reject) {
      if (typeof _data === "undefined") {
        reject(new TypeError("Cannot get file data because data is undefined."));
      }
      switch (_type) {
        case DataTypeEnum.BASE64STRING:
          resolve(_data);
          break;
        case DataTypeEnum.UINT8ARRAY:
          var z = new JSZip();
          z.file("filename.pdf", _data);
          z.files["filename.pdf"].async("base64").then(
            function (f) {
              resolve(f);
            },
            function (err) {
              reject(err);
              console.error("HINT from PDF Viewer API: There was an error converting the pdf file data from a Uint8Array to a base64 string using JSZip.");
            }
          );
          break;

        default:
          reject(new TypeError("Unknown data type " + _type));
          break;
      }
    });
  }
}

export default class PdfViewerApi {
  static PdfFileDataProvider = PdfFileDataProvider;

  /**
   * Create a data provider and webview panel for a given pdf file and display it.
   * @param {PdfFileDataProvider} provider A holder for the file data.
   */
  static previewPdfFile(provider) {
    const panel = vscode.window.createWebviewPanel("pdfViewer.apiCreatedPreview", provider.name);
    PDFEdit.previewPdfFile(provider, panel);
  }
}
