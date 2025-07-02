const SHEET_NAME = 'Raccourci';

function fetchAndStoreShortcuts() {
  chrome.storage.sync.get('sheetId', (data) => {
    const sheetId = data.sheetId;
    if (!sheetId) {
      console.log('No Google Sheet ID configured.');
      return; // Exit if no ID is set
    }

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
    console.log(`Fetching from URL: ${sheetUrl}`);

    fetch(sheetUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.text();
      })
      .then(text => {
        console.log("Received response text from Google Sheet.");
        const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\)/s);
        if (!match || !match[1]) {
          console.error("Failed to extract JSON from Google Sheet response.", text);
          throw new Error("Invalid JSONP response format.");
        }
        
        const jsonString = match[1];
        const jsonData = JSON.parse(jsonString);
        
        const shortcuts = parseJsonData(jsonData);
        
        // Clear old shortcuts object and save new shortcuts individually
        chrome.storage.sync.clear(() => {
            chrome.storage.sync.set({sheetId: data.sheetId}, () => {
                chrome.storage.sync.set(shortcuts, () => {
                    console.log(`Successfully updated ${Object.keys(shortcuts).length} shortcuts.`);
                });
            });
        });
      })
      .catch(error => {
        console.error('Error fetching or parsing Google Sheet data:', error);
        chrome.storage.sync.clear(); // Clear all shortcuts on error
      });
  });
}

function parseJsonData(data) {
  const shortcuts = {};
  // Defensive checks for the data structure
  if (data && data.table && data.table.rows) {
    console.log(`Parsing ${data.table.rows.length} rows.`);
    data.table.rows.forEach((row, index) => {
      if (row && row.c && row.c.length >= 2 && row.c[0] && row.c[1]) {
        // v = value, f = formatted value. 'v' is usually what we want.
        const shortcut = row.c[0].v; 
        const extract = row.c[1].v;

        if (shortcut && typeof shortcut === 'string' && extract && typeof extract === 'string') {
          const key = shortcut.trim();
          if (key !== 'sheetId') { // Ensure sheetId is not treated as a shortcut
            shortcuts[key.startsWith('/') ? key : `/${key}`] = extract;
          }
        } else {
            console.warn(`Skipping row ${index + 1}: Invalid data format.`, row);
        }
      } else {
        console.warn(`Skipping row ${index + 1}: Malformed row structure.`, row);
      }
    });
  } else {
    console.warn("No valid rows found in JSON data.", data);
  }
  return shortcuts;
}

// Listen for a message from the popup to fetch shortcuts immediately
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchShortcuts') {
    console.log('Fetch message received from popup.');
    fetchAndStoreShortcuts();
    sendResponse({status: 'completed'});
  }
  return true; // Keep the message channel open for async response
});

// Fetch on install/update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    fetchAndStoreShortcuts();
  }
  console.log('Extension installed/updated. Fetching shortcuts.');
  fetchAndStoreShortcuts();
  chrome.alarms.create('fetch-shortcuts-alarm', {
    periodInMinutes: 60
  });
});

// Fetch when the alarm fires
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'fetch-shortcuts-alarm') {
    console.log('Alarm triggered. Fetching shortcuts.');
    fetchAndStoreShortcuts();
  }
});

// Fetch when the browser starts
chrome.runtime.onStartup.addListener(() => {
    console.log('Browser startup. Fetching shortcuts.');
    fetchAndStoreShortcuts();
});