// SciDiscover API JavaScript
// Handles all backend communication

const API = {
    // Base URL - update this once when backend is ready
    baseURL: 'http://127.0.0.1:5000/api', // Change this to your backend URL
    
    // Default headers
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },

    // Helper method to handle responses
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    // Helper method to get auth token (if needed later)
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return token ? { ...this.headers, 'Authorization': `Bearer ${token}` } : this.headers;
    },

    // -------- STATS --------
    
    async getStats() {
        try {
            const response = await fetch(`${this.baseURL}/stats`, {
                method: 'GET',
                headers: this.headers
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API getStats error:', error);
            throw error;
        }
    },

    // -------- PAPERS --------
    
    async searchPapers(query, source = 'all', limit = 10) {
        try {
            const params = new URLSearchParams({
                q: query,
                source: source,
                limit: limit
            });
            
            const response = await fetch(`${this.baseURL}/search?${params}`, {
                method: 'GET',
                headers: this.headers
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API searchPapers error:', error);
            throw error;
        }
    },

    async getRecentPapers(count = 4) {
        try {
            const response = await fetch(`${this.baseURL}/papers/recent?count=${count}`, {
                method: 'GET',
                headers: this.headers
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API getRecentPapers error:', error);
            throw error;
        }
    },

    // -------- HYPOTHESES --------
    
    async getHypothesis(id) {
        try {
            const response = await fetch(`${this.baseURL}/hypothesis/${id}`, {
                method: 'GET',
                headers: this.headers
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API getHypothesis error:', error);
            throw error;
        }
    },

    async saveHypothesis(id) {
        try {
            const response = await fetch(`${this.baseURL}/hypothesis/${id}/save`, {
                method: 'POST',
                headers: this.headers
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API saveHypothesis error:', error);
            throw error;
        }
    },

    async generateExperiment(id) {
        try {
            const response = await fetch(`${this.baseURL}/hypothesis/${id}/experiment`, {
                method: 'POST',
                headers: this.headers
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API generateExperiment error:', error);
            throw error;
        }
    },

    // -------- CONNECTIONS --------
    
    async getRecentConnections(count = 3) {
        try {
            const response = await fetch(`${this.baseURL}/connections/recent?count=${count}`, {
                method: 'GET',
                headers: this.headers
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API getRecentConnections error:', error);
            throw error;
        }
    },

    // -------- CONTACT --------
    
    async sendContact(formData) {
        try {
            const response = await fetch(`${this.baseURL}/contact`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(formData)
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API sendContact error:', error);
            throw error;
        }
    },

    // -------- UTILITY --------
    
    // Test connection to backend
    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                headers: this.headers
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('API testConnection error:', error);
            return { status: 'error', message: 'Backend not reachable' };
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}