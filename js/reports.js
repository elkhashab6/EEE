// Reports Management System
function initializeReports() {
    setupReportFilters();
    generateSalesReport();
    generateInventoryReport();
    generateCustomerReport();
}

// Setup report date filters
function setupReportFilters() {
    // Set default date range to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    document.getElementById('startDate').value = firstDay.toISOString().split('T')[0];
    document.getElementById('endDate').value = lastDay.toISOString().split('T')[0];
}

// Generate sales report
function generateSalesReport() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    // Filter invoices by date range
    const filteredInvoices = invoices.filter(invoice => 
        invoice.date >= startDate && invoice.date <= endDate
    );
    
    // Calculate totals
    const totalSales = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const totalTax = filteredInvoices.reduce((sum, invoice) => sum + invoice.tax, 0);
    const totalDiscount = filteredInvoices.reduce((sum, invoice) => sum + invoice.discount, 0);
    
    // Group sales by product
    const salesByProduct = {};
    filteredInvoices.forEach(invoice => {
        invoice.items.forEach(item => {
            if (!salesByProduct[item.code]) {
                salesByProduct[item.code] = {
                    name: item.name,
                    quantity: 0,
                    total: 0
                };
            }
            salesByProduct[item.code].quantity += item.quantity;
            salesByProduct[item.code].total += item.total;
        });
    });
    
    // Display sales summary
    document.getElementById('totalSales').textContent = totalSales.toFixed(2);
    document.getElementById('totalTax').textContent = totalTax.toFixed(2);
    document.getElementById('totalDiscount').textContent = totalDiscount.toFixed(2);
    document.getElementById('netSales').textContent = (totalSales - totalDiscount).toFixed(2);
    
    // Display sales by product
    const salesTable = document.getElementById('salesByProduct');
    if (salesTable) {
        salesTable.innerHTML = '';
        Object.entries(salesByProduct).forEach(([code, data]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${code}</td>
                <td>${data.name}</td>
                <td>${data.quantity}</td>
                <td>${data.total.toFixed(2)}</td>
                <td>${(data.total / totalSales * 100).toFixed(1)}%</td>
            `;
            salesTable.appendChild(row);
        });
    }
}

// Generate inventory report
function generateInventoryReport() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    // Calculate inventory values
    const totalItems = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
    const totalRetailValue = inventory.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
    const potentialProfit = totalRetailValue - totalValue;
    
    // Group by category
    const categoryGroups = {};
    inventory.forEach(item => {
        if (!categoryGroups[item.category]) {
            categoryGroups[item.category] = {
                count: 0,
                value: 0,
                retailValue: 0
            };
        }
        categoryGroups[item.category].count++;
        categoryGroups[item.category].value += item.quantity * item.costPrice;
        categoryGroups[item.category].retailValue += item.quantity * item.sellingPrice;
    });
    
    // Display inventory summary
    document.getElementById('totalInventoryItems').textContent = totalItems;
    document.getElementById('totalInventoryValue').textContent = totalValue.toFixed(2);
    document.getElementById('totalInventoryRetail').textContent = totalRetailValue.toFixed(2);
    document.getElementById('potentialInventoryProfit').textContent = potentialProfit.toFixed(2);
    
    // Display category breakdown
    const categoryTable = document.getElementById('inventoryByCategory');
    if (categoryTable) {
        categoryTable.innerHTML = '';
        Object.entries(categoryGroups).forEach(([category, data]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category}</td>
                <td>${data.count}</td>
                <td>${data.value.toFixed(2)}</td>
                <td>${data.retailValue.toFixed(2)}</td>
                <td>${(data.retailValue - data.value).toFixed(2)}</td>
            `;
            categoryTable.appendChild(row);
        });
    }
    
    // Display low stock items
    const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);
    const lowStockTable = document.getElementById('lowStockItems');
    if (lowStockTable) {
        lowStockTable.innerHTML = '';
        lowStockItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.minQuantity}</td>
                <td>${item.unit}</td>
            `;
            lowStockTable.appendChild(row);
        });
    }
}

// Generate customer report
function generateCustomerReport() {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    // Calculate customer statistics
    const totalCustomers = customers.length;
    const totalSales = customers.reduce((sum, customer) => sum + customer.totalPurchases, 0);
    const averageSales = totalSales / totalCustomers || 0;
    
    // Sort customers by total purchases
    const sortedCustomers = [...customers].sort((a, b) => b.totalPurchases - a.totalPurchases);
    const topCustomers = sortedCustomers.slice(0, 10);
    
    // Display customer summary
    document.getElementById('totalCustomersCount').textContent = totalCustomers;
    document.getElementById('totalCustomerSales').textContent = totalSales.toFixed(2);
    document.getElementById('averageCustomerSales').textContent = averageSales.toFixed(2);
    
    // Display top customers
    const topCustomersTable = document.getElementById('topCustomers');
    if (topCustomersTable) {
        topCustomersTable.innerHTML = '';
        topCustomers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.totalPurchases.toFixed(2)}</td>
                <td>${(customer.totalPurchases / totalSales * 100).toFixed(1)}%</td>
            `;
            topCustomersTable.appendChild(row);
        });
    }
}

// Export report to Excel
function exportToExcel(tableId, filename) {
    const table = document.getElementById(tableId);
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

// Print report
function printReport(reportId) {
    const reportElement = document.getElementById(reportId);
    const printWindow = window.open('', '', 'height=600,width=800');
    
    printWindow.document.write('<html><head><title>تقرير</title>');
    printWindow.document.write('<link rel="stylesheet" href="css/bootstrap.min.css">');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(reportElement.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 1000);
}

// Update reports when date range changes
document.getElementById('startDate').addEventListener('change', () => {
    generateSalesReport();
});

document.getElementById('endDate').addEventListener('change', () => {
    generateSalesReport();
});

// Initialize reports on page load
document.addEventListener('DOMContentLoaded', initializeReports);
