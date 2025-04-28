// Check if user is authenticated and has admin privileges
document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || userData.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Initialize the dashboard
    initializeDashboard();
});

// Format date helper function
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Riyadh'
    }).format(date);
}

// Format short date (without time) helper function
function formatShortDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Riyadh'
    }).format(date);
}

function initializeDashboard() {
    // Update statistics
    updateStats();

    // Set last update time with English format
    document.getElementById('lastUpdate').textContent = formatDate(new Date());

    // Add event listeners to buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
}

function updateStats() {
    // In a real application, these would be fetched from a backend
    const stats = {
        users: 15,
        admins: 3
    };

    document.getElementById('totalUsers').textContent = stats.users;
    document.getElementById('totalAdmins').textContent = stats.admins;
}

function handleButtonClick(event) {
    const button = event.target.closest('.btn-primary');
    if (!button) return;

    const action = button.textContent.trim();
    
    switch(action) {
        case 'إضافة مستخدم':
            showAddUserModal();
            break;
        case 'تعديل الإعدادات':
            showSettingsModal();
            break;
        case 'عرض السجل':
            showActivityLog();
            break;
    }
}

function showAddUserModal() {
    // Implement user addition functionality
    alert('سيتم إضافة هذه الميزة قريباً');
}

function showSettingsModal() {
    // Implement settings modification functionality
    alert('سيتم إضافة هذه الميزة قريباً');
}

function showActivityLog() {
    // Implement activity log display functionality
    alert('سيتم إضافة هذه الميزة قريباً');
}

// Check if user is logged in and has admin role
function checkAdminAccess() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || userData.role !== 'admin') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize admin page
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAccess()) {
        return; // Stop initialization if not admin
    }
    
    setupTabSwitching();
    loadUsers();
    updateNavigation();
});

// Tab switching functionality
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.admin-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${targetTab}Section`).classList.add('active');
        });
    });
}

// User Management Functions
function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const createdDate = currentUser.createdAt ? formatShortDate(currentUser.createdAt) : '-';
    const lastLoginDate = currentUser.lastLogin ? formatDate(currentUser.lastLogin) : '-';

    tbody.innerHTML = `
        <tr>
            <td>${currentUser.name}</td>
            <td>${currentUser.email}</td>
            <td>مدير</td>
            <td>
                <span class="status-badge active">نشط</span>
            </td>
            <td>${createdDate}</td>
            <td>${lastLoginDate}</td>
            <td>
                <button class="btn-icon" disabled title="لا يمكن تعديل المدير الرئيسي">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `;
}

// Show user form
function showUserForm() {
    const modal = document.getElementById('userFormModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Hide user form
function hideUserForm() {
    const modal = document.getElementById('userFormModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showAddUserForm() {
    document.getElementById('userFormTitle').textContent = 'إضافة مستخدم جديد';
    document.getElementById('userForm').style.display = 'block';
    document.getElementById('editingUserId').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userRole').value = 'user';
    document.getElementById('userActive').checked = true;
}

function handleUserSubmit(event) {
    event.preventDefault();
    
    const editingId = document.getElementById('editingUserId').value;
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value,
        role: document.getElementById('userRole').value,
        active: document.getElementById('userActive').checked
    };

    if (editingId) {
        // Update existing user
        const index = users.findIndex(u => u.id === parseInt(editingId));
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
        }
    } else {
        // Add new user
        userData.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push(userData);
    }

    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
    hideUserForm();
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        document.getElementById('userFormTitle').textContent = 'تعديل بيانات المستخدم';
        document.getElementById('editingUserId').value = user.id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPassword').value = ''; // Don't show existing password
        document.getElementById('userRole').value = user.role;
        document.getElementById('userActive').checked = user.active;
        document.getElementById('userForm').style.display = 'block';
    }
}

function toggleUserStatus(userId) {
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users[index].active = !users[index].active;
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    }
}

function deleteUser(userId) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    }
}

// Update navigation based on user role
function updateNavigation() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('userProfile').style.display = 'block';
        document.getElementById('userName').textContent = userData.name;
    } else {
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('userProfile').style.display = 'none';
    }
}