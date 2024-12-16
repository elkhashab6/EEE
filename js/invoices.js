// Invoices Management
function initializeInvoices() {
    displayInvoices();
    updateInvoiceStats();
    setupInvoiceListeners();
}

function setupInvoiceListeners() {
    // Add item to invoice
    const addItemBtn = document.getElementById('addInvoiceItem');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', addItemToInvoice);
    }

    // Calculate totals when quantity or price changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('item-quantity') || 
            e.target.classList.contains('item-price')) {
            calculateInvoiceTotals();
        }
    });
}

function displayInvoices() {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const tbody = document.querySelector('#invoicesTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        invoices.forEach(invoice => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${invoice.number}</td>
                <td>${invoice.date}</td>
                <td>${invoice.customerName}</td>
                <td>${invoice.total.toFixed(2)}</td>
                <td>${invoice.status}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="viewInvoice(${invoice.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="editInvoice(${invoice.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteInvoice(${invoice.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-success btn-sm" onclick="printInvoice(${invoice.id})">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

function createNewInvoice() {
    const settings = JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    // Generate new invoice number
    const lastInvoice = invoices[invoices.length - 1];
    const lastNumber = lastInvoice ? parseInt(lastInvoice.number.split('-')[1]) : 0;
    const newNumber = `${settings.prefix || 'INV'}-${(lastNumber + 1).toString().padStart(4, '0')}`;
    
    const invoice = {
        id: Date.now(),
        number: newNumber,
        date: new Date().toISOString().split('T')[0],
        customerName: '',
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        status: 'draft',
        notes: ''
    };
    
    invoices.push(invoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    
    editInvoice(invoice.id);
}

function addItemToInvoice() {
    const itemsContainer = document.getElementById('invoiceItems');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>
            <select class="form-control item-select" onchange="updateItemDetails(this)">
                <option value="">اختر منتج</option>
                ${getInventoryOptionsHtml()}
            </select>
        </td>
        <td><input type="number" class="form-control item-quantity" value="1" min="1"></td>
        <td><input type="number" class="form-control item-price" value="0" step="0.01"></td>
        <td class="item-total">0</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="removeInvoiceItem(this)">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    itemsContainer.appendChild(newRow);
    calculateInvoiceTotals();
}

function getInventoryOptionsHtml() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    return inventory.map(item => 
        `<option value="${item.id}" data-price="${item.price}">${item.name}</option>`
    ).join('');
}

function updateItemDetails(select) {
    const row = select.closest('tr');
    const selectedOption = select.options[select.selectedIndex];
    const price = selectedOption.dataset.price;
    
    row.querySelector('.item-price').value = price;
    calculateInvoiceTotals();
}

function removeInvoiceItem(button) {
    button.closest('tr').remove();
    calculateInvoiceTotals();
}

function calculateInvoiceTotals() {
    const rows = document.querySelectorAll('#invoiceItems tr');
    let subtotal = 0;
    
    rows.forEach(row => {
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const total = quantity * price;
        
        row.querySelector('.item-total').textContent = total.toFixed(2);
        subtotal += total;
    });
    
    const settings = JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
    const taxRate = parseFloat(settings.tax) || 14;
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

function saveInvoice() {
    const invoiceId = document.getElementById('invoiceId').value;
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const index = invoices.findIndex(inv => inv.id === parseInt(invoiceId));
    
    const invoice = {
        id: parseInt(invoiceId),
        number: document.getElementById('invoiceNumber').value,
        date: document.getElementById('invoiceDate').value,
        customerName: document.getElementById('customerName').value,
        items: [],
        subtotal: parseFloat(document.getElementById('subtotal').textContent),
        tax: parseFloat(document.getElementById('tax').textContent),
        total: parseFloat(document.getElementById('total').textContent),
        status: document.getElementById('invoiceStatus').value,
        notes: document.getElementById('invoiceNotes').value
    };
    
    // Get items
    document.querySelectorAll('#invoiceItems tr').forEach(row => {
        const itemSelect = row.querySelector('.item-select');
        if (itemSelect.value) {
            invoice.items.push({
                id: parseInt(itemSelect.value),
                name: itemSelect.options[itemSelect.selectedIndex].text,
                quantity: parseFloat(row.querySelector('.item-quantity').value),
                price: parseFloat(row.querySelector('.item-price').value),
                total: parseFloat(row.querySelector('.item-total').textContent)
            });
        }
    });
    
    if (index !== -1) {
        invoices[index] = invoice;
    } else {
        invoices.push(invoice);
    }
    
    localStorage.setItem('invoices', JSON.stringify(invoices));
    updateInventoryQuantities(invoice.items);
    
    // Close modal and refresh display
    $('#invoiceModal').modal('hide');
    displayInvoices();
    updateInvoiceStats();
}

function updateInventoryQuantities(items) {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    items.forEach(item => {
        const inventoryItem = inventory.find(i => i.id === item.id);
        if (inventoryItem) {
            inventoryItem.quantity -= item.quantity;
        }
    });
    
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function editInvoice(id) {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const invoice = invoices.find(inv => inv.id === id);
    
    if (invoice) {
        document.getElementById('invoiceId').value = invoice.id;
        document.getElementById('invoiceNumber').value = invoice.number;
        document.getElementById('invoiceDate').value = invoice.date;
        document.getElementById('customerName').value = invoice.customerName;
        document.getElementById('invoiceStatus').value = invoice.status;
        document.getElementById('invoiceNotes').value = invoice.notes;
        
        // Clear existing items
        const itemsContainer = document.getElementById('invoiceItems');
        itemsContainer.innerHTML = '';
        
        // Add invoice items
        invoice.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <select class="form-control item-select" onchange="updateItemDetails(this)">
                        <option value="">اختر منتج</option>
                        ${getInventoryOptionsHtml()}
                    </select>
                </td>
                <td><input type="number" class="form-control item-quantity" value="${item.quantity}" min="1"></td>
                <td><input type="number" class="form-control item-price" value="${item.price}" step="0.01"></td>
                <td class="item-total">${item.total}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeInvoiceItem(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            itemsContainer.appendChild(row);
            
            // Set selected item
            const select = row.querySelector('.item-select');
            select.value = item.id;
        });
        
        calculateInvoiceTotals();
        $('#invoiceModal').modal('show');
    }
}

function deleteInvoice(id) {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
        const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        const updatedInvoices = invoices.filter(inv => inv.id !== id);
        localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
        
        displayInvoices();
        updateInvoiceStats();
    }
}

function printInvoice(id) {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const invoice = invoices.find(inv => inv.id === id);
    const settings = JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
    const company = JSON.parse(localStorage.getItem('companySettings') || '{}');
    
    if (invoice) {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(`
            <html>
            <head>
                <title>فاتورة ${invoice.number}</title>
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { font-family: Arial, sans-serif; }
                    .invoice-header { margin-bottom: 30px; }
                    .company-info { text-align: right; }
                    .invoice-details { margin-bottom: 20px; }
                    .table th { background-color: #f8f9fa; }
                </style>
            </head>
            <body>
                <div class="container mt-4">
                    <div class="invoice-header row">
                        <div class="col-6">
                            <h2>${company.name || 'اسم الشركة'}</h2>
                            <p>${company.address || ''}</p>
                            <p>هاتف: ${company.phone || ''}</p>
                            <p>بريد إلكتروني: ${company.email || ''}</p>
                        </div>
                        <div class="col-6 text-right">
                            <h1>فاتورة</h1>
                            <p>رقم: ${invoice.number}</p>
                            <p>التاريخ: ${invoice.date}</p>
                        </div>
                    </div>
                    
                    <div class="invoice-details">
                        <h4>تفاصيل العميل</h4>
                        <p>العميل: ${invoice.customerName}</p>
                    </div>
                    
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكمية</th>
                                <th>السعر</th>
                                <th>الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>${item.total.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="text-right">المجموع الفرعي</td>
                                <td>${invoice.subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="3" class="text-right">الضريبة (${settings.tax || 14}%)</td>
                                <td>${invoice.tax.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="3" class="text-right"><strong>الإجمالي</strong></td>
                                <td><strong>${invoice.total.toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <div class="mt-4">
                        <p><strong>ملاحظات:</strong></p>
                        <p>${invoice.notes || ''}</p>
                        <p>${settings.terms || ''}</p>
                    </div>
                    
                    <div class="mt-4 text-center">
                        <p>${settings.footer || ''}</p>
                    </div>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);
    }
}

function updateInvoiceStats() {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    // Calculate total sales and pending amount
    const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const pendingAmount = invoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.total, 0);
    
    // Update stats display
    document.getElementById('totalSales').textContent = totalSales.toFixed(2);
    document.getElementById('pendingAmount').textContent = pendingAmount.toFixed(2);
    document.getElementById('totalInvoices').textContent = invoices.length;
}

function searchInvoices() {
    const searchTerm = document.getElementById('searchInvoices').value.toLowerCase();
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    const filteredInvoices = invoices.filter(invoice => 
        invoice.number.toLowerCase().includes(searchTerm) ||
        invoice.customerName.toLowerCase().includes(searchTerm) ||
        invoice.date.includes(searchTerm)
    );
    
    displayFilteredInvoices(filteredInvoices);
}

function displayFilteredInvoices(filteredInvoices) {
    const tbody = document.querySelector('#invoicesTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        filteredInvoices.forEach(invoice => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${invoice.number}</td>
                <td>${invoice.date}</td>
                <td>${invoice.customerName}</td>
                <td>${invoice.total.toFixed(2)}</td>
                <td>${invoice.status}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="viewInvoice(${invoice.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="editInvoice(${invoice.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteInvoice(${invoice.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-success btn-sm" onclick="printInvoice(${invoice.id})">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}
