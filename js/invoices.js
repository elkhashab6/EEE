// Invoice related functions
function addInvoiceItem() {
    const tbody = document.querySelector('#invoiceItems tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>
            <input type="text" class="form-control" placeholder="اسم المنتج">
        </td>
        <td>
            <input type="number" class="form-control quantity" value="1" min="1">
        </td>
        <td>
            <input type="number" class="form-control price" value="0">
        </td>
        <td>
            <input type="number" class="form-control total" readonly>
        </td>
        <td>
            <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('tr').remove(); updateTotal();">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    tbody.appendChild(newRow);
}

function updateTotal(input) {
    if (input) {
        const row = input.closest('tr');
        const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        row.querySelector('.total').value = (quantity * price).toFixed(2);
    }
    
    let total = 0;
    document.querySelectorAll('#invoiceItems .total').forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    document.getElementById('invoiceTotal').textContent = total.toFixed(2);
}

function saveInvoice() {
    // Get invoice data
    const invoiceData = {
        number: document.getElementById('invoiceNumber').value,
        date: document.getElementById('invoiceDate').value,
        customer: document.getElementById('customerName').value,
        items: [],
        total: document.getElementById('invoiceTotal').textContent
    };

    // Get items
    document.querySelectorAll('#invoiceItems tbody tr').forEach(row => {
        invoiceData.items.push({
            name: row.querySelector('td:first-child input').value,
            quantity: row.querySelector('.quantity').value,
            price: row.querySelector('.price').value,
            total: row.querySelector('.total').value
        });
    });

    // Save to localStorage
    let savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    savedInvoices.push(invoiceData);
    localStorage.setItem('invoices', JSON.stringify(savedInvoices));

    // Update display
    displaySavedInvoices();
    
    // Clear form
    document.getElementById('invoiceForm').reset();
    document.querySelector('#invoiceItems tbody').innerHTML = '';
    document.getElementById('invoiceTotal').textContent = '0.00';
}
