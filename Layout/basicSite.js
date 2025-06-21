// Simple logging function with timestamp
function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

// Authentication state
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
let currentUser = localStorage.getItem('currentUser') || '';

// Modal and form elements
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const toggleAuth = document.getElementById('toggleAuth');
const closeModal = document.getElementsByClassName('close');
const loginBtn = document.getElementById('loginBtn');
const signUpBtn = document.getElementById('signUpBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authButtons = document.getElementById('authButtons');
const learnMoreModal = document.getElementById('learnMoreModal');

// Update UI based on authentication state
function updateUI() {
    if (isAuthenticated) {
        loginBtn.style.display = 'none';
        signUpBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        log(`User logged in: ${currentUser}`);
    } else {
        loginBtn.style.display = 'inline-block';
        signUpBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        log('User logged out');
    }
}

// Show modal
function showModal(modal, mode) {
    if (modal === authModal) {
        modalTitle.textContent = mode === 'login' ? 'Login' : 'Sign Up';
        submitBtn.textContent = mode === 'login' ? 'Login' : 'Sign Up';
    }
    modal.style.display = 'block';
}

// Handle form submission
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const mode = submitBtn.textContent.toLowerCase();

    if (mode === 'login') {
        if (username === 'user' && password === 'pass') {
            isAuthenticated = true;
            currentUser = username;
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', currentUser);
            authModal.style.display = 'none';
            updateUI();
        } else {
            log('Login failed: Invalid credentials');
            alert('Invalid username or password');
        }
    } else if (mode === 'sign up') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', username);
        isAuthenticated = true;
        currentUser = username;
        authModal.style.display = 'none';
        updateUI();
    }
});

// Toggle between login and sign up
toggleAuth.addEventListener('click', () => {
    const mode = submitBtn.textContent.toLowerCase() === 'login' ? 'sign up' : 'login';
    showModal(authModal, mode);
});

// Close modal
Array.from(closeModal).forEach(close => {
    close.addEventListener('click', () => {
        authModal.style.display = 'none';
        learnMoreModal.style.display = 'none';
    });
});

// Logout
logoutBtn.addEventListener('click', () => {
    isAuthenticated = false;
    currentUser = '';
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    updateUI();
});

// Show login modal on button click
loginBtn.addEventListener('click', () => showModal(authModal, 'login'));
signUpBtn.addEventListener('click', () => showModal(authModal, 'sign up'));

// Show learn more modal
document.querySelector('.learn').addEventListener('click', () => {
    log('Learn More clicked');
    showModal(learnMoreModal, '');
});

// Log page load and initial UI update
window.onload = () => {
    log('Page loaded successfully');
    updateUI();
};