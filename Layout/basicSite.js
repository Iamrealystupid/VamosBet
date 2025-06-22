let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
let currentUser = localStorage.getItem('currentUser') || '';

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

function updateUI() {
  if (isAuthenticated) {
    loginBtn.style.display = 'none';
    signUpBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    loginBtn.style.display = 'inline-block';
    signUpBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }
}

function showModal(modal, mode) {
  if (modal === authModal) {
    modalTitle.textContent = mode === 'login' ? 'Login' : 'Sign Up';
    submitBtn.textContent = mode === 'login' ? 'Login' : 'Sign Up';
  }
  modal.style.display = 'block';
}

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

toggleAuth.addEventListener('click', () => {
  const mode = submitBtn.textContent.toLowerCase() === 'login' ? 'sign up' : 'login';
  showModal(authModal, mode);
});

Array.from(closeModal).forEach(close => {
  close.addEventListener('click', () => {
    authModal.style.display = 'none';
    learnMoreModal.style.display = 'none';
  });
});

logoutBtn.addEventListener('click', () => {
  isAuthenticated = false;
  currentUser = '';
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUser');
  updateUI();
});

loginBtn.addEventListener('click', () => showModal(authModal, 'login'));
signUpBtn.addEventListener('click', () => showModal(authModal, 'sign up'));

document.querySelector('.learn').addEventListener('click', () => {
  showModal(learnMoreModal, '');
});

window.addEventListener('load', () => {
  updateUI();
  const splash = document.getElementById("splashScreen");
  setTimeout(() => {
    splash.style.display = "none";
  }, 4000);
});

