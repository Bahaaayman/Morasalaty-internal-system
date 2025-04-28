// Sample client data (replace with actual data from your backend)
let clients = [
    {
        id: 1,
        name: "أحمد علي",
        title: "مدير CRM",
        businessType: "متجر إلكتروني",
        companyName: "متجر الأمل",
        email: "info@alamal.com",
        phone: "0501234567",
        package: "متقدمة",
        subscriptionDate: "2024-01-15",
        contractEndDate: "2025-01-15",
        status: "active",
        verified: true,
        team: {
            support: "محمد عبدالله",
            sales: "سارة أحمد",
            documentation: "خالد محمد"
        }
    },
    {
        id: 2,
        name: "محمد أحمد",
        title: "مدير التسويق",
        businessType: "مطعم",
        companyName: "مطعم السعادة",
        email: "info@alsaada.com",
        phone: "0507654321",
        package: "أساسية",
        subscriptionDate: "2024-02-01",
        contractEndDate: "2025-02-01",
        status: "pending",
        verified: false,
        team: {
            support: "خالد عمر",
            sales: "فاطمة محمد",
            documentation: "عمر خالد"
        }
    },
    {
        id: 3,
        name: "أسامة",
        title: "المسؤول",
        businessType: "حلويات",
        companyName: "شركة سنابل السلام للصناعات الغذائية",
        phone: "+966568778213",
        website: "https://sanabel.sa",
        package: "الباقة 100 ألف محادثة مع 5 مستخدمين",
        packageValue: "20700",
        subscriptionDate: "2025-02-22",
        contractEndDate: "2026-02-22",
        status: "active",
        verified: false,
        storeType: "in-house",
        apiProvided: true,
        team: {
            support: "مهندس عبدالحميد",
            supportVisit: "مهندس هاشم",
            sales: "أحمد طه"
        },
        additionalInfo: {
            accountant: "غير محدد",
            accountantPhone: "لا يوجد",
            documentsStatus: "العرض المقدم والعقد متوقع من الطرفين ومختوم من طرفنا",
            documentsLink: "https://drive.google.com/drive/folders/1vFXNkW8AaMxkxTRSrUW8G2tRpZKR5rQ1",
            whatsappGroup: "تم",
            leadSource: "توصية من موظف سابق في مراسلاتي",
            firstContact: "2025-02-22"
        }
    },
    {
        id: 4,
        name: "خالد",
        title: "المسؤول",
        businessType: "أحذية",
        companyName: "شركة الحريبي للتجارة",
        email: "Fomashob@gmail.com",
        phone: "+966537336611",
        website: "https://fomashop.com/",
        package: "الباقة 300 ألف مع 3 يوزر + كتالوج ميتا مع سلة + تطبيق مراسلاتي في سلة + انستجرام",
        packageValue: "13340",
        subscriptionDate: "2025-04-14",
        contractEndDate: "2026-04-14", // Assuming 1-year contract
        status: "active",
        verified: false,
        verificationRequired: true,
        team: {
            sales: "أحمد طه"
        },
        additionalInfo: {
            documentsStatus: "سند التحويل والعرض المقدم",
            documentsLink: "https://drive.google.com/open?id=1Nl30b5ahFH1ggzyrzMJSJDs_p_QyAPJg&usp=drive_fs",
            whatsappGroup: "جاري العمل",
            leadSource: "زيارة",
            firstContact: "2025-04-14",
            features: [
                "كتالوج ميتا مع سلة",
                "تطبيق مراسلاتي في سلة",
                "انستجرام"
            ]
        }
    },
    {
        id: 5,
        name: "رانا أحمد",
        title: "المسؤول",
        businessType: "شركة تسويق",
        companyName: "فليكس توك",
        email: "rana.ahmed@flextock.com",
        phone: "+201000857577",
        website: "https://www.flextock.com",
        package: "اشتراك سنوي مليون رسالة خدمة عملاء مع 4 مستخدمين",
        packageValue: {
            egp: "46512",
            usd: "912"
        },
        subscriptionDate: "2025-01-13",
        contractEndDate: "2026-01-13",
        status: "active",
        verified: false,
        verificationRequired: true,
        team: {
            support: "Hashim",
            activation: "Hashim",
            sales: "AbdelHamid"
        },
        contacts: {
            ceo: {
                name: "إيناس صيام",
                title: "CEO",
                phone: "+966590846631"
            },
            accountant: {
                name: "محمد عوض",
                email: "mohamed.awad@flextock.com",
                phone: "غير محدد"
            }
        },
        additionalInfo: {
            documentsStatus: "سند التحويل والعرض المقدم",
            documentsLink: "https://drive.google.com/drive/folders/1UiSCdLlvgFxQkgFLW5klXo7onlRZIRBU",
            whatsappGroup: "جاري العمل",
            leadSource: "Management",
            firstContact: "2025-01-13"
        }
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize components
    updateStats();
    // Initially render clients but hide them
    renderClients();
    document.getElementById('clientsGrid').style.display = 'none';
    setupEventListeners();
});

// Update statistics
function updateStats() {
    const stats = {
        total: clients.length,
        active: clients.filter(c => c.status === 'active').length,
        pending: clients.filter(c => c.status === 'pending').length,
        expired: clients.filter(c => c.status === 'expired').length
    };

    document.getElementById('totalClients').textContent = stats.total;
    document.getElementById('activeClients').textContent = stats.active;
    document.getElementById('pendingClients').textContent = stats.pending;
    document.getElementById('expiredClients').textContent = stats.expired;
}

// Render client cards
function renderClients(filteredClients = null) {
    const clientsToRender = filteredClients || clients;
    const clientsGrid = document.getElementById('clientsGrid');
    
    clientsGrid.innerHTML = clientsToRender.map(client => `
        <div class="client-profile-card" data-id="${client.id}">
            <div class="profile-header" style="background-color: #FF6B2B;">
                <div class="profile-avatar">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(client.companyName)}&background=fff&color=FF6B2B&size=128" alt="${client.companyName}">
                </div>
                <div class="profile-info">
                    <h2 class="client-name" style="cursor: pointer;">${client.companyName}</h2>
                </div>
            </div>

            <div class="profile-content" style="display: none;">
                <div class="info-section">
                    <h3>معلومات الشركة</h3>
                    <div class="info-grid">
                        <div class="info-card">
                            <i class="fas fa-building"></i>
                            <h4>اسم الشركة</h4>
                            <p>${client.companyName}</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-briefcase"></i>
                            <h4>نوع النشاط</h4>
                            <p>${client.businessType}</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-box"></i>
                            <h4>نوع الباقة</h4>
                            <p>${client.package}</p>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h3>فريق الدعم</h3>
                    <div class="info-grid">
                        <div class="info-card">
                            <i class="fas fa-headset"></i>
                            <h4>الدعم الفني</h4>
                            <p>${client.team.support}</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-chart-line"></i>
                            <h4>مدير المبيعات</h4>
                            <p>${client.team.sales}</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-file-alt"></i>
                            <h4>مدير التوثيق</h4>
                            <p>${client.team.documentation}</p>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h3>معلومات التواصل</h3>
                    <div class="info-grid">
                        <div class="info-card">
                            <i class="fas fa-envelope"></i>
                            <h4>البريد الإلكتروني</h4>
                            <p>${client.email}</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-phone"></i>
                            <h4>رقم الهاتف</h4>
                            <p>${client.phone}</p>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h3>معلومات العقد</h3>
                    <div class="info-grid">
                        <div class="info-card">
                            <i class="fas fa-calendar-plus"></i>
                            <h4>تاريخ بداية العقد</h4>
                            <p>${formatDate(client.subscriptionDate)}</p>
                        </div>
                        <div class="info-card">
                            <i class="fas fa-calendar-times"></i>
                            <h4>تاريخ نهاية العقد</h4>
                            <p>${formatDate(client.contractEndDate)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add click event to client names to toggle card visibility
    document.querySelectorAll('.client-name').forEach(nameElement => {
        nameElement.addEventListener('click', function() {
            const profileContent = this.closest('.client-profile-card').querySelector('.profile-content');
            profileContent.style.display = profileContent.style.display === 'none' ? 'block' : 'none';
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('clientSearch');
    const clientsGrid = document.getElementById('clientsGrid');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                clientsGrid.style.display = 'none';
                return;
            }
            
            const filteredClients = clients.filter(client => 
                client.name?.toLowerCase().includes(searchTerm) ||
                client.companyName?.toLowerCase().includes(searchTerm) ||
                client.phone?.toLowerCase().includes(searchTerm) ||
                client.email?.toLowerCase().includes(searchTerm)
            );
            
            clientsGrid.style.display = 'grid';
            renderClients(filteredClients);
        }, 300));
    }

    // Quick filters
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const searchInput = document.getElementById('clientSearch');
            
            // Only show cards if there's a search term
            if (!searchInput.value.trim()) {
                document.getElementById('clientsGrid').style.display = 'none';
                return;
            }
            
            // Update active state
            document.querySelectorAll('.quick-filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter clients
            let filteredClients = clients;
            if (filter !== 'all') {
                filteredClients = clients.filter(client => {
                    switch(filter) {
                        case 'active':
                            return client.status === 'active';
                        case 'pending':
                            return client.status === 'pending';
                        case 'expired':
                            return client.status === 'expired';
                        case 'verified':
                            return client.verified;
                        default:
                            return true;
                    }
                });
            }
            
            // Apply search filter
            const searchTerm = searchInput.value.toLowerCase().trim();
            filteredClients = filteredClients.filter(client => 
                client.name?.toLowerCase().includes(searchTerm) ||
                client.companyName?.toLowerCase().includes(searchTerm) ||
                client.phone?.toLowerCase().includes(searchTerm) ||
                client.email?.toLowerCase().includes(searchTerm)
            );
            
            document.getElementById('clientsGrid').style.display = 'grid';
            renderClients(filteredClients);
        });
    });
}

// Utility functions
function getStatusIcon(status) {
    switch(status) {
        case 'active':
            return 'check-circle';
        case 'pending':
            return 'clock';
        case 'expired':
            return 'times-circle';
        default:
            return 'question-circle';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'active':
            return 'نشط';
        case 'pending':
            return 'معلق';
        case 'expired':
            return 'منتهي';
        default:
            return 'غير معروف';
    }
}

function formatDate(dateString) {
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
}

function debounce(func, wait) {
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

// Client actions
function showAddClientModal() {
    // Implement add client modal
    alert('سيتم إضافة هذه الميزة قريباً');
}

function editClient(clientId) {
    // Implement edit client functionality
    alert('سيتم إضافة هذه الميزة قريباً');
}

function deleteClient(clientId) {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        clients = clients.filter(client => client.id !== clientId);
        updateStats();
        renderClients();
    }
}