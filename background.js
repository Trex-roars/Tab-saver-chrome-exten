chrome.runtime.onInstalled.addListener(() => {
    console.log('Tab Saver Extension Installed!');
  });

  // Save tabs function
  function saveTabs() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const savedTabs = tabs.map(tab => ({ url: tab.url, title: tab.title }));
      const timestamp = new Date().toISOString();
      chrome.storage.local.set({ [timestamp]: savedTabs }, () => {
        chrome.tabs.remove(tabs.map(tab => tab.id));
        console.log(`Saved ${tabs.length} tabs at ${timestamp}`);
      });
    });
  }

  // Restore tabs function
  function restoreTabs(timestamp) {
    chrome.storage.local.get(timestamp, (data) => {
      const savedTabs = data[timestamp] || [];
      savedTabs.forEach(tab => chrome.tabs.create({ url: tab.url }));
    });
  }

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'saveTabs') {
      saveTabs();
      sendResponse({ status: 'Tabs saved' });
    } else if (message.action === 'restoreTabs') {
      restoreTabs(message.timestamp);
      sendResponse({ status: 'Tabs restored' });
    }
  });
