# Tab Saver Chrome Extension

## Overview
**Tab Saver** is a simple and efficient Chrome extension designed to save your current browser tabs for future use. Whether you're researching, multitasking, or just need to save your browsing session, Tab Saver makes it easy to manage and restore tabs with a single click.

---

## Features
- **Save Current Tabs**: Save all open tabs in your current window.
- **Restore Tabs**: Restore all tabs from a saved session or open specific ones.
- **Session Details**: View a detailed list of tabs from saved sessions.
- **Delete Sessions**: Easily remove sessions no longer needed.
- **User-Friendly Interface**: Clean and interactive UI for easy navigation.
- **Local Storage**: Your saved tabs are stored locally on your device, ensuring privacy.

---

## Installation
1. Clone or download the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle in the top-right corner).
4. Click **Load Unpacked**.
5. Select the directory containing the extension files.
6. The Tab Saver extension should now appear in your browser toolbar.

---

## Usage
### Saving Tabs
1. Click the **Tab Saver** extension icon.
2. Press the **Save Tabs** button.
3. Your current browser tabs will be saved with a timestamp.

### Viewing Saved Sessions
- The saved sessions are listed under the "Saved Sessions" section.
- Each session displays its timestamp and options for further actions.

### Restoring Tabs
1. Select a session from the saved sessions list.
2. Click on the **Restore All Tabs** button to reopen all tabs in that session.
3. Alternatively, click on individual tabs from the session list to open them.

### Deleting Sessions
- Use the **Delete** button next to a session to remove it permanently.

### Resetting
- Clicking outside the session list will reset the detailed view, hiding the session details and the "Restore All" button.

---

## Development
### Technologies Used
- **HTML5**: For structuring the user interface.
- **CSS3**: For styling and responsive design.
- **JavaScript**: For logic, data handling, and interactions.
- **LocalStorage**: To store saved tabs on the user's device.

### Code Highlights
1. **Debounce for Save Tabs Button**: Ensures efficient tab saving by limiting the function execution frequency.
   ```javascript
   saveTabsBtn.addEventListener('click', debounce(saveCurrentTabs, 500));
   ```

2. **Session Duplication Check**: Avoids saving duplicate tab sessions.
   ```javascript
   function isDuplicateSession(savedTabs, tabs) {
     if (!savedTabs.length) return false;
     const lastSaved = savedTabs[savedTabs.length - 1];
     return JSON.stringify(lastSaved.tabs) === JSON.stringify(tabs.map(tab => ({ title: tab.title, url: tab.url })));
   }
   ```

3. **Toast Notifications**: Displays feedback messages for user actions.
   ```javascript
   function showToast(message, type) {
     const toast = document.createElement('div');
     toast.className = `toast toast-${type}`;
     toast.textContent = message;
     document.body.appendChild(toast);
     setTimeout(() => toast.remove(), 2000);
   }
   ```

---

## Customization
You can easily modify the extension:
1. **Styling**: Update `styles.css` to match your preferred theme.
2. **Storage**: Integrate with a cloud-based storage solution if needed.

---

## Known Issues
- **Cross-Window Sessions**: Only saves tabs from the current window. Multi-window support is not implemented yet.
- **Session Overlap**: Avoids duplication but doesn't compare across saved sessions.

---

## Contributing
1. Fork the repository. `git clone https://github.com/Adityaadpandey/tab-saver-chrome-extension` .
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact
For questions or support, contact [Aditya] at [adityapandeyadp@gmail.com].

---
