// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeCharts();
    initializeInventory();
    initializeCustomers();
    initializeSuppliers();
    initializeSettings();
    initializeReports();

    // Handle navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
        });
    });
});

// Show selected page and hide others
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Update dashboard stats
function updateDashboardStats() {
    const sales = document.getElementById('salesDisplay');
    const inventory = document.getElementById('inventoryDisplay');
    const customers = document.getElementById('customersDisplay');
    
    // Get data from localStorage or API
    const savedSales = localStorage.getItem('totalSales') || 0;
    const savedInventory = JSON.parse(localStorage.getItem('inventory') || '[]').length;
    const savedCustomers = JSON.parse(localStorage.getItem('customers') || '[]').length;
    
    // Update display
    sales.textContent = savedSales + ' جنيه';
    inventory.textContent = savedInventory + ' منتج';
    customers.textContent = savedCustomers;
}
