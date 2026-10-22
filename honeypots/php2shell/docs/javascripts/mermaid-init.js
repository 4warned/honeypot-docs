document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("pre code.language-mermaid, code.mermaid").forEach(function (el) {
    var pre = el.parentElement;
    var div = document.createElement("div");
    div.className = "mermaid";
    div.textContent = el.textContent;
    if (pre && pre.parentElement) {
      pre.parentElement.replaceChild(div, pre);
    }
  });
  if (window.mermaid) {
    window.mermaid.initialize({ startOnLoad: true, theme: "default" });
    window.mermaid.run();
  }
});
