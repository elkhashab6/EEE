// Reports Management
function initializeReports() {
    initializeReportCharts();
    setupReportFilters();
}

function initializeReportCharts() {
    // Sales Report Chart
    const salesCtx = document.getElementById('salesReportChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'المبيعات',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: '#3498db',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Inventory Report Chart
    const inventoryCtx = document.getElementById('inventoryReportChart');
    if (inventoryCtx) {
        new Chart(inventoryCtx, {
            type: 'bar',
            data: {
                labels: ['منتج 1', 'منتج 2', 'منتج 3', 'منتج 4', 'منتج 5'],
                datasets: [{
                    label: 'المخزون',
                    data: [25, 15, 35, 10, 20],
                    backgroundColor: '#2ecc71'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Get report data based on type and date range
    const reportData = generateSampleReportData(startDate, endDate);
    
    // Display report data
    displayReportData(reportData, reportType);
}

function displayReportData(data, type) {
    const reportContainer = document.getElementById('reportData');
    if (!reportContainer) return;

    let html = '<div class="table-responsive"><table class="table table-striped">';
    
    switch(type) {
        case 'sales':
            html += `
                <thead>
                    <tr>
                        <th>التاريخ</th>
                        <th>رقم الفاتورة</th>
                        <th>العميل</th>
                        <th>المبلغ</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr>
                            <td>${item.date}</td>
                            <td>${item.invoiceNumber}</td>
                            <td>${item.customer}</td>
                            <td>${item.amount}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            break;
            
        case 'inventory':
            html += `
                <thead>
                    <tr>
                        <th>المنتج</th>
                        <th>الكمية</th>
                        <th>السعر</th>
                        <th>القيمة الإجمالية</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr>
                            <td>${item.product}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price}</td>
                            <td>${item.total}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            break;
    }
    
    html += '</table></div>';
    reportContainer.innerHTML = html;
}

function exportReport() {
    // In a real application, this would generate a PDF or Excel file
    alert('جاري تصدير التقرير...');
}
