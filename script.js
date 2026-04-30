// Global State
let items = [];
let nextId = 1;

// Colors for visualization
const colors = [
    '#000000', '#1a1a1a', '#333333', '#4d4d4d', 
    '#666666', '#808080', '#999999', '#b3b3b3'
];

// DOM Elements
const itemForm = document.getElementById('item-form');
const itemsList = document.getElementById('items-list');
const optimizeBtn = document.getElementById('optimize-btn');
const resultsSection = document.getElementById('results');
const loadingSection = document.getElementById('loading');

// Event Listeners
itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('item-name');
    const weightInput = document.getElementById('item-weight');
    const valueInput = document.getElementById('item-value');
    
    const newItem = {
        id: nextId++,
        name: nameInput.value,
        weight: parseFloat(weightInput.value),
        value: parseFloat(valueInput.value),
        color: colors[(nextId - 2) % colors.length]
    };
    
    items.push(newItem);
    renderItemsList();
    
    // Reset form
    nameInput.value = '';
    weightInput.value = '';
    valueInput.value = '';
    nameInput.focus();
});

optimizeBtn.addEventListener('click', async () => {
    const capacity = parseFloat(document.getElementById('capacity').value);
    
    if (isNaN(capacity) || capacity <= 0) {
        alert("Please set a valid capacity greater than 0.");
        return;
    }
    
    if (items.length === 0) {
        alert("Please add at least one item to the dock.");
        return;
    }
    
    // Show Loading
    resultsSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');
    
    try {
        const response = await fetch('/api/optimize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                capacity: capacity,
                items: items
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }
        
        // Simulate slight network delay for UI effect
        setTimeout(() => {
            loadingSection.classList.add('hidden');
            renderResults(data, capacity);
            resultsSection.classList.remove('hidden');
        }, 600);
        
    } catch (error) {
        loadingSection.classList.add('hidden');
        alert("Error: " + error.message);
    }
});

// Functions
function renderItemsList() {
    if (items.length === 0) {
        itemsList.innerHTML = '<li class="empty-state">No items added yet.</li>';
        return;
    }
    
    itemsList.innerHTML = '';
    items.forEach(item => {
        const ratio = (item.value / item.weight).toFixed(2);
        const li = document.createElement('li');
        li.className = 'item-card';
        li.innerHTML = `
            <div class="item-info">
                <strong>
                    <span class="item-color-badge" style="background-color: ${item.color}"></span>
                    ${item.name}
                </strong>
                <span>W: ${item.weight} tons | V: $${item.value} | Ratio: ${ratio} $/ton</span>
            </div>
            <button class="delete-btn" onclick="deleteItem(${item.id})" title="Remove item">×</button>
        `;
        itemsList.appendChild(li);
    });
}

window.deleteItem = function(id) {
    items = items.filter(item => item.id !== id);
    renderItemsList();
}

function renderResults(data, totalCapacity) {
    // Update summary cards
    document.getElementById('res-total-value').textContent = `$${data.total_value}`;
    
    let usedCapacity = 0;
    data.selected_items.forEach(item => usedCapacity += item.weight_taken);
    
    document.getElementById('res-capacity-used').textContent = `${usedCapacity.toFixed(2)} / ${totalCapacity} tons`;
    
    // Render Knapsack Bar
    const knapsackBar = document.getElementById('knapsack-bar');
    knapsackBar.innerHTML = '';
    
    const percentageUsed = (usedCapacity / totalCapacity) * 100;
    knapsackBar.style.width = `${percentageUsed}%`;
    
    // Render Log and Segments
    const selectedList = document.getElementById('selected-list');
    selectedList.innerHTML = '';
    
    data.selected_items.forEach(item => {
        // Visual segment in the bar
        const segment = document.createElement('div');
        segment.className = 'knapsack-segment';
        segment.style.backgroundColor = item.color;
        
        // Calculate width relative to the USED capacity for the flex layout
        const relativePct = (item.weight_taken / usedCapacity) * 100;
        segment.style.width = `${relativePct}%`;
        segment.textContent = `${item.name}`;
        
        knapsackBar.appendChild(segment);
        
        // Log entry
        const isFractional = item.fraction < 1.0;
        const li = document.createElement('li');
        li.className = 'item-card';
        li.innerHTML = `
            <div class="item-info">
                <strong>
                    <span class="item-color-badge" style="background-color: ${item.color}"></span>
                    ${item.name} ${isFractional ? ' <span class="fractional-notice">(Fractional part taken)</span>' : ''}
                </strong>
                <span>Took ${item.weight_taken} tons (+ $${item.value_added.toFixed(2)})</span>
            </div>
            <div class="fraction-badge">
                ${(item.fraction * 100).toFixed(0)}%
            </div>
        `;
        selectedList.appendChild(li);
    });
}

// Initialize with some demo data
window.onload = () => {
    document.getElementById('item-name').value = 'Electronics';
    document.getElementById('item-weight').value = '10';
    document.getElementById('item-value').value = '60';
    document.getElementById('add-btn').click();
    
    document.getElementById('item-name').value = 'Textiles';
    document.getElementById('item-weight').value = '20';
    document.getElementById('item-value').value = '100';
    document.getElementById('add-btn').click();
    
    document.getElementById('item-name').value = 'Spices';
    document.getElementById('item-weight').value = '30';
    document.getElementById('item-value').value = '120';
    document.getElementById('add-btn').click();
    
    document.getElementById('capacity').value = '50';
};
