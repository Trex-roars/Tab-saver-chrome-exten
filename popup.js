const saveTabsBtn = document.getElementById('saveTabs');
const savedTabsList = document.getElementById('savedTabsList');
const tabDetails = document.getElementById('tabDetails');
const savedAtElement = document.getElementById('savedAt');
const tabList = document.getElementById('tabList');
const restoreAllBtn = document.getElementById('restoreAll');
const TOAST_TIMEOUT = 2000;

// Initialize saved tabs from localStorage
document.addEventListener('DOMContentLoaded', initializeSavedTabs);

// Save current tabs when button is clicked
saveTabsBtn.addEventListener('click', debounce(saveCurrentTabs, 500));

// Initialize saved tabs from localStorage
function initializeSavedTabs() {
  try {
    const savedTabs = getSavedTabs();
    renderSavedTabsList(savedTabs);
  } catch (error) {
    showToast('Error loading saved tabs.', 'error');
    console.error('Error loading saved tabs:', error);
  }
}

// Save the current browser tabs
async function saveCurrentTabs() {
  try {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const savedTabs = getSavedTabs();
    const timestamp = new Date().toLocaleString();

    if (isDuplicateSession(savedTabs, tabs)) {
      showToast('These tabs are already saved.', 'warning');
      return;
    }

    const newEntry = { timestamp, tabs: tabs.map(tab => ({ title: tab.title, url: tab.url })) };
    savedTabs.push(newEntry);
    setSavedTabs(savedTabs);

    renderSavedTabsList(savedTabs);
    showToast('Tabs saved successfully!', 'success');
  } catch (error) {
    showToast('Failed to save tabs.', 'error');
    console.error('Error saving tabs:', error);
  }
}

// Check for duplicate sessions
function isDuplicateSession(savedTabs, tabs) {
  if (!savedTabs.length) return false;
  const lastSaved = savedTabs[savedTabs.length - 1];
  return JSON.stringify(lastSaved.tabs) === JSON.stringify(tabs.map(tab => ({ title: tab.title, url: tab.url })));
}

// Render the saved tabs list
function renderSavedTabsList(savedTabs) {
  savedTabsList.innerHTML = savedTabs.length
    ? ''
    : '<li class="empty-state">No saved tabs yet. Click "Save Tabs" to start.</li>';

  savedTabs.forEach((entry, index) => {
    const li = document.createElement('li');
    li.className = 'saved-session';
    li.innerHTML = `
      <span>${entry.timestamp}</span>
      <button class="btn-secondary delete-btn" data-index="${index}">Delete</button>
    `;
    li.addEventListener('click', () => showTabDetails(entry));
    savedTabsList.appendChild(li);
  });

  // Event delegation for delete buttons
  savedTabsList.addEventListener('click', event => {
    if (event.target.classList.contains('delete-btn')) {
      event.stopPropagation();
      deleteSavedTab(event.target.dataset.index);
    }
  });
}

// Show tab details for a saved session
function showTabDetails(entry) {
  tabDetails.style.display = 'block';
  savedAtElement.textContent = `Saved at: ${entry.timestamp}`;
  tabList.innerHTML = entry.tabs
    .map(tab => `<li class="tab-item" data-url="${tab.url}">${tab.title}</li>`)
    .join('');

  // Show the Restore All button when a session is selected
  restoreAllBtn.style.display = 'block';

  // Restore all tabs in this session
  restoreAllBtn.onclick = () => entry.tabs.forEach(tab => chrome.tabs.create({ url: tab.url }));

  // Open individual tab on click
  tabList.addEventListener('click', event => {
    if (event.target.classList.contains('tab-item')) {
      const url = event.target.dataset.url;
      chrome.tabs.create({ url });
    }
  });
}

// Delete a saved session
function deleteSavedTab(index) {
  try {
    const savedTabs = getSavedTabs();
    savedTabs.splice(index, 1);
    setSavedTabs(savedTabs);
    renderSavedTabsList(savedTabs);
    tabDetails.style.display = 'none';
    restoreAllBtn.style.display = 'none';  // Hide Restore All button when no session is selected
    showToast('Session deleted successfully!', 'success');
  } catch (error) {
    showToast('Error deleting session.', 'error');
    console.error('Error deleting session:', error);
  }
}

// Helper: Get saved tabs from localStorage
function getSavedTabs() {
  return JSON.parse(localStorage.getItem('savedTabs')) || [];
}

// Helper: Save tabs to localStorage
function setSavedTabs(savedTabs) {
  localStorage.setItem('savedTabs', JSON.stringify(savedTabs));
}

// Helper: Debounce function
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Helper: Show toast notifications
function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
      toast.addEventListener('transitionend', () => toast.remove());
    }, TOAST_TIMEOUT);
  }, 10);
}

// Reset Restore All button when clicking outside the list
document.addEventListener('click', (event) => {
  if (!savedTabsList.contains(event.target)) {
    tabDetails.style.display = 'none';
    restoreAllBtn.style.display = 'none';  // Hide Restore All button
  }
});
