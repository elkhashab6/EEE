function initializeCharts() {
    // Initialize charts
    const salesChart = new Chart(document.getElementById('salesChart').getContext('2d'), {
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
            responsive: true
        }
    });
}

function updateCharts(sales) {
    // Update charts with new data
    if (salesChart) {
        salesChart.data.datasets[0].data = sales;
        salesChart.update();
    }
}
