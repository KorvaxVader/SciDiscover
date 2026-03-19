// SciDiscover Utility JavaScript
// Helper functions used across the application

// -------- STRING FORMATTING --------

// Truncate text to specified length
function truncateText(text, maxLength = 150) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Format number with K/M suffixes
function formatNumber(num) {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Format date to readable string
function formatDate(dateInput) {
    if (!dateInput) return 'Unknown';
    
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Format time ago (e.g., "2 hours ago")
function timeAgo(dateInput) {
    if (!dateInput) return '';
    
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return interval + ' ' + unit + (interval === 1 ? '' : 's') + ' ago';
        }
    }
    
    return 'just now';
}

// -------- DOM HELPERS --------

// Show loading spinner in container
function showLoading(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

// Show error message in container
function showError(containerId, message = 'An error occurred') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

// Show empty state in container
function showEmpty(containerId, message = 'No data found') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <p>${message}</p>
        </div>
    `;
}

// Clear container
function clearContainer(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

// -------- STORAGE HELPERS --------

// Save data to localStorage
function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

// Get data from localStorage
function getStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Failed to get from localStorage:', error);
        return defaultValue;
    }
}

// Remove data from localStorage
function removeStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Failed to remove from localStorage:', error);
    }
}

// -------- VALIDATION HELPERS --------

// Validate email format
function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password) {
    if (!password) return false;
    return password.length >= 6;
}

// Validate URL
function isValidUrl(url) {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// -------- ARRAY HELPERS --------

// Group array by key
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}

// Sort array by date
function sortByDate(array, dateKey = 'date', ascending = false) {
    return [...array].sort((a, b) => {
        const dateA = new Date(a[dateKey]);
        const dateB = new Date(b[dateKey]);
        return ascending ? dateA - dateB : dateB - dateA;
    });
}

// -------- DEBOUNCE / THROTTLE --------

// Debounce function
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// -------- COLOR HELPERS --------

// Get confidence color class
function getConfidenceClass(confidence) {
    if (confidence >= 80) return 'confidence-high';
    if (confidence >= 60) return 'confidence-medium';
    return 'confidence-low';
}

// Get field color class
function getFieldClass(field) {
    if (!field) return 'general';
    
    const fieldLower = field.toLowerCase();
    if (fieldLower.includes('neuro')) return 'neuroscience';
    if (fieldLower.includes('ai') || fieldLower.includes('machine')) return 'ai';
    if (fieldLower.includes('med') || fieldLower.includes('drug')) return 'medicine';
    if (fieldLower.includes('phys') || fieldLower.includes('quantum')) return 'physics';
    if (fieldLower.includes('bio') || fieldLower.includes('protein')) return 'biology';
    return 'general';
}

// -------- EXPORTS --------

// Make functions available globally
window.utils = {
    truncateText,
    formatNumber,
    formatDate,
    timeAgo,
    showLoading,
    showError,
    showEmpty,
    clearContainer,
    setStorage,
    getStorage,
    removeStorage,
    isValidEmail,
    isValidPassword,
    isValidUrl,
    groupBy,
    sortByDate,
    debounce,
    throttle,
    getConfidenceClass,
    getFieldClass
};