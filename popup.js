document.addEventListener('DOMContentLoaded', () => {
  const shortcutsList = document.getElementById('shortcuts');
  const sheetIdInput = document.getElementById('sheetId');
  const saveButton = document.getElementById('save');

  // Load saved sheet ID and all shortcuts
  chrome.storage.sync.get(null, (data) => {
    if (data.sheetId) {
      sheetIdInput.value = data.sheetId;
    }
    const shortcuts = {};
    for (const [key, value] of Object.entries(data)) {
        if (key !== 'sheetId') {
            shortcuts[key] = value;
        }
    }
    updateShortcutsList(shortcuts);
  });

  // Save button listener
  saveButton.addEventListener('click', () => {
    const sheetId = sheetIdInput.value.trim();
    if (sheetId) {
      chrome.storage.sync.set({ sheetId }, () => {
        console.log('Sheet ID saved.');
        // Trigger an immediate fetch of new shortcuts
        chrome.runtime.sendMessage({ action: 'fetchShortcuts' }, () => {
            // After fetch, reload the popup to show new shortcuts
            window.location.reload();
        });
      });
    }
  });

  function updateShortcutsList(shortcuts) {
    shortcutsList.innerHTML = ''; // Clear current list
    for (const [shortcut, expansion] of Object.entries(shortcuts)) {
      const li = document.createElement('li');
      li.innerHTML = `<span>${shortcut}</span><span>${expansion.replace(/\n/g, '<br>')}</span>`;
      shortcutsList.appendChild(li);
    }
  }
});

