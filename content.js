document.addEventListener("mouseup", () => {
  const selected = window.getSelection().toString().trim();

  if (selected && selected.split(" ").length === 1) {
    chrome.storage.local.set({ selectedWord: selected });
  }
});
