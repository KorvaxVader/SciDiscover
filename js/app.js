// SciDiscover Main Application JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check current page and initialize accordingly
    const path = window.location.pathname;
    
    if (path.includes('dashboard.html')) {
        initDashboard();
    } else if (path.includes('hypothesis.html')) {
        initHypothesisPage();
    }
});

// -------- DASHBOARD --------
function initDashboard() {
    console.log('Initializing dashboard...');
    
    // Load user name
    loadUserName();
    
    // Load dashboard data
    loadDashboardData();
    
    // Setup search
    setupDashboardSearch();
}

function loadUserName() {
    const user = getCurrentUser();
    const userNameElement = document.getElementById('userName');
    
    if (user && userNameElement) {
        userNameElement.textContent = user.name;
    }
}

function loadDashboardData() {
    // Load stats
    API.getStats()
        .then(stats => {
            displayStats(stats);
        })
        .catch(error => {
            console.error('Failed to load stats:', error);
            showError('statsContainer', 'Failed to load statistics');
        });
    
    // Load recent papers
    API.getRecentPapers(4)
        .then(papers => {
            displayPapers(papers);
        })
        .catch(error => {
            console.error('Failed to load recent papers:', error);
            showError('papersContainer', 'Failed to load papers');
        });
    
    // Load recent connections
    API.getRecentConnections(3)
        .then(connections => {
            displayConnections(connections);
        })
        .catch(error => {
            console.error('Failed to load connections:', error);
            showError('connectionsContainer', 'Failed to load connections');
        });
}

