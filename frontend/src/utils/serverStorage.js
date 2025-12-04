// Local Storage utility for managing server configurations

const STORAGE_KEY = 'server_monitor_servers';

/**
 * Get all saved servers from localStorage
 */
export const getAllServers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Save a new server configuration
 */
export const saveServer = (serverData) => {
  try {
    const servers = getAllServers();
    const newServer = {
      id: Date.now().toString(),
      ...serverData,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };
    
    // Check if server already exists (by IP/hostname)
    const existingIndex = servers.findIndex(s => s.server === serverData.server);
    
    if (existingIndex >= 0) {
      // Update existing server
      servers[existingIndex] = { ...servers[existingIndex], ...newServer, id: servers[existingIndex].id };
    } else {
      // Add new server
      servers.push(newServer);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
    return newServer;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw error;
  }
};

/**
 * Update server's last used timestamp
 */
export const updateServerLastUsed = (serverId) => {
  try {
    const servers = getAllServers();
    const serverIndex = servers.findIndex(s => s.id === serverId);
    
    if (serverIndex >= 0) {
      servers[serverIndex].lastUsed = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
    }
  } catch (error) {
    console.error('Error updating server:', error);
  }
};

/**
 * Delete a server configuration
 */
export const deleteServer = (serverId) => {
  try {
    const servers = getAllServers();
    const filteredServers = servers.filter(s => s.id !== serverId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredServers));
    return true;
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    return false;
  }
};

/**
 * Get a specific server by ID
 */
export const getServerById = (serverId) => {
  const servers = getAllServers();
  return servers.find(s => s.id === serverId);
};

/**
 * Clear all saved servers
 */
export const clearAllServers = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Export servers as JSON file
 */
export const exportServers = () => {
  const servers = getAllServers();
  // Remove passwords before export for security
  const exportData = servers.map(({ password, ...rest }) => rest);
  return JSON.stringify(exportData, null, 2);
};
