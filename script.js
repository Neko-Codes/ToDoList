// Class representing an individual item
class Item {
    constructor(name, location, quantity, category) {
        this.name = name;
        this.location = location;
        this.quantity = quantity;
        this.category = category;
    }

    // Create the item UI element
    createItemElement() {
        const listItem = document.createElement("li");
        listItem.classList.add("Item");

        listItem.innerHTML = `
            <div>
                <strong>Name:</strong> <span class="ItemName">${this.name}</span><br>
                <strong>Location:</strong> <span class="ItemLocation">${this.location}</span><br>
                <strong>Quantity:</strong> ${this.quantity}<br>
                <strong>Category:</strong> ${this.category}
            </div>
            <button class="RemoveButton">×</button>
        `;

        listItem.querySelector(".RemoveButton").addEventListener("click", () => {
            listItem.remove();
        });

        return listItem;
    }
}

// Class to manage all items in the list
class ItemManager {
    constructor(itemListElement) {
        this.items = [];
        this.itemListElement = itemListElement;
    }

    // Add an item to the list
    addItem(item) {
        // Check for duplicates
        const duplicate = this.items.find(existingItem => 
            existingItem.name === item.name && existingItem.location === item.location
        );

        if (duplicate) {
            alert("Item already exists in the list.");
            return;
        }

        this.items.push(item);
        this.itemListElement.appendChild(item.createItemElement());
    }

    // Save items to a file
    saveItems() {
        const blob = new Blob([JSON.stringify(this.items, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "items.json";
        link.click();
    }

    // Load items from a file
    loadItems(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const loadedItems = JSON.parse(event.target.result);
                this.items = loadedItems.map(itemData => new Item(itemData.name, itemData.location, itemData.quantity, itemData.category));
                this.renderItems();
            } catch (e) {
                alert("Error loading file.");
            }
        };
        reader.readAsText(file);
    }

    // Render all items in the list
    renderItems() {
        this.itemListElement.innerHTML = "";
        this.items.forEach(item => {
            this.itemListElement.appendChild(item.createItemElement());
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const itemListElement = document.getElementById("ItemList");
    const itemManager = new ItemManager(itemListElement);

    document.getElementById("AddButton").addEventListener("click", () => {
        const nameInput = document.getElementById("ItemName");
        const locationInput = document.getElementById("ItemLocation");
        const quantityInput = document.getElementById("ItemQuantity");
        const categoryInput = document.getElementById("ItemCategory");

        const name = nameInput.value.trim();
        const location = locationInput.value.trim();
        const quantity = parseInt(quantityInput.value.trim(), 10);
        const category = categoryInput.value.trim();

        if (name && location && quantity && category) {
            const newItem = new Item(name, location, quantity, category);
            itemManager.addItem(newItem);
            nameInput.value = "";
            locationInput.value = "";
            quantityInput.value = "";
            categoryInput.value = "";
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Save button functionality
    document.getElementById("SaveButton").addEventListener("click", () => {
        itemManager.saveItems();
    });

    // Load button functionality
    document.getElementById("LoadButton").addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.click();

        input.addEventListener("change", () => {
            const file = input.files[0];
            if (file && file.type === "application/json") {
                itemManager.loadItems(file);
            } else {
                alert("Please select a valid JSON file.");
            }
        });
    });
});
