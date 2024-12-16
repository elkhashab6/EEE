// Inventory Management
function initializeInventory() {
    displayInventory();
    updateInventoryStats();
}

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
                <td>${item.price}</td>
                <td>${item.quantity * item.price}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editInventoryItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteInventoryItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

function addInventoryItem() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const newItem = {
        id: Date.now(),
        code: document.getElementById('itemCode').value,
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        quantity: parseInt(document.getElementById('itemQuantity').value),
        price: parseFloat(document.getElementById('itemPrice').value)
    };
    
    inventory.push(newItem);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    displayInventory();
    updateInventoryStats();
    
    // Clear form
    document.getElementById('inventoryForm').reset();
    
    // Close modal if using Bootstrap modal
    $('#addInventoryModal').modal('hide');
}

function editInventoryItem(id) {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const item = inventory.find(i => i.id === id);
    
    if (item) {
        document.getElementById('editItemId').value = item.id;
        document.getElementById('editItemCode').value = item.code;
        document.getElementById('editItemName').value = item.name;
        document.getElementById('editItemCategory').value = item.category;
        document.getElementById('editItemQuantity').value = item.quantity;
        document.getElementById('editItemPrice').value = item.price;
        
        // Show edit modal
        $('#editInventoryModal').modal('show');
    }
}

function updateInventoryItem() {
    const id = parseInt(document.getElementById('editItemId').value);
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const index = inventory.findIndex(i => i.id === id);
    
    if (index !== -1) {
        inventory[index] = {
            id: id,
            code: document.getElementById('editItemCode').value,
            name: document.getElementById('editItemName').value,
            category: document.getElementById('editItemCategory').value,
            quantity: parseInt(document.getElementById('editItemQuantity').value),
            price: parseFloat(document.getElementById('editItemPrice').value)
        };
        
        localStorage.setItem('inventory', JSON.stringify(inventory));
        displayInventory();
        updateInventoryStats();
        
        // Close modal
        $('#editInventoryModal').modal('hide');
    }
}

function deleteInventoryItem(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const updatedInventory = inventory.filter(i => i.id !== id);
        localStorage.setItem('inventory', JSON.stringify(updatedInventory));
        
        displayInventory();
        updateInventoryStats();
    }
}

function updateInventoryStats() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    // Calculate total items and value
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    // Update stats display
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalValue').textContent = totalValue.toFixed(2);
    
    // Update low stock items
    const lowStockItems = inventory.filter(item => item.quantity <= 5).length;
    document.getElementById('lowStockItems').textContent = lowStockItems;
}

function searchInventory() {
    const searchTerm = document.getElementById('searchInventory').value.toLowerCase();
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    const filteredInventory = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.code.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredInventory(filteredInventory);
}

function displayFilteredInventory(filteredItems) {
    const tbody = document.querySelector('#inventoryTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        filteredItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.quantity * item.price}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editInventoryItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteInventoryItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}
