document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("pre code.language-mermaid, code.mermaid").forEach(function (el) {
    var pre = el.closest("pre") || el.parentElement;
    var div = document.createElement("div");
    div.className = "mermaid";
    div.textContent = el.textContent;
    if (pre && pre.parentElement) {
      pre.parentElement.replaceChild(div, pre);
    }
  });
  if (window.mermaid) {
    // startOnLoad:false — we already converted fences; avoid a second pass.
    window.mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" });
    window.mermaid.run({ querySelector: ".mermaid" });
  }
});
