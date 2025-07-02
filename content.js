console.log("Text Expander content script loaded.");

let currentInput = null;

document.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    currentInput = e.target;
    const text = currentInput.value;
    const lastWord = text.split(/\s+/).pop();

    if (lastWord.startsWith('/')) {
      chrome.storage.sync.get(lastWord, (data) => {
        if (data[lastWord]) {
          const expansion = data[lastWord];
          const newText = text.replace(lastWord, expansion);
          currentInput.value = newText;
        }
      });
    }
  }
});
