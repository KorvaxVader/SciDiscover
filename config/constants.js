// config/constants.js - Backend API Configuration

const CONFIG = {
    // Backend API URL - Update this when backend is deployed
    // Local development (VS Code Live Server on port 5500, backend on port 5000)
    API_BASE: 'http://127.0.0.1:5000/api',
    
    // Alternative local URLs (use whichever matches your backend)
    // API_BASE: 'http://localhost:5000/api',
    // API_BASE: 'http://127.0.0.1:8000/api',
    // API_BASE: 'http://localhost:8000/api',
    
    // Production - Uncomment and update when deployed
    // API_BASE: 'https://api.scidiscover.com/api',
    
    // API Endpoints
    ENDPOINTS: {
        // Stats
        STATS: '/stats',
        
        // Papers
        SEARCH: '/search',
        RECENT_PAPERS: '/papers/recent',
        
        // Hypotheses
        HYPOTHESIS: '/hypothesis',
        SAVE_HYPOTHESIS: '/hypothesis/save',
        GENERATE_EXPERIMENT: '/hypothesis/experiment',
        
        // Connections
        RECENT_CONNECTIONS: '/connections/recent',
        
        // Contact
        CONTACT: '/contact',
        
        // Auth (if needed later)
        LOGIN: '/auth/login',
        SIGNUP: '/auth/signup',
        LOGOUT: '/auth/logout',
        
        // Health check
        HEALTH: '/health'
    },
    
    // Request timeout in milliseconds
    TIMEOUT: 30000, // 30 seconds
    
    // Default values
    DEFAULTS: {
        SOURCE: 'all',
        LIMIT: 10,
        RECENT_PAPERS_COUNT: 4,
        RECENT_CONNECTIONS_COUNT: 3
    },
    
    // Feature flags
    FEATURES: {
        USE_REAL_AUTH: false,  // Set to true when backend auth is ready
        USE_MOCK_DATA: true     // Set to false when backend is ready
    }
};

// For use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}