// Inventory Management
function initializeInventory() {
    // Load inventory data from localStorage or use sample data
    const inventory = JSON.parse(localStorage.getItem('inventory')) || sampleInventoryData;
    localStorage.setItem('inventory', JSON.stringify(inventory));
    updateInventoryTable();
}

function updateInventoryTable() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const tbody = document.querySelector('#inventoryTable tbody');
    tbody.innerHTML = '';

    inventory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
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

function saveInventoryItem() {
    const form = document.getElementById('inventoryForm');
    const itemData = {
        id: parseInt(form.querySelector('#itemId').value) || Date.now(),
        code: form.querySelector('#itemCode').value,
        name: form.querySelector('#itemName').value,
        category: form.querySelector('#itemCategory').value,
        quantity: parseInt(form.querySelector('#itemQuantity').value),
        price: parseFloat(form.querySelector('#itemPrice').value),
        reorderPoint: parseInt(form.querySelector('#reorderPoint').value)
    };

    let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const index = inventory.findIndex(item => item.id === itemData.id);
    
    if (index > -1) {
        inventory[index] = itemData;
    } else {
        inventory.push(itemData);
    }

    localStorage.setItem('inventory', JSON.stringify(inventory));
    updateInventoryTable();
    $('#addInventoryModal').modal('hide');
}