function displayStats(stats) {
    const container = document.getElementById('statsContainer');
    if (!container) return;
    
    if (!stats) {
        container.innerHTML = '<div class="error">No stats available</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-file-alt"></i></div>
            <div class="stat-content">
                <span class="stat-value">${formatNumber(stats.papers)}</span>
                <span class="stat-label">Papers Indexed</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-project-diagram"></i></div>
            <div class="stat-content">
                <span class="stat-value">${formatNumber(stats.connections)}</span>
                <span class="stat-label">Connections</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-lightbulb"></i></div>
            <div class="stat-content">
                <span class="stat-value">${formatNumber(stats.hypotheses)}</span>
                <span class="stat-label">Hypotheses</span>
            </div>
        </div>
    `;
}

function displayPapers(papers) {
    const container = document.getElementById('papersContainer');
    if (!container) return;
    
    if (!papers || papers.length === 0) {
        container.innerHTML = '<p class="no-results">No papers found</p>';
        return;
    }
    
    let html = '';
    papers.forEach(paper => {
        const fieldClass = paper.field ? paper.field.toLowerCase() : 'general';
        const abstract = paper.abstract ? truncateText(paper.abstract, 150) : 'No abstract available';
        
        html += `
            <div class="paper-card">
                <div class="paper-badge ${fieldClass}">${paper.field || 'Research'}</div>
                <h3 class="paper-title">${paper.title}</h3>
                <p class="paper-authors">${paper.authors || 'Unknown'} · ${paper.journal || 'Preprint'} · ${paper.year || 'N/A'}</p>
                <p class="paper-abstract">${abstract}</p>
                <div class="paper-footer">
                    <div class="paper-meta">
                        <span class="relevance"><i class="fas fa-chart-line"></i> ${paper.relevance || '0'}% match</span>
                        <span class="citations"><i class="fas fa-quote-right"></i> ${formatNumber(paper.citations)} citations</span>
                    </div>
                    <a href="${paper.url || '#'}" class="paper-link" target="_blank">
                        Read Paper <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function displayConnections(connections) {
    const container = document.getElementById('connectionsContainer');
    if (!container) return;
    
    if (!connections || connections.length === 0) {
        container.innerHTML = '<p class="no-results">No connections found</p>';
        return;
    }
    
    let html = '';
    connections.forEach(conn => {
        html += `
            <div class="connection-card">
                <div class="connection-fields">
                    <span class="field-tag ${conn.field1.toLowerCase()}">${conn.field1}</span>
                    <i class="fas fa-arrow-right connection-arrow"></i>
                    <span class="field-tag ${conn.field2.toLowerCase()}">${conn.field2}</span>
                </div>
                <h4>${conn.title}</h4>
                <p class="connection-desc">${conn.description}</p>
                <div class="connection-strength">
                    <span class="strength-label">Strength:</span>
                    <div class="strength-bar">
                        <div class="strength-fill" style="width: ${conn.strength}%"></div>
                    </div>
                    <span class="strength-value">${conn.strength}%</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function setupDashboardSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const sourceSelect = document.getElementById('sourceSelect');
    const limitSelect = document.getElementById('limitSelect');
    
    if (!searchBtn || !searchInput) return;
    
    searchBtn.addEventListener('click', function() {
        performSearch();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        const source = sourceSelect ? sourceSelect.value : 'all';
        const limit = limitSelect ? limitSelect.value : '10';
        
        if (!query) {
            alert('Please enter a search query');
            return;
        }
        
        // Show loading
        const container = document.getElementById('papersContainer');
        if (container) {
            container.innerHTML = '<div class="loading-papers">Searching papers...</div>';
        }
        
        API.searchPapers(query, source, limit)
            .then(results => {
                displayPapers(results);
            })
            .catch(error => {
                console.error('Search failed:', error);
                if (container) {
                    container.innerHTML = '<div class="error">Search failed. Please try again.</div>';
                }
            });
    }
}

// -------- HYPOTHESIS PAGE --------
function initHypothesisPage() {
    console.log('Initializing hypothesis page...');
    
    // Get hypothesis ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const hypothesisId = urlParams.get('id');
    
    if (!hypothesisId) {
        showHypothesisError('No hypothesis selected');
        return;
    }
    
    loadHypothesis(hypothesisId);
}

function loadHypothesis(id) {
    const container = document.getElementById('hypothesisContainer');
    if (!container) return;
    
    API.getHypothesis(id)
        .then(hypothesis => {
            displayHypothesis(hypothesis);
        })
        .catch(error => {
            console.error('Failed to load hypothesis:', error);
            showHypothesisError('Failed to load hypothesis');
        });
}

function displayHypothesis(h) {
    const container = document.getElementById('hypothesisContainer');
    if (!container) return;
    
    // Format supporting papers
    const papersHtml = h.supporting_papers?.map((paper, index) => `
        <div class="paper-item">
            <div class="paper-rank">#${index + 1}</div>
            <div class="paper-content">
                <h4>${paper.title}</h4>
                <p class="paper-authors">${paper.authors} · ${paper.journal} · ${paper.year}</p>
                <p class="paper-abstract">${truncateText(paper.abstract, 120)}</p>
                <div class="paper-meta">
                    <span class="match-score">
                        <i class="fas fa-chart-line"></i> ${paper.relevance}% match
                    </span>
                    <a href="${paper.url}" class="paper-link" target="_blank">
                        Read Paper <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('') || '<p class="no-results">No supporting papers</p>';
    
    // Format related connections
    const connectionsHtml = h.related_connections?.map(conn => `
        <div class="connection-item">
            <div class="connection-fields">
                <span class="field-tag ${conn.field1.toLowerCase()}">${conn.field1}</span>
                <i class="fas fa-arrow-right connection-arrow"></i>
                <span class="field-tag ${conn.field2.toLowerCase()}">${conn.field2}</span>
            </div>
            <p class="connection-description">${conn.description}</p>
            <div class="connection-strength">
                <span class="strength-label">Strength:</span>
                <div class="strength-bar">
                    <div class="strength-fill" style="width: ${conn.strength}%"></div>
                </div>
                <span class="strength-value">${conn.strength}%</span>
            </div>
        </div>
    `).join('') || '<p class="no-results">No related connections</p>';
    
    // Format similar hypotheses
    const similarHtml = h.similar_hypotheses?.map(similar => `
        <a href="hypothesis.html?id=${similar.id}" class="similar-item">
            <p>${similar.title}</p>
            <span class="similar-confidence">${similar.confidence}%</span>
        </a>
    `).join('') || '<p class="no-results">No similar hypotheses</p>';
    
    // Load saved notes
    const savedNotes = localStorage.getItem(`notes_${h.id}`) || '';
    
    const html = `
        <!-- Hypothesis Header -->
        <div class="hypothesis-header">
            <div class="hypothesis-title-section">
                <span class="hypothesis-badge">
                    <i class="fas fa-robot"></i> AI Generated · ${formatDate(h.generated_date)}
                </span>
                <h1 class="hypothesis-title">${h.title}</h1>
                
                <div class="hypothesis-quick-stats">
                    <div class="stat-item">
                        <span class="stat-label">Confidence</span>
                        <span class="stat-value confidence-${getConfidenceClass(h.confidence)}">${h.confidence}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Supporting Papers</span>
                        <span class="stat-value">${h.supporting_papers?.length || 0}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Fields</span>
                        <div class="field-tags">
                            ${h.fields?.map(field => 
                                `<span class="field-tag ${field.toLowerCase()}">${field}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="hypothesis-actions">
                <button class="btn btn-secondary" onclick="shareHypothesis('${h.id}')">
                    <i class="fas fa-share-alt"></i> Share
                </button>
                <button class="btn btn-primary" onclick="saveHypothesis('${h.id}')">
                    <i class="fas fa-bookmark"></i> Save
                </button>
            </div>
        </div>

        <!-- Two Column Layout -->
        <div class="hypothesis-grid">
            <!-- Left Column -->
            <div class="hypothesis-left">
                <div class="detail-card">
                    <h2><i class="fas fa-lightbulb card-icon"></i> Hypothesis</h2>
                    <p class="hypothesis-full-text">${h.statement}</p>
                    
                    ${h.key_points ? `
                    <div class="key-points">
                        <h3>Key Points:</h3>
                        <ul>
                            ${h.key_points.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>

                <div class="detail-card experiment-card">
                    <h2><i class="fas fa-flask card-icon"></i> Suggested Experiment</h2>
                    
                    ${h.experiment ? `
                        <div class="experiment-content">
                            <p class="experiment-description">${h.experiment.description}</p>
                            
                            <div class="experiment-details">
                                <div class="detail-group">
                                    <h3><i class="fas fa-bullseye"></i> Objective</h3>
                                    <p>${h.experiment.objective}</p>
                                </div>
                                
                                <div class="detail-group">
                                    <h3><i class="fas fa-list-ol"></i> Methodology</h3>
                                    <ol class="methodology-list">
                                        ${h.experiment.methodology?.map(step => 
                                            `<li>${step}</li>`
                                        ).join('')}
                                    </ol>
                                </div>
                                
                                <div class="detail-group">
                                    <h3><i class="fas fa-chart-line"></i> Expected Outcome</h3>
                                    <p>${h.experiment.expected_outcome}</p>
                                </div>
                            </div>
                        </div>
                    ` : '<p class="no-experiment">No experiment suggested yet.</p>'}
                    
                    <button class="btn btn-secondary btn-block" onclick="generateExperiment('${h.id}')">
                        <i class="fas fa-sync-alt"></i> Regenerate Experiment
                    </button>
                </div>
                
                <div class="detail-card notes-card">
                    <h2><i class="fas fa-pen card-icon"></i> Your Notes</h2>
                    <textarea id="hypothesisNotes" class="notes-textarea" 
                        placeholder="Add your notes about this hypothesis...">${savedNotes}</textarea>
                    <button class="btn btn-text" onclick="saveNotes('${h.id}')">
                        <i class="fas fa-save"></i> Save Notes
                    </button>
                </div>
            </div>

            <!-- Right Column -->
            <div class="hypothesis-right">
                <div class="detail-card">
                    <h2><i class="fas fa-file-alt card-icon"></i> Supporting Papers (${h.supporting_papers?.length || 0})</h2>
                    <div class="papers-list">${papersHtml}</div>
                </div>

                <div class="detail-card">
                    <h2><i class="fas fa-project-diagram card-icon"></i> Related Connections</h2>
                    <div class="connections-list">${connectionsHtml}</div>
                </div>

                <div class="detail-card">
                    <h2><i class="fas fa-lightbulb card-icon"></i> Similar Hypotheses</h2>
                    <div class="similar-list">${similarHtml}</div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function showHypothesisError(message) {
    const container = document.getElementById('hypothesisContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-container">
            <i class="fas fa-exclamation-triangle error-icon"></i>
            <p class="error-message">${message}</p>
            <a href="dashboard.html" class="btn btn-primary">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </a>
        </div>
    `;
}

// -------- HELPER FUNCTIONS --------
function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function getConfidenceClass(confidence) {
    if (confidence >= 80) return 'high';
    if (confidence >= 60) return 'medium';
    return 'low';
}

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="error">${message}</div>`;
    }
}

// -------- GLOBAL FUNCTIONS (for onclick) --------
window.shareHypothesis = function(id) {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => {
            alert('Link copied to clipboard!');
        })
        .catch(() => {
            alert('Failed to copy link');
        });
};

window.saveHypothesis = function(id) {
    API.saveHypothesis(id)
        .then(() => {
            alert('Hypothesis saved to your library!');
        })
        .catch(error => {
            console.error('Failed to save:', error);
            alert('Failed to save hypothesis');
        });
};

window.generateExperiment = function(id) {
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    btn.disabled = true;
    
    API.generateExperiment(id)
        .then(() => {
            // Reload hypothesis to show new experiment
            loadHypothesis(id);
        })
        .catch(error => {
            console.error('Failed to generate experiment:', error);
            alert('Failed to generate experiment');
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
};

window.saveNotes = function(id) {
    const notes = document.getElementById('hypothesisNotes')?.value;
    if (notes !== undefined) {
        localStorage.setItem(`notes_${id}`, notes);
        alert('Notes saved!');
    }
};