// Authentication credentials
const ADMIN_CREDENTIALS = {
    email: "bahaa.ayman@samaagroup.net",
    password: "bahaa.ayman@samaagroup.net",
    role: "admin"
};

// Sample initial users data
let users = [
    {
        id: 1,
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password,
        role: ADMIN_CREDENTIALS.role,
        name: "Bahaa Ayman",
        active: true
    }
];

// Sample initial data
let clients = [
    {
        id: 1,
        clientName: "اي مكان CX",
        supportAgent: "AbdelRahman",
        salesAgent: "",
        docAgent: "AbdelRahman",
        isVerified: false,
        hasBlueCheck: false,
        businessType: "خدمات الشحن والتوصيل",
        servicePackage: "1,000,000",
        contractDate: "2024/03/28",
        lastSubscriptionStart: "2024/03/28",
        subscriptionEnd: "2025/03/28",
        subscriptionMonths: "12",
        contractStatus: "انتهى الاشتراك",
        exitDate: "2025/03/28",
        previousAgent: "",
        whatsappGroup: ""
    },
    {
        id: 2,
        clientName: "شركة التقنية المتقدمة",
        supportAgent: "أحمد محمد",
        salesAgent: "محمد علي",
        docAgent: "عمر خالد",
        isVerified: true,
        hasBlueCheck: true,
        businessType: "تقنية المعلومات",
        servicePackage: "الباقة الذهبية",
        contractDate: "2024-01-01",
        lastSubscriptionStart: "2024-01-01",
        subscriptionEnd: "2024-12-31",
        subscriptionMonths: "12",
        contractStatus: "نشط",
        exitDate: "",
        previousAgent: "",
        whatsappGroup: "مجموعة التقنية المتقدمة"
    }
];

// Check if user is logged in
let isLoggedIn = false;
let currentUser = null;

// DOM Elements
const loginForm = document.getElementById('loginForm');
const adminDashboard = document.getElementById('adminDashboard');
const clientForm = document.getElementById('clientForm');

const CONFIG = {
    statusColors: {
        'منتهي': '#FF4B55',
        'قريب من الانتهاء': '#FFA500',
        'نشط': '#4CAF50',
        'جديد': '#2196F3',
        'غير محدد': '#9E9E9E'
    },
    dateFormat: {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    },
    searchDebounceTime: 300,
    cardTemplate: '#client-card-template',
    emptyStateTemplate: '#empty-state-template'
};

const DOM = {
    elements: {
        searchInput: document.getElementById('searchInput'),
        clientsContainer: document.getElementById('clientsContainer'),
        filterDropdown: document.getElementById('filterDropdown'),
        sortDropdown: document.getElementById('sortDropdown'),
        loginForm: document.getElementById('loginForm'),
        userNav: document.getElementById('userNav'),
        adminNav: document.getElementById('adminNav')
    },

    templates: {
        clientCard: document.querySelector(CONFIG.cardTemplate),
        emptyState: document.querySelector(CONFIG.emptyStateTemplate)
    },

    init() {
        // Validate all required elements are present
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                console.error(`Required DOM element not found: ${key}`);
            }
        }

        // Validate all required templates are present
        for (const [key, template] of Object.entries(this.templates)) {
            if (!template) {
                console.error(`Required template not found: ${key}`);
            }
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    setupFilters();
    // Check if we're on the admin page
    if (window.location.pathname.includes('admin.html')) {
        // Check if user is already logged in
        isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            showDashboard();
        }
    }
    
    // Initialize tables
    if (document.getElementById('clientsTable')) {
        renderClientsTable();
    }
    if (document.getElementById('adminClientsTable')) {
        renderAdminClientsTable();
    }
});

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('clientSearch');
    const showFiltersBtn = document.getElementById('showFilters');
    const advancedFilters = document.getElementById('advancedFilters');

    // Handle search input
    searchInput.addEventListener('input', () => {
        applySearchAndFilters();
    });

    // Toggle advanced filters
    showFiltersBtn.addEventListener('click', () => {
        advancedFilters.style.display = advancedFilters.style.display === 'none' ? 'block' : 'none';
    });
}

// Apply search and filters
function applySearchAndFilters() {
    const searchQuery = document.getElementById('clientSearch').value.toLowerCase();
    const filterValues = {
        supportAgent: document.getElementById('filterSupportAgent').value.toLowerCase(),
        salesAgent: document.getElementById('filterSalesAgent').value.toLowerCase(),
        docAgent: document.getElementById('filterDocAgent').value.toLowerCase(),
        businessType: document.getElementById('filterBusinessType').value.toLowerCase(),
        verified: document.getElementById('filterVerified').value
    };

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.clientName.toLowerCase().includes(searchQuery);
        const matchesSupportAgent = !filterValues.supportAgent || client.supportAgent.toLowerCase().includes(filterValues.supportAgent);
        const matchesSalesAgent = !filterValues.salesAgent || client.salesAgent.toLowerCase().includes(filterValues.salesAgent);
        const matchesDocAgent = !filterValues.docAgent || client.docAgent.toLowerCase().includes(filterValues.docAgent);
        const matchesBusinessType = !filterValues.businessType || client.businessType.toLowerCase().includes(filterValues.businessType);
        const matchesVerified = !filterValues.verified || client.isVerified.toString() === filterValues.verified;

        return matchesSearch && matchesSupportAgent && matchesSalesAgent && 
               matchesDocAgent && matchesBusinessType && matchesVerified;
    });

    renderSearchResults(filteredClients);
}

// Render search results as cards
function renderSearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                <p>لم يتم العثور على نتائج</p>
            </div>
        `;
        return;
    }

    searchResults.innerHTML = results.map(client => {
        const contractStatus = getContractStatus(client.subscriptionEnd);
        return `
            <div class="client-card" onclick="showProfileView(${client.id})">
                <div class="client-card-header">
                    <div>
                        <div class="client-card-name">${client.clientName}</div>
                        <div class="client-card-badges">
                            ${client.isVerified ? `
                                <span class="client-card-badge" style="background-color: #e3f2fd; color: #1976d2;">
                                    <i class="fas fa-check-circle"></i>
                                    موثق
                                </span>
                            ` : ''}
                            ${client.hasBlueCheck ? `
                                <span class="client-card-badge" style="background-color: #e8f5e9; color: #2e7d32;">
                                    <i class="fas fa-badge-check"></i>
                                    علامة زرقاء
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    <div class="client-card-status" style="background-color: ${contractStatus.color}; padding: 0.25rem 0.5rem; border-radius: 4px; color: ${contractStatus.status === 'العقد ساري' ? '#1b5e20' : '#c62828'}">
                        ${contractStatus.status}
                    </div>
                </div>
                <div class="client-card-info">
                    <div class="client-card-item">
                        <div class="client-card-label">نوع النشاط</div>
                        <div class="client-card-value">${client.businessType}</div>
                    </div>
                    <div class="client-card-item">
                        <div class="client-card-label">الباقة</div>
                        <div class="client-card-value">${client.servicePackage}</div>
                    </div>
                    <div class="client-card-item">
                        <div class="client-card-label">مسؤول الدعم</div>
                        <div class="client-card-value">${client.supportAgent || 'غير محدد'}</div>
                    </div>
                    <div class="client-card-item">
                        <div class="client-card-label">تاريخ انتهاء الاشتراك</div>
                        <div class="client-card-value">${client.subscriptionEnd ? formatDate(client.subscriptionEnd) : 'غير محدد'}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Show search view
function showSearchView() {
    document.getElementById('profileView').style.display = 'none';
    document.getElementById('searchResults').style.display = 'grid';
    document.querySelector('.search-section').style.display = 'block';
}

// Login function
function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.email === email && u.password === password && u.active);
    
    if (user) {
        console.log('Login successful');
        isLoggedIn = true;
        currentUser = user;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        showDashboard();
        updateNavigation(user);
    } else {
        console.log('Login failed');
        alert('بيانات الدخول غير صحيحة');
    }
    return false;
}

// Show dashboard after successful login
function showDashboard() {
    if (loginForm) loginForm.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'block';
    renderAdminClientsTable();
}

// Render clients table (public view)
function renderClientsTable() {
    renderClientsTableWithData(clients);
}

// Render admin clients table
function renderAdminClientsTable() {
    renderAdminClientsTableWithData(clients);
}

// Show add client form
function showAddClientForm() {
    document.getElementById('formTitle').textContent = 'إضافة عميل جديد';
    document.getElementById('editingId').value = '';
    clientForm.style.display = 'block';
    // Clear form fields
    document.getElementById('clientName').value = '';
    document.getElementById('supportAgent').value = '';
    document.getElementById('salesAgent').value = '';
    document.getElementById('docAgent').value = '';
    document.getElementById('isVerified').checked = false;
    document.getElementById('hasBlueCheck').checked = false;
    document.getElementById('businessType').value = '';
    document.getElementById('servicePackage').value = '';
}

// Hide client form
function hideClientForm() {
    clientForm.style.display = 'none';
}

// Function to calculate months between two dates
function calculateMonthsDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30.44)); // Average days in a month
}

// Function to determine contract status and color
function getContractStatus(endDate) {
    const today = new Date();
    const end = new Date(endDate);
    const daysUntilEnd = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    if (end < today) {
        return {
            status: 'انتهى الاشتراك',
            color: '#ffebee' // Light red background
        };
    } else if (daysUntilEnd <= 30) {
        return {
            status: 'اقترب انتهاء الاشتراك يرجى التجديد',
            color: '#fff3e0' // Light orange background
        };
    } else {
        return {
            status: 'العقد ساري',
            color: '#e8f5e9' // Light green background
        };
    }
}

// Format date helper function
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Riyadh'
    }).format(date);
}

// Format date with time helper function
function formatDateTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Riyadh'
    }).format(date);
}

// Handle client form submission
function handleClientSubmit(event) {
    event.preventDefault();
    
    const editingId = document.getElementById('editingId').value;
    const lastSubscriptionStart = document.getElementById('lastSubscriptionStart').value;
    const subscriptionEnd = document.getElementById('subscriptionEnd').value;
    
    const newClient = {
        id: editingId ? parseInt(editingId) : Date.now(),
        clientName: document.getElementById('clientName').value,
        supportAgent: document.getElementById('supportAgent').value,
        salesAgent: document.getElementById('salesAgent').value,
        docAgent: document.getElementById('docAgent').value,
        isVerified: document.getElementById('isVerified').checked,
        hasBlueCheck: document.getElementById('hasBlueCheck').checked,
        businessType: document.getElementById('businessType').value,
        servicePackage: document.getElementById('servicePackage').value,
        contractDate: document.getElementById('contractDate').value,
        lastSubscriptionStart: lastSubscriptionStart,
        subscriptionEnd: subscriptionEnd,
        subscriptionMonths: calculateMonthsDifference(lastSubscriptionStart, subscriptionEnd),
        contractStatus: getContractStatus(subscriptionEnd).status,
        exitDate: document.getElementById('exitDate').value,
        previousAgent: document.getElementById('previousAgent').value,
        whatsappGroup: document.getElementById('whatsappGroup').value
    };

    if (editingId) {
        const index = clients.findIndex(c => c.id === parseInt(editingId));
        if (index !== -1) {
            clients[index] = newClient;
        }
    } else {
        clients.push(newClient);
    }

    localStorage.setItem('clients', JSON.stringify(clients));
    renderClientsTable();
    renderAdminClientsTable();
    hideClientForm();
    
    return false;
}

// Edit client
function editClient(id) {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    document.getElementById('formTitle').textContent = 'تعديل بيانات العميل';
    document.getElementById('editingId').value = id;
    document.getElementById('clientName').value = client.clientName;
    document.getElementById('supportAgent').value = client.supportAgent;
    document.getElementById('salesAgent').value = client.salesAgent;
    document.getElementById('docAgent').value = client.docAgent;
    document.getElementById('isVerified').checked = client.isVerified;
    document.getElementById('hasBlueCheck').checked = client.hasBlueCheck;
    document.getElementById('businessType').value = client.businessType;
    document.getElementById('servicePackage').value = client.servicePackage;

    clientForm.style.display = 'block';
}

// Delete client
function deleteClient(id) {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        clients = clients.filter(c => c.id !== id);
        localStorage.setItem('clients', JSON.stringify(clients));
        renderClientsTable();
        renderAdminClientsTable();
    }
}

// Load saved clients from localStorage on page load
const savedClients = localStorage.getItem('clients');
if (savedClients) {
    clients = JSON.parse(savedClients);
}

// Filter functions
function setupFilters() {
    // Public page filters
    const filterElements = {
        clientName: document.getElementById('filterClientName'),
        supportAgent: document.getElementById('filterSupportAgent'),
        salesAgent: document.getElementById('filterSalesAgent'),
        docAgent: document.getElementById('filterDocAgent'),
        businessType: document.getElementById('filterBusinessType'),
        verified: document.getElementById('filterVerified')
    };

    // Admin page filters
    const adminFilterElements = {
        clientName: document.getElementById('adminFilterClientName'),
        supportAgent: document.getElementById('adminFilterSupportAgent'),
        salesAgent: document.getElementById('adminFilterSalesAgent'),
        docAgent: document.getElementById('adminFilterDocAgent'),
        businessType: document.getElementById('adminFilterBusinessType'),
        verified: document.getElementById('adminFilterVerified')
    };

    // Add event listeners for public page
    if (filterElements.clientName) {
        Object.values(filterElements).forEach(element => {
            if (element) {
                element.addEventListener('input', () => applyFilters(false));
            }
        });
    }

    // Add event listeners for admin page
    if (adminFilterElements.clientName) {
        Object.values(adminFilterElements).forEach(element => {
            if (element) {
                element.addEventListener('input', () => applyFilters(true));
            }
        });
    }
}

function applyFilters(isAdmin) {
    const prefix = isAdmin ? 'admin' : '';
    const filterValues = {
        clientName: document.getElementById(`${prefix}FilterClientName`)?.value.toLowerCase() || '',
        supportAgent: document.getElementById(`${prefix}FilterSupportAgent`)?.value || '',
        salesAgent: document.getElementById(`${prefix}FilterSalesAgent`)?.value || '',
        docAgent: document.getElementById(`${prefix}FilterDocAgent`)?.value || '',
        businessType: document.getElementById(`${prefix}FilterBusinessType`)?.value.toLowerCase() || '',
        verified: document.getElementById(`${prefix}FilterVerified`)?.value || ''
    };

    const filteredClients = clients.filter(client => {
        const matchesClientName = client.clientName.toLowerCase().includes(filterValues.clientName);
        const matchesSupportAgent = filterValues.supportAgent === '' || client.supportAgent === filterValues.supportAgent;
        const matchesSalesAgent = filterValues.salesAgent === '' || client.salesAgent === filterValues.salesAgent;
        const matchesDocAgent = filterValues.docAgent === '' || client.docAgent === filterValues.docAgent;
        const matchesBusinessType = client.businessType.toLowerCase().includes(filterValues.businessType);
        const matchesVerified = filterValues.verified === '' || 
            client.isVerified.toString() === filterValues.verified;

        return matchesClientName && matchesSupportAgent && matchesSalesAgent && 
               matchesDocAgent && matchesBusinessType && matchesVerified;
    });

    if (isAdmin) {
        renderAdminClientsTableWithData(filteredClients);
    } else {
        renderClientsTableWithData(filteredClients);
    }
}

// Modified render functions to accept filtered data
function renderClientsTableWithData(data) {
    const tableBody = document.querySelector('#clientsTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = data.map(client => {
        const contractStatus = getContractStatus(client.subscriptionEnd);
        const months = client.subscriptionMonths || calculateMonthsDifference(client.lastSubscriptionStart, client.subscriptionEnd);

        return `
        <tr onclick="showProfileView(${client.id})" style="cursor: pointer;">
            <td>${client.clientName}</td>
            <td>${client.supportAgent}</td>
            <td>${client.salesAgent}</td>
            <td>${client.docAgent}</td>
            <td>${client.isVerified ? '✓' : '✗'}</td>
            <td>${client.hasBlueCheck ? '✓' : '✗'}</td>
            <td>${client.businessType}</td>
            <td>${client.servicePackage}</td>
            <td>${client.contractDate ? formatDate(client.contractDate) : 'غير محدد'}</td>
            <td>${client.lastSubscriptionStart ? formatDate(client.lastSubscriptionStart) : 'غير محدد'}</td>
            <td>${client.subscriptionEnd ? formatDate(client.subscriptionEnd) : 'غير محدد'}</td>
            <td>${months}</td>
            <td style="background-color: ${contractStatus.color}">${contractStatus.status}</td>
            <td>${client.exitDate ? formatDate(client.exitDate) : 'غير محدد'}</td>
            <td>${client.previousAgent || 'غير محدد'}</td>
            <td>${client.whatsappGroup || 'غير محدد'}</td>
        </tr>
    `}).join('');
}

function renderAdminClientsTableWithData(data) {
    const tableBody = document.querySelector('#adminClientsTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = data.map(client => {
        // Calculate subscription months if not provided
        const months = client.subscriptionMonths || calculateMonthsDifference(client.lastSubscriptionStart, client.subscriptionEnd);
        const contractStatus = getContractStatus(client.subscriptionEnd);

        return `
        <tr>
            <td>${client.clientName}</td>
            <td>${client.supportAgent}</td>
            <td>${client.salesAgent}</td>
            <td>${client.docAgent}</td>
            <td>${client.isVerified ? '✓' : '✗'}</td>
            <td>${client.hasBlueCheck ? '✓' : '✗'}</td>
            <td>${client.businessType}</td>
            <td>${client.servicePackage}</td>
            <td>${client.contractDate ? formatDate(client.contractDate) : 'غير محدد'}</td>
            <td>${client.lastSubscriptionStart ? formatDate(client.lastSubscriptionStart) : 'غير محدد'}</td>
            <td>${client.subscriptionEnd ? formatDate(client.subscriptionEnd) : 'غير محدد'}</td>
            <td>${months}</td>
            <td style="background-color: ${contractStatus.color}">${contractStatus.status}</td>
            <td>${client.exitDate ? formatDate(client.exitDate) : 'غير محدد'}</td>
            <td>${client.previousAgent || 'غير محدد'}</td>
            <td>${client.whatsappGroup || 'غير محدد'}</td>
            <td class="action-buttons">
                <button onclick="editClient(${client.id})" class="btn-secondary">تعديل</button>
                <button onclick="deleteClient(${client.id})" class="btn-danger">حذف</button>
            </td>
        </tr>
    `}).join('');
}

// Update navigation based on user role
function updateNavigation(user) {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    // Show/hide admin link based on role
    let adminLink = navLinks.querySelector('.admin-link');
    if (user.role === 'admin') {
        if (!adminLink) {
            adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.className = 'admin-link';
            adminLink.innerHTML = '<i class="fas fa-user-shield"></i> لوحة التحكم';
            // Insert before auth buttons
            const authButtons = navLinks.querySelector('.auth-buttons');
            navLinks.insertBefore(adminLink, authButtons);
        }
    } else if (adminLink) {
        adminLink.remove();
    }

    // Update user profile dropdown
    const userProfile = document.getElementById('userProfile');
    const loginBtn = document.getElementById('loginBtn');
    
    if (userProfile && loginBtn) {
        userProfile.style.display = isLoggedIn ? 'block' : 'none';
        loginBtn.style.display = isLoggedIn ? 'none' : 'block';
        
        if (isLoggedIn) {
            const userName = userProfile.querySelector('#userName');
            if (userName) {
                userName.textContent = user.name;
            }
        }
    }
}

// Check auth status on page load
function checkAuthStatus() {
    const storedUser = localStorage.getItem('currentUser');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (storedIsLoggedIn === 'true' && storedUser) {
        isLoggedIn = true;
        currentUser = JSON.parse(storedUser);
        updateNavigation(currentUser);
    } else {
        window.location.href = 'login.html';
    }
}

// Add logout functionality
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    isLoggedIn = false;
    currentUser = null;
    window.location.href = 'login.html';
}

// Modified showProfileView function
function showProfileView(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    // Hide search view and show profile view
    document.getElementById('searchResults').style.display = 'none';
    document.querySelector('.search-section').style.display = 'none';
    document.getElementById('profileView').style.display = 'block';

    // Update profile information (existing code remains the same)
    document.getElementById('profileClientName').textContent = client.clientName;
    
    const verificationBadge = document.getElementById('profileVerification');
    const blueCheckBadge = document.getElementById('profileBlueCheck');
    
    verificationBadge.style.display = client.isVerified ? 'inline-flex' : 'none';
    blueCheckBadge.style.display = client.hasBlueCheck ? 'inline-flex' : 'none';

    const statusElement = document.getElementById('profileStatus');
    const contractStatus = getContractStatus(client.subscriptionEnd);
    statusElement.textContent = contractStatus.status;
    statusElement.className = `profile-status ${getStatusClass(contractStatus.status)}`;

    document.getElementById('profileSupportAgent').textContent = client.supportAgent || 'غير محدد';
    document.getElementById('profileSalesAgent').textContent = client.salesAgent || 'غير محدد';
    document.getElementById('profileDocAgent').textContent = client.docAgent || 'غير محدد';

    document.getElementById('profileBusinessType').textContent = client.businessType || 'غير محدد';
    document.getElementById('profileServicePackage').textContent = client.servicePackage || 'غير محدد';
    document.getElementById('profileWhatsappGroup').textContent = client.whatsappGroup || 'غير محدد';

    document.getElementById('profileContractDate').textContent = client.contractDate ? formatDate(client.contractDate) : 'غير محدد';
    document.getElementById('profileSubscriptionStart').textContent = client.lastSubscriptionStart ? formatDate(client.lastSubscriptionStart) : 'غير محدد';
    document.getElementById('profileSubscriptionEnd').textContent = client.subscriptionEnd ? formatDate(client.subscriptionEnd) : 'غير محدد';
    document.getElementById('profileSubscriptionMonths').textContent = 
        client.subscriptionMonths ? client.subscriptionMonths + ' شهر' : 'غير محدد';
}

// Show table view
function showTableView() {
    document.getElementById('profileView').style.display = 'none';
    document.getElementById('tableView').style.display = 'block';
}

// Get status class for styling
function getStatusClass(status) {
    if (status === 'انتهى الاشتراك') {
        return 'status-expired';
    } else if (status === 'اقترب انتهاء الاشتراك يرجى التجديد') {
        return 'status-warning';
    } else {
        return 'status-active';
    }
}

// Toggle Advanced Filters
document.getElementById('showFilters').addEventListener('click', function() {
    const filterSection = document.getElementById('advancedFilters');
    filterSection.style.display = filterSection.style.display === 'none' ? 'block' : 'none';
    filterSection.classList.toggle('show');
});

// Quick Filters
document.querySelectorAll('.quick-filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.quick-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to clicked button
        this.classList.add('active');
        // Apply the filter
        applyQuickFilter(this.dataset.filter);
    });
});

// Search functionality
let searchTimeout;
document.getElementById('clientSearch').addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchClients(this.value);
    }, 300);
});

// Reset Filters
function resetFilters() {
    // Reset all inputs
    document.querySelectorAll('.filter-section input, .filter-section select').forEach(input => {
        input.value = '';
    });
    // Reset quick filters
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.quick-filter-btn[data-filter="all"]').classList.add('active');
    // Reset search
    document.getElementById('clientSearch').value = '';
    // Refresh results
    searchClients('');
}

// Apply Filters
function applyFilters() {
    const filters = {
        supportAgent: document.getElementById('filterSupportAgent').value,
        salesAgent: document.getElementById('filterSalesAgent').value,
        docAgent: document.getElementById('filterDocAgent').value,
        businessType: document.getElementById('filterBusinessType').value,
        package: document.getElementById('filterPackage').value,
        subscriptionDate: document.getElementById('filterSubscriptionDate').value,
        verified: document.getElementById('filterVerified').value,
        status: document.getElementById('filterStatus').value,
        blueCheck: document.getElementById('filterBlueCheck').value
    };
    
    searchClients(document.getElementById('clientSearch').value, filters);
}

// Quick Filter Application
function applyQuickFilter(filter) {
    let filters = {};
    switch(filter) {
        case 'active':
            filters.status = 'active';
            break;
        case 'pending':
            filters.status = 'pending';
            break;
        case 'expired':
            filters.status = 'expired';
            break;
        case 'verified':
            filters.verified = 'true';
            break;
        case 'all':
        default:
            filters = {};
            break;
    }
    searchClients(document.getElementById('clientSearch').value, filters);
}

// Main Search Function
function searchClients(query, filters = {}) {
    // Here you would implement the actual search logic
    // This is a placeholder that you would replace with your actual implementation
    console.log('Searching for:', query);
    console.log('With filters:', filters);
    
    // Example of how to update the results
    updateSearchResults([
        // Your search results would go here
    ]);
}

// Update Search Results
function updateSearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>لا توجد نتائج مطابقة للبحث</p>
            </div>
        `;
        return;
    }
    
    // Render results
    searchResults.innerHTML = results.map(client => `
        <div class="client-card" onclick="showClientProfile('${client.id}')">
            <!-- Client card content -->
        </div>
    `).join('');
}

// Show Client Profile
function showClientProfile(clientId) {
    // Hide search results and show profile view
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('profileView').style.display = 'block';
    
    // Load and display client data
    loadClientProfile(clientId);
}

// Return to Search View
function showSearchView() {
    document.getElementById('searchResults').style.display = 'grid';
    document.getElementById('profileView').style.display = 'none';
}

// Load Client Profile Data
function loadClientProfile(clientId) {
    // Here you would implement the actual profile loading logic
    // This is a placeholder that you would replace with your actual implementation
    console.log('Loading profile for client:', clientId);
}

const View = {
    renderClientCard(client) {
        const template = document.getElementById('client-template');
        const clone = template.content.cloneNode(true);
        
        // Set client information
        clone.querySelector('.client-name').textContent = client.name;
        clone.querySelector('.title').textContent = client.title || 'غير محدد';
        clone.querySelector('.company-name').textContent = client.company || '-';
        clone.querySelector('.activity-type').textContent = client.activityType || '-';
        clone.querySelector('.support-package').textContent = client.supportPackage || '-';
        clone.querySelector('.team-members').textContent = client.teamMembers?.join(', ') || '-';
        clone.querySelector('.contract-start').textContent = Utils.formatDate(client.contractStart);
        clone.querySelector('.contract-end').textContent = Utils.formatDate(client.contractEnd);
        
        // Set status indicator
        const status = Utils.getContractStatus(client.contractEnd);
        const statusIndicator = clone.querySelector('.status-indicator');
        statusIndicator.classList.add(status.toLowerCase());
        statusIndicator.querySelector('.status-text').textContent = status;
        
        // Set verification badge visibility
        const verificationBadge = clone.querySelector('.verification-badge');
        verificationBadge.style.display = client.isVerified ? 'flex' : 'none';
        
        // Add event listeners
        const card = clone.querySelector('.client-profile-card');
        card.addEventListener('click', () => {
            EventHandler.handleClientCardClick(client);
        });
        
        return clone;
    },
    
    renderSearchResults(clients) {
        const container = DOM.elements.clientsContainer;
        container.innerHTML = '';
        
        if (clients.length === 0) {
            container.appendChild(this.renderEmptyState());
            return;
        }
        
        clients.forEach(client => {
            container.appendChild(this.renderClientCard(client));
        });
    },
    
    // ... existing code ...
};

const Utils = {
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        // Add 3 hours for UTC+3
        date.setHours(date.getHours() + 3);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Riyadh'
        }).format(date);
    },
    
    getContractStatus(endDate) {
        if (!endDate) return 'غير محدد';
        
        const today = new Date();
        const contractEnd = new Date(endDate);
        const monthsLeft = this.getMonthsDifference(today, contractEnd);
        
        if (contractEnd < today) {
            return 'منتهي';
        } else if (monthsLeft <= 1) {
            return 'قريب من الانتهاء';
        } else if (monthsLeft <= 3) {
            return 'نشط';
        } else {
            return 'جديد';
        }
    },
    
    getMonthsDifference(date1, date2) {
        const yearDiff = date2.getFullYear() - date1.getFullYear();
        const monthDiff = date2.getMonth() - date1.getMonth();
        return yearDiff * 12 + monthDiff;
    },
    
    // ... existing code ...
};

const EventHandler = {
    init() {
        // Search and filter events
        DOM.elements.searchInput.addEventListener('input', Utils.debounce(() => {
            Search.performSearch();
        }, CONFIG.searchDebounceTime));

        DOM.elements.filterDropdown.addEventListener('change', () => {
            Search.performSearch();
        });

        DOM.elements.sortDropdown.addEventListener('change', () => {
            Search.performSearch();
        });

        // Client card events using event delegation
        DOM.elements.clientsContainer.addEventListener('click', (event) => {
            const clientCard = event.target.closest('.client-card');
            if (!clientCard) return;

            const action = event.target.dataset.action;
            const clientId = clientCard.dataset.clientId;

            switch (action) {
                case 'edit':
                    this.handleEditClient(clientId);
                    break;
                case 'delete':
                    this.handleDeleteClient(clientId);
                    break;
                case 'view':
                    this.handleViewClient(clientId);
                    break;
            }
        });

        // Login form submission
        DOM.elements.loginForm?.addEventListener('submit', (event) => {
            event.preventDefault();
            Auth.handleLogin(event);
        });
    },

    handleEditClient(clientId) {
        // Implement edit client logic
        console.log('Edit client:', clientId);
    },

    handleDeleteClient(clientId) {
        if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
            // Implement delete client logic
            console.log('Delete client:', clientId);
        }
    },

    handleViewClient(clientId) {
        // Implement view client logic
        console.log('View client:', clientId);
    }
};