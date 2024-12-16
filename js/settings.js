// Settings Management System
function initializeSettings() {
    loadCompanySettings();
    loadInvoiceSettings();
    setupBackupRestore();
}

// Load company settings
function loadCompanySettings() {
    const settings = JSON.parse(localStorage.getItem('companySettings') || '{}');
    
    document.getElementById('companyName').value = settings.name || '';
    document.getElementById('companyAddress').value = settings.address || '';
    document.getElementById('companyPhone').value = settings.phone || '';
    document.getElementById('companyEmail').value = settings.email || '';
    document.getElementById('companyWebsite').value = settings.website || '';
    document.getElementById('companyTaxNumber').value = settings.taxNumber || '';
    document.getElementById('companyLogo').value = settings.logo || '';
}

// Save company settings
function saveCompanySettings() {
    const settings = {
        name: document.getElementById('companyName').value,
        address: document.getElementById('companyAddress').value,
        phone: document.getElementById('companyPhone').value,
        email: document.getElementById('companyEmail').value,
        website: document.getElementById('companyWebsite').value,
        taxNumber: document.getElementById('companyTaxNumber').value,
        logo: document.getElementById('companyLogo').value
    };
    
    localStorage.setItem('companySettings', JSON.stringify(settings));
    showAlert('success', 'تم حفظ إعدادات الشركة بنجاح');
}

// Load invoice settings
function loadInvoiceSettings() {
    const settings = JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
    
    document.getElementById('invoicePrefix').value = settings.prefix || 'INV';
    document.getElementById('nextInvoiceNumber').value = settings.nextNumber || '1';
    document.getElementById('defaultTaxRate').value = settings.taxRate || '15';
    document.getElementById('invoiceNotes').value = settings.notes || '';
    document.getElementById('invoiceTerms').value = settings.terms || '';
    document.getElementById('invoiceDueDays').value = settings.dueDays || '30';
    document.getElementById('currencySymbol').value = settings.currency || 'ر.س';
}

// Save invoice settings
function saveInvoiceSettings() {
    const settings = {
        prefix: document.getElementById('invoicePrefix').value,
        nextNumber: document.getElementById('nextInvoiceNumber').value,
        taxRate: document.getElementById('defaultTaxRate').value,
        notes: document.getElementById('invoiceNotes').value,
        terms: document.getElementById('invoiceTerms').value,
        dueDays: document.getElementById('invoiceDueDays').value,
        currency: document.getElementById('currencySymbol').value
    };
    
    localStorage.setItem('invoiceSettings', JSON.stringify(settings));
    showAlert('success', 'تم حفظ إعدادات الفواتير بنجاح');
}

// Setup backup and restore functionality
function setupBackupRestore() {
    // Setup backup button
    document.getElementById('backupButton').addEventListener('click', backupData);
    
    // Setup restore file input
    document.getElementById('restoreFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            restoreData(file);
        }
    });
}

// Backup all data
function backupData() {
    const backup = {
        timestamp: new Date().toISOString(),
        companySettings: JSON.parse(localStorage.getItem('companySettings') || '{}'),
        invoiceSettings: JSON.parse(localStorage.getItem('invoiceSettings') || '{}'),
        inventory: JSON.parse(localStorage.getItem('inventory') || '[]'),
        customers: JSON.parse(localStorage.getItem('customers') || '[]'),
        invoices: JSON.parse(localStorage.getItem('invoices') || '[]')
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('success', 'تم إنشاء نسخة احتياطية بنجاح');
}

// Restore data from backup file
function restoreData(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            // Validate backup data
            if (!backup.timestamp || !backup.companySettings || !backup.invoiceSettings) {
                throw new Error('ملف النسخة الاحتياطية غير صالح');
            }
            
            // Restore all data
            localStorage.setItem('companySettings', JSON.stringify(backup.companySettings));
            localStorage.setItem('invoiceSettings', JSON.stringify(backup.invoiceSettings));
            localStorage.setItem('inventory', JSON.stringify(backup.inventory));
            localStorage.setItem('customers', JSON.stringify(backup.customers));
            localStorage.setItem('invoices', JSON.stringify(backup.invoices));
            
            // Reload settings
            loadCompanySettings();
            loadInvoiceSettings();
            
            showAlert('success', 'تم استعادة البيانات بنجاح');
            
            // Reload page to refresh all data
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
        } catch (error) {
            showAlert('error', 'خطأ في استعادة البيانات: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

// Show alert message
function showAlert(type, message) {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertContainer.appendChild(alert);
        
        // Auto remove alert after 3 seconds
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

// Get next invoice number
function getNextInvoiceNumber() {
    const settings = JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
    const prefix = settings.prefix || 'INV';
    const nextNumber = parseInt(settings.nextNumber || '1');
    
    // Update next number
    settings.nextNumber = (nextNumber + 1).toString();
    localStorage.setItem('invoiceSettings', JSON.stringify(settings));
    
    // Format number with leading zeros
    const formattedNumber = nextNumber.toString().padStart(5, '0');
    return `${prefix}-${formattedNumber}`;
}

// Get company settings
function getCompanySettings() {
    return JSON.parse(localStorage.getItem('companySettings') || '{}');
}

// Get invoice settings
function getInvoiceSettings() {
    return JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
}

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', initializeSettings);
