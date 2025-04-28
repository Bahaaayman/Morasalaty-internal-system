// Authentication credentials
const ADMIN_CREDENTIALS = {
    email: "bahaa.ayman@samaagroup.net",
    password: "bahaa.ayman@samaagroup.net",
    role: "admin",
    name: "Bahaa Ayman"
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication state first
    checkAuth();

    // Handle login form if it exists
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                // Save auth state and user data
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', ADMIN_CREDENTIALS.name);
                localStorage.setItem('userData', JSON.stringify(ADMIN_CREDENTIALS));
                
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
                    errorMessage.style.display = 'block';
                }
            }
        });
    }

    // Set up dropdown functionality
    setupDropdown();
});

// Update navigation based on auth status
function updateNavigation() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (userData) {
        // Hide login button, show user profile
        if (loginBtn) loginBtn.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'block';
            const userName = userProfile.querySelector('#userName');
            if (userName) {
                userName.textContent = userData.name;
            }
        }

        // Add admin link if user is admin
        if (userData.role === 'admin') {
            let adminLink = navLinks.querySelector('.admin-link');
            if (!adminLink) {
                adminLink = document.createElement('a');
                adminLink.href = 'admin.html';
                adminLink.className = 'admin-link';
                adminLink.innerHTML = '<i class="fas fa-user-shield"></i> لوحة التحكم';
                navLinks.insertBefore(adminLink, loginBtn || userProfile);
            }
        }
    } else {
        // Show login button, hide user profile
        if (loginBtn) loginBtn.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
        
        // Remove admin link if exists
        const adminLink = navLinks.querySelector('.admin-link');
        if (adminLink) {
            adminLink.remove();
        }
    }
}

// Check admin access
function checkAdminAccess() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || userData.role !== 'admin') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    
    if (isLoggedIn && userData) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'block';
            const userName = userProfile.querySelector('#userName');
            if (userName) {
                userName.textContent = userData.name;
            }
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userData');
    window.location.href = 'login.html';
}

function setupDropdown() {
    const profileToggle = document.querySelector('.profile-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (profileToggle && dropdownMenu) {
        // Toggle dropdown on profile button click
        profileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.user-profile-dropdown')) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
} 