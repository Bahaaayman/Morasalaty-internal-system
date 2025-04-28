// Sample user data (In a real application, this would come from a server)
const userData = {
    fullName: 'بهاءالدين ايمن ابراهيم',
    position: 'مسؤول دعم فني',
    email: 'bahaa.ayman@samaagroup.net',
    hiringDate: '2024/10/07',
    annualLeave: 18,
    salary: {
        basic: 6000,
        allowances: 500,
        deductions: 0
    }
};

// Sample salary data
const salaryHistory = [
    { month: 'January 2024', basic: 6000, allowances: 500, deductions: 0 },
    { month: 'February 2024', basic: 6000, allowances: 500, deductions: 0 },
    { month: 'March 2024', basic: 6000, allowances: 500, deductions: 0 }
];

// Initialize profile page
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadSalaryHistory();
    setupPasswordChange();
});

// Load user profile information
function loadUserProfile() {
    document.getElementById('profileFullName').textContent = userData.fullName;
    document.getElementById('profilePosition').textContent = userData.position;
    document.getElementById('profileEmail').textContent = userData.email;
    
    // Format and display hiring date
    const hiringDate = new Date(userData.hiringDate);
    hiringDate.setHours(hiringDate.getHours() + 3); // UTC+3
    document.getElementById('profileHiringDate').textContent = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Riyadh'
    }).format(hiringDate);
    
    document.getElementById('profileAnnualLeave').textContent = `${userData.annualLeave} days`;
}

// Load salary history
function loadSalaryHistory() {
    const tableBody = document.getElementById('salaryTableBody');
    
    tableBody.innerHTML = salaryHistory.map(salary => {
        const net = salary.basic + salary.allowances - salary.deductions;
        return `
            <tr>
                <td>${salary.month}</td>
                <td>${salary.basic.toLocaleString()} جم </td>
                <td>${salary.allowances.toLocaleString()} جم </td>
                <td>${salary.deductions.toLocaleString()} جم </td> 
                <td>${net.toLocaleString()} جم </td>
            </tr>
        `;
    }).join('');
}

// Setup password change functionality
function setupPasswordChange() {
    const form = document.getElementById('changePasswordForm');
    const message = document.getElementById('passwordMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate current password (in real app, this would be checked against server)
        if (currentPassword !== validCredentials.password) {
            showMessage('كلمة المرور الحالية غير صحيحة', 'error');
            return;
        }

        // Validate new password
        if (newPassword.length < 6) {
            showMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }

        // Validate password confirmation
        if (newPassword !== confirmPassword) {
            showMessage('كلمة المرور الجديدة غير متطابقة', 'error');
            return;
        }

        // Update password (in real app, this would be sent to server)
        validCredentials.password = newPassword;
        showMessage('تم تغيير كلمة المرور بنجاح', 'success');
        form.reset();
    });
}

// Show message helper
function showMessage(text, type) {
    const message = document.getElementById('passwordMessage');
    message.textContent = text;
    message.className = `message ${type}`;
    
    // Clear message after 3 seconds
    setTimeout(() => {
        message.textContent = '';
        message.className = 'message';
    }, 3000);
}