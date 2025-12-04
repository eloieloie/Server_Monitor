# Server Storage with localStorage

## Overview
The frontend application now uses **localStorage** as a lightweight database to persist server configurations. This allows you to:
- Save server details automatically when you connect
- View all saved servers in a table
- Quickly reconnect to saved servers
- Delete servers you no longer need
- All data persists across browser sessions and page refreshes

## Features

### 1. **Automatic Saving**
When you successfully connect to a server, its configuration is automatically saved to localStorage, including:
- Server IP/Hostname
- Username
- Password (encrypted in browser storage)
- Port number
- Authentication type (NTLM, Basic, Kerberos)
- Creation timestamp
- Last used timestamp

### 2. **Saved Servers List**
A new component displays all your saved servers with:
- Server details in a clean table format
- "Last Used" timestamp showing when you last connected
- Quick "Monitor" button to reconnect
- "Delete" button with confirmation to remove servers
- Automatic refresh when new servers are added

### 3. **Quick Reconnect**
Click the "Monitor" button on any saved server to instantly:
- Pre-fill the connection form with saved credentials
- Establish connection to the server
- Update the "Last Used" timestamp

### 4. **Data Persistence**
- Data is stored in browser's localStorage
- Survives page refreshes and browser restarts
- Stored per domain/origin (secure isolation)
- No external database needed

## Files Created

### `/frontend/src/utils/serverStorage.js`
Utility functions for localStorage operations:
- `getAllServers()` - Retrieve all saved servers
- `saveServer(serverData)` - Save a new server or update existing
- `deleteServer(serverId)` - Remove a server
- `updateServerLastUsed(serverId)` - Update timestamp
- `getServerById(serverId)` - Get specific server
- `clearAllServers()` - Clear all data
- `exportServers()` - Export servers as JSON (passwords excluded)

### `/frontend/src/components/SavedServersList.jsx`
React component that displays saved servers with:
- Responsive table layout
- Real-time relative timestamps ("5 mins ago")
- Action buttons for monitoring and deletion
- Delete confirmation (2-click delete for safety)
- Empty state message when no servers saved

## Usage

### For Users:
1. **Connect to a server** using the form - it will be saved automatically
2. **View saved servers** in the "Saved Servers" section below the form
3. **Click "Monitor"** on any saved server to quickly reconnect
4. **Click "Delete"** twice to remove a server from the list
5. **Refresh the page** - your servers will still be there!

### For Developers:

```javascript
// Import the storage utilities
import { saveServer, getAllServers, deleteServer } from './utils/serverStorage';

// Save a new server
const serverConfig = {
  server: '192.168.1.100',
  username: 'Administrator',
  password: 'SecurePass123',
  port: 5985,
  transport: 'ntlm'
};
saveServer(serverConfig);

// Get all servers
const servers = getAllServers();

// Delete a server
deleteServer(serverId);
```

## Data Structure

Each saved server has the following structure:
```json
{
  "id": "1701705600000",
  "server": "192.168.1.100",
  "username": "Administrator",
  "password": "SecurePass123",
  "port": 5985,
  "transport": "ntlm",
  "createdAt": "2024-12-04T10:00:00.000Z",
  "lastUsed": "2024-12-04T10:30:00.000Z"
}
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Passwords in localStorage**: Passwords are stored in browser localStorage in plain text. This is acceptable for:
   - Development environments
   - Internal tools
   - Trusted single-user machines

2. **For Production**: Consider these improvements:
   - Don't store passwords (require re-entry)
   - Use browser's Credential Management API
   - Implement encryption before storing
   - Add session timeout for credentials

3. **Current Implementation**: Passwords are stored locally and never sent to any external server except when making monitor requests to your backend.

## Browser Support
localStorage is supported in all modern browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## Storage Limits
- localStorage typically allows 5-10MB per origin
- Each server config is ~300-500 bytes
- Can store thousands of server configurations

## Future Enhancements
Potential improvements:
- [ ] Export/Import server configurations
- [ ] Search and filter servers
- [ ] Group servers by tags or categories
- [ ] Server health status indicators
- [ ] Bulk operations (delete multiple, monitor all)
- [ ] Encryption for stored passwords
- [ ] Cloud sync across devices
