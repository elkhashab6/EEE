// Customers Management
function initializeCustomers() {
    displayCustomers();
    updateCustomerStats();
}

function displayCustomers() {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const tbody = document.querySelector('#customersTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.email}</td>
                <td>${customer.address}</td>
                <td>${customer.totalPurchases.toFixed(2)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${customer.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-info btn-sm" onclick="viewCustomerHistory(${customer.id})">
                        <i class="fas fa-history"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

function addCustomer() {
    const customer = {
        id: Date.now(),
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        address: document.getElementById('customerAddress').value,
        totalPurchases: 0,
        history: []
    };
    
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    customers.push(customer);
    localStorage.setItem('customers', JSON.stringify(customers));
    
    displayCustomers();
    updateCustomerStats();
    
    // Clear form
    document.getElementById('customerForm').reset();
    
    // Close modal
    $('#addCustomerModal').modal('hide');
}

function editCustomer(id) {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customer = customers.find(c => c.id === id);
    
    if (customer) {
        document.getElementById('editCustomerId').value = customer.id;
        document.getElementById('editCustomerName').value = customer.name;
        document.getElementById('editCustomerPhone').value = customer.phone;
        document.getElementById('editCustomerEmail').value = customer.email;
        document.getElementById('editCustomerAddress').value = customer.address;
        
        $('#editCustomerModal').modal('show');
    }
}

function updateCustomer() {
    const id = parseInt(document.getElementById('editCustomerId').value);
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const index = customers.findIndex(c => c.id === id);
    
    if (index !== -1) {
        customers[index] = {
            ...customers[index],
            name: document.getElementById('editCustomerName').value,
            phone: document.getElementById('editCustomerPhone').value,
            email: document.getElementById('editCustomerEmail').value,
            address: document.getElementById('editCustomerAddress').value
        };
        
        localStorage.setItem('customers', JSON.stringify(customers));
        displayCustomers();
        updateCustomerStats();
        
        // Close modal
        $('#editCustomerModal').modal('hide');
    }
}

function deleteCustomer(id) {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        const updatedCustomers = customers.filter(c => c.id !== id);
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
        
        displayCustomers();
        updateCustomerStats();
    }
}

function viewCustomerHistory(id) {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customer = customers.find(c => c.id === id);
    
    if (customer) {
        const historyContainer = document.getElementById('customerHistory');
        historyContainer.innerHTML = `
            <h4>سجل مشتريات ${customer.name}</h4>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>التاريخ</th>
                        <th>رقم الفاتورة</th>
                        <th>المبلغ</th>
                    </tr>
                </thead>
                <tbody>
                    ${customer.history.map(item => `
                        <tr>
                            <td>${item.date}</td>
                            <td>${item.invoiceNumber}</td>
                            <td>${item.amount.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2"><strong>إجمالي المشتريات</strong></td>
                        <td><strong>${customer.totalPurchases.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
        `;
        
        $('#customerHistoryModal').modal('show');
    }
}

function updateCustomerStats() {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    // Calculate total customers and total sales
    const totalCustomers = customers.length;
    const totalSales = customers.reduce((sum, customer) => sum + customer.totalPurchases, 0);
    
    // Find top customer
    const topCustomer = customers.reduce((prev, current) => 
        (prev.totalPurchases > current.totalPurchases) ? prev : current
    , { totalPurchases: 0 });
    
    // Update stats display
    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('totalCustomerSales').textContent = totalSales.toFixed(2);
    if (topCustomer.name) {
        document.getElementById('topCustomer').textContent = `${topCustomer.name} (${topCustomer.totalPurchases.toFixed(2)})`;
    }
}

function searchCustomers() {
    const searchTerm = document.getElementById('searchCustomers').value.toLowerCase();
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredCustomers(filteredCustomers);
}

function displayFilteredCustomers(filteredCustomers) {
    const tbody = document.querySelector('#customersTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        filteredCustomers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.email}</td>
                <td>${customer.address}</td>
                <td>${customer.totalPurchases.toFixed(2)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${customer.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-info btn-sm" onclick="viewCustomerHistory(${customer.id})">
                        <i class="fas fa-history"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Update customer purchase history when an invoice is created
function updateCustomerPurchaseHistory(invoice) {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customerIndex = customers.findIndex(c => c.name === invoice.customerName);
    
    if (customerIndex !== -1) {
        const historyItem = {
            date: invoice.date,
            invoiceNumber: invoice.number,
            amount: invoice.total
        };
        
        customers[customerIndex].history.push(historyItem);
        customers[customerIndex].totalPurchases += invoice.total;
        
        localStorage.setItem('customers', JSON.stringify(customers));
        updateCustomerStats();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeCustomers);
