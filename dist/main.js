(()=>{"use strict";var n={496:n=>{n.exports=require("vscode")}},e={};function r(t){var o=e[t];if(void 0!==o)return o.exports;var i=e[t]={exports:{}};return n[t](i,i.exports,r),i.exports}(()=>{var n=r(496);class e{static register(){const r=new e;return n.window.registerCustomEditorProvider(e.viewType,r)}static viewType="pdfViewer.PDFEdit";constructor(){}async resolveCustomEditor(n,e,r){e.webview.html='<!DOCTYPE html>\n<html>\n\n<head>\n  <style type="text/css">\n    html {\n      overflow: auto;\n    }\n\n    html,\n    body,\n    div,\n    iframe {\n      margin: 0px;\n      padding: 0px;\n      height: 100%;\n      border: none;\n    }\n\n    iframe {\n      display: block;\n      width: 100%;\n      border: none;\n      overflow-y: auto;\n      overflow-x: hidden;\n    }\n  </style>\n</head>\n\n<body>\n\n  <iframe src="https://adamraichu.github.io/"\n    frameborder="0"\n    marginheight="0"\n    marginwidth="0"\n    width="100%"\n    height="100%"\n    scrolling="auto">\n  </iframe>\n\n</body>\n\n</html>'}async openCustomDocument(n,e,r){}}e.register()})()})();