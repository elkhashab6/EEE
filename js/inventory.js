// Inventory Management System
function initializeInventory() {
    displayInventory();
    updateInventoryStats();
    checkLowStock();
}

// Display inventory items in table
function displayInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const tbody = document.querySelector('#inventoryTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        inventory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>${item.costPrice.toFixed(2)}</td>
                <td>${item.sellingPrice.toFixed(2)}</td>
                <td>${(item.sellingPrice - item.costPrice).toFixed(2)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editInventoryItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteInventoryItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-info btn-sm" onclick="viewItemHistory(${item.id})">
                        <i class="fas fa-history"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Add new inventory item
function addInventoryItem() {
    const item = {
        id: Date.now(),
        code: document.getElementById('itemCode').value,
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        quantity: parseFloat(document.getElementById('itemQuantity').value) || 0,
        unit: document.getElementById('itemUnit').value,
        costPrice: parseFloat(document.getElementById('itemCostPrice').value) || 0,
        sellingPrice: parseFloat(document.getElementById('itemSellingPrice').value) || 0,
        minQuantity: parseFloat(document.getElementById('itemMinQuantity').value) || 0,
        history: []
    };
    
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    inventory.push(item);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    displayInventory();
    updateInventoryStats();
    checkLowStock();
    
    // Clear form
    document.getElementById('inventoryForm').reset();
    
    // Close modal
    $('#addInventoryModal').modal('hide');
}

// Edit inventory item
function editInventoryItem(id) {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const item = inventory.find(i => i.id === id);
    
    if (item) {
        document.getElementById('editItemId').value = item.id;
        document.getElementById('editItemCode').value = item.code;
        document.getElementById('editItemName').value = item.name;
        document.getElementById('editItemCategory').value = item.category;
        document.getElementById('editItemQuantity').value = item.quantity;
        document.getElementById('editItemUnit').value = item.unit;
        document.getElementById('editItemCostPrice').value = item.costPrice;
        document.getElementById('editItemSellingPrice').value = item.sellingPrice;
        document.getElementById('editItemMinQuantity').value = item.minQuantity;
        
        $('#editInventoryModal').modal('show');
    }
}

// Update inventory item
function updateInventoryItem() {
    const id = parseInt(document.getElementById('editItemId').value);
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const index = inventory.findIndex(i => i.id === id);
    
    if (index !== -1) {
        inventory[index] = {
            ...inventory[index],
            code: document.getElementById('editItemCode').value,
            name: document.getElementById('editItemName').value,
            category: document.getElementById('editItemCategory').value,
            quantity: parseFloat(document.getElementById('editItemQuantity').value) || 0,
            unit: document.getElementById('editItemUnit').value,
            costPrice: parseFloat(document.getElementById('editItemCostPrice').value) || 0,
            sellingPrice: parseFloat(document.getElementById('editItemSellingPrice').value) || 0,
            minQuantity: parseFloat(document.getElementById('editItemMinQuantity').value) || 0
        };
        
        localStorage.setItem('inventory', JSON.stringify(inventory));
        displayInventory();
        updateInventoryStats();
        checkLowStock();
        
        // Close modal
        $('#editInventoryModal').modal('hide');
    }
}

// Delete inventory item
function deleteInventoryItem(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const updatedInventory = inventory.filter(i => i.id !== id);
        localStorage.setItem('inventory', JSON.stringify(updatedInventory));
        
        displayInventory();
        updateInventoryStats();
        checkLowStock();
    }
}

// View item history
function viewItemHistory(id) {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const item = inventory.find(i => i.id === id);
    
    if (item) {
        const historyContainer = document.getElementById('itemHistory');
        historyContainer.innerHTML = `
            <h4>سجل حركة ${item.name}</h4>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>التاريخ</th>
                        <th>نوع الحركة</th>
                        <th>الكمية</th>
                        <th>رقم المستند</th>
                    </tr>
                </thead>
                <tbody>
                    ${item.history.map(entry => `
                        <tr>
                            <td>${entry.date}</td>
                            <td>${entry.type}</td>
                            <td>${entry.quantity}</td>
                            <td>${entry.documentNumber}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        $('#itemHistoryModal').modal('show');
    }
}

// Update inventory statistics
function updateInventoryStats() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    // Calculate total items and value
    const totalItems = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
    const totalRetailValue = inventory.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
    
    // Update stats display
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalValue').textContent = totalValue.toFixed(2);
    document.getElementById('totalRetailValue').textContent = totalRetailValue.toFixed(2);
    document.getElementById('potentialProfit').textContent = (totalRetailValue - totalValue).toFixed(2);
}

// Check for low stock items
function checkLowStock() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);
    
    const lowStockContainer = document.getElementById('lowStockAlerts');
    if (lowStockContainer) {
        lowStockContainer.innerHTML = '';
        if (lowStockItems.length > 0) {
            lowStockItems.forEach(item => {
                const alert = document.createElement('div');
                alert.className = 'alert alert-warning';
                alert.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    المنتج ${item.name} منخفض المخزون (${item.quantity} ${item.unit})
                `;
                lowStockContainer.appendChild(alert);
            });
        }
    }
    
    // Update badge count
    const lowStockBadge = document.getElementById('lowStockBadge');
    if (lowStockBadge) {
        lowStockBadge.textContent = lowStockItems.length;
        lowStockBadge.style.display = lowStockItems.length > 0 ? 'inline' : 'none';
    }
}

// Search inventory
function searchInventory() {
    const searchTerm = document.getElementById('searchInventory').value.toLowerCase();
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    const filteredInventory = inventory.filter(item => 
        item.code.toLowerCase().includes(searchTerm) ||
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredInventory(filteredInventory);
}

// Display filtered inventory items
function displayFilteredInventory(filteredInventory) {
    const tbody = document.querySelector('#inventoryTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        filteredInventory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>${item.costPrice.toFixed(2)}</td>
                <td>${item.sellingPrice.toFixed(2)}</td>
                <td>${(item.sellingPrice - item.costPrice).toFixed(2)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editInventoryItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteInventoryItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-info btn-sm" onclick="viewItemHistory(${item.id})">
                        <i class="fas fa-history"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Update inventory when invoice is created
function updateInventoryQuantity(items) {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const date = new Date().toISOString().split('T')[0];
    
    items.forEach(invoiceItem => {
        const itemIndex = inventory.findIndex(i => i.code === invoiceItem.code);
        if (itemIndex !== -1) {
            // Update quantity
            inventory[itemIndex].quantity -= invoiceItem.quantity;
            
            // Add to history
            inventory[itemIndex].history.push({
                date: date,
                type: 'مبيعات',
                quantity: -invoiceItem.quantity,
                documentNumber: invoiceItem.invoiceNumber
            });
        }
    });
    
    localStorage.setItem('inventory', JSON.stringify(inventory));
    displayInventory();
    updateInventoryStats();
    checkLowStock();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeInventory);
