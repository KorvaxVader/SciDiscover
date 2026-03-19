// SciDiscover Auth JavaScript
// Mock authentication with form switching

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    
    // Current page path - more robust detection
    const path = window.location.pathname;
    const isLoginPage = path.includes('login.html') || path.endsWith('login/');
    const isDashboardPage = path.includes('dashboard.html') || path.includes('hypothesis.html');
    const isLandingPage = path === '/' || 
                         path.includes('index.html') || 
                         path.endsWith('/') ||
                         !path.includes('.'); // No extension = likely index
    
    // Redirect logic
    if (isDashboardPage && !user) {
        // If on protected page and no user, redirect to landing
        window.location.href = 'index.html';
        return;
    }
    
    if (isLoginPage && user) {
        // If on login page and already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Setup auth forms only on login page
    if (isLoginPage) {
        setupAuthToggle();
        setupLoginForm();
        setupSignupForm();
    }
});

// Toggle between login and signup forms
function setupAuthToggle() {
    const loginToggle = document.getElementById('loginToggle');
    const signupToggle = document.getElementById('signupToggle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginToggle && signupToggle && loginForm && signupForm) {
        loginToggle.addEventListener('click', function() {
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        });
        
        signupToggle.addEventListener('click', function() {
            signupToggle.classList.add('active');
            loginToggle.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
}

// Setup login form
function setupLoginForm() {
    const loginBtn = document.getElementById('loginBtn');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Disable button to prevent double clicks
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            
            const email = loginEmail.value.trim();
            const password = loginPassword.value.trim();
            
            // Demo credentials check
            if (email === 'user123@gmail.com' && password === 'user@123') {
                const user = {
                    email: email,
                    name: 'Demo User',
                    loginTime: new Date().toISOString()
                };
                
                try {
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = 'dashboard.html';
                } catch (error) {
                    console.error('Login failed:', error);
                    alert('Login failed. Please try again.');
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Log In';
                }
            } else {
                alert('Invalid credentials. Use demo: user123@gmail.com / user@123');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Log In';
            }
        });
    }
}

// Setup signup form
function setupSignupForm() {
    const signupBtn = document.getElementById('signupBtn');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirm = document.getElementById('signupConfirm');
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Disable button
            signupBtn.disabled = true;
            signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing up...';
            
            const email = signupEmail.value.trim();
            const password = signupPassword.value.trim();
            const confirm = signupConfirm.value.trim();
            
            // Basic validation
            if (!email || !password || !confirm) {
                alert('Please fill in all fields');
                signupBtn.disabled = false;
                signupBtn.textContent = 'Sign Up';
                return;
            }
            
            if (password !== confirm) {
                alert('Passwords do not match');
                signupBtn.disabled = false;
                signupBtn.textContent = 'Sign Up';
                return;
            }
            
            if (!email.includes('@') || !email.includes('.')) {
                alert('Please enter a valid email address');
                signupBtn.disabled = false;
                signupBtn.textContent = 'Sign Up';
                return;
            }
            
            // For demo, accept any valid signup
            const user = {
                email: email,
                name: email.split('@')[0],
                signupTime: new Date().toISOString()
            };
            
            try {
                localStorage.setItem('user', JSON.stringify(user));
                alert('Signup successful! Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Signup failed:', error);
                alert('Signup failed. Please try again.');
                signupBtn.disabled = false;
                signupBtn.textContent = 'Sign Up';
            }
        });
    }
}

// Logout function - redirects to landing page (index.html)
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Get current user info
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}