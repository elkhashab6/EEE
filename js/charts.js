// Charts Management
function initializeCharts() {
    initializeSalesChart();
    initializeInventoryChart();
    initializeCustomerChart();
    initializeExpensesChart();
}

function initializeSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    const salesData = getSalesData();
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.labels,
            datasets: [{
                label: 'المبيعات',
                data: salesData.values,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'تقرير المبيعات'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' جنيه';
                        }
                    }
                }
            }
        }
    });
}

function initializeInventoryChart() {
    const ctx = document.getElementById('inventoryChart');
    if (!ctx) return;

    const inventoryData = getInventoryData();
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: inventoryData.labels,
            datasets: [{
                label: 'المخزون',
                data: inventoryData.values,
                backgroundColor: '#2ecc71',
                borderColor: '#27ae60',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'حالة المخزون'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initializeCustomerChart() {
    const ctx = document.getElementById('customerChart');
    if (!ctx) return;

    const customerData = getCustomerData();
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: customerData.labels,
            datasets: [{
                data: customerData.values,
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f1c40f',
                    '#9b59b6'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'توزيع العملاء'
                }
            }
        }
    });
}

function initializeExpensesChart() {
    const ctx = document.getElementById('expensesChart');
    if (!ctx) return;

    const expensesData = getExpensesData();
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: expensesData.labels,
            datasets: [{
                data: expensesData.values,
                backgroundColor: [
                    '#e74c3c',
                    '#f1c40f',
                    '#2ecc71',
                    '#3498db',
                    '#9b59b6'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'توزيع المصروفات'
                }
            }
        }
    });
}

// Data Functions
function getSalesData() {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const last6Months = getLast6Months();
    
    const monthlyTotals = last6Months.map(month => {
        return invoices
            .filter(inv => inv.date.startsWith(month))
            .reduce((sum, inv) => sum + inv.total, 0);
    });
    
    return {
        labels: last6Months.map(formatMonthLabel),
        values: monthlyTotals
    };
}

function getInventoryData() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const topItems = inventory
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
    
    return {
        labels: topItems.map(item => item.name),
        values: topItems.map(item => item.quantity)
    };
}

function getCustomerData() {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const customerTotals = {};
    
    invoices.forEach(inv => {
        if (!customerTotals[inv.customerName]) {
            customerTotals[inv.customerName] = 0;
        }
        customerTotals[inv.customerName] += inv.total;
    });
    
    const topCustomers = Object.entries(customerTotals)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    return {
        labels: topCustomers.map(([name]) => name),
        values: topCustomers.map(([,total]) => total)
    };
}

function getExpensesData() {
    // Sample expenses data - replace with actual data when implemented
    return {
        labels: ['مشتريات', 'رواتب', 'إيجار', 'مرافق', 'أخرى'],
        values: [5000, 3000, 2000, 1000, 500]
    };
}

// Utility Functions
function getLast6Months() {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push(d.toISOString().slice(0, 7));
    }
    
    return months;
}

function formatMonthLabel(yearMonth) {
    const [year, month] = yearMonth.split('-');
    const months = [
        'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return months[parseInt(month) - 1];
}

// Update Charts
function updateCharts() {
    initializeCharts();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeCharts);
