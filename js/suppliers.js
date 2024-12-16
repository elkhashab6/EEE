// Suppliers Management
function initializeSuppliers() {
    displaySuppliers();
    updateSupplierStats();
}

function displaySuppliers() {
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const tbody = document.querySelector('#suppliersTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.email}</td>
                <td>${supplier.products}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editSupplier(${supplier.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${supplier.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}
