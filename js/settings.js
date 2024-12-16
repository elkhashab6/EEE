// Settings Management
function initializeSettings() {
    loadSavedSettings();
    setupSettingsListeners();
}

function setupSettingsListeners() {
    // Company Settings Form
    const companyForm = document.getElementById('companySettingsForm');
    if (companyForm) {
        companyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const settings = {
                name: document.getElementById('companyName').value,
                address: document.getElementById('companyAddress').value,
                phone: document.getElementById('companyPhone').value,
                email: document.getElementById('companyEmail').value,
                tax: document.getElementById('taxNumber').value
            };
            saveSettings('company', settings);
            showAlert('success', 'تم حفظ إعدادات الشركة بنجاح');
        });
    }

    // Invoice Settings Form
    const invoiceForm = document.getElementById('invoiceSettingsForm');
    if (invoiceForm) {
        invoiceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const settings = {
                prefix: document.getElementById('invoicePrefix').value,
                terms: document.getElementById('invoiceTerms').value,
                footer: document.getElementById('invoiceFooter').value,
                tax: document.getElementById('taxRate').value
            };
            saveSettings('invoice', settings);
            showAlert('success', 'تم حفظ إعدادات الفواتير بنجاح');
        });
    }
}

function loadSavedSettings() {
    // Load Company Settings
    const companySettings = JSON.parse(localStorage.getItem('companySettings') || '{}');
    if (document.getElementById('companyName')) {
        document.getElementById('companyName').value = companySettings.name || '';
        document.getElementById('companyAddress').value = companySettings.address || '';
        document.getElementById('companyPhone').value = companySettings.phone || '';
        document.getElementById('companyEmail').value = companySettings.email || '';
        document.getElementById('taxNumber').value = companySettings.tax || '';
    }

    // Load Invoice Settings
    const invoiceSettings = JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
    if (document.getElementById('invoicePrefix')) {
        document.getElementById('invoicePrefix').value = invoiceSettings.prefix || 'INV-';
        document.getElementById('invoiceTerms').value = invoiceSettings.terms || '';
        document.getElementById('invoiceFooter').value = invoiceSettings.footer || '';
        document.getElementById('taxRate').value = invoiceSettings.tax || '14';
    }
}

function saveSettings(type, settings) {
    localStorage.setItem(type + 'Settings', JSON.stringify(settings));
}

function createBackup() {
    const backup = {
        company: JSON.parse(localStorage.getItem('companySettings') || '{}'),
        invoice: JSON.parse(localStorage.getItem('invoiceSettings') || '{}'),
        inventory: JSON.parse(localStorage.getItem('inventory') || '[]'),
        customers: JSON.parse(localStorage.getItem('customers') || '[]'),
        suppliers: JSON.parse(localStorage.getItem('suppliers') || '[]'),
        invoices: JSON.parse(localStorage.getItem('invoices') || '[]')
    };

    const dataStr = JSON.stringify(backup);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'backup-' + new Date().toISOString().slice(0,10) + '.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function restoreBackup() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const backup = JSON.parse(e.target.result);
                
                // Restore all settings
                localStorage.setItem('companySettings', JSON.stringify(backup.company));
                localStorage.setItem('invoiceSettings', JSON.stringify(backup.invoice));
                localStorage.setItem('inventory', JSON.stringify(backup.inventory));
                localStorage.setItem('customers', JSON.stringify(backup.customers));
                localStorage.setItem('suppliers', JSON.stringify(backup.suppliers));
                localStorage.setItem('invoices', JSON.stringify(backup.invoices));

                showAlert('success', 'تم استعادة النسخة الاحتياطية بنجاح');
                
                // Reload page to reflect changes
                setTimeout(() => location.reload(), 1500);
            } catch (error) {
                showAlert('danger', 'حدث خطأ أثناء استعادة النسخة الاحتياطية');
            }
        };
        
        reader.readAsText(file);
    };
    
    fileInput.click();
}
