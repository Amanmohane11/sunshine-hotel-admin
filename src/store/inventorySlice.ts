import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryItem, InventoryBill, InventoryTransaction, InventoryCategory, dummyInventory, dummyInventoryBills, dummyInventoryTransactions, dummyCategories } from './dummyData';

interface InventoryState {
  items: InventoryItem[];
  bills: InventoryBill[];
  transactions: InventoryTransaction[];
  categories: InventoryCategory[];
}

const initialState: InventoryState = {
  items: dummyInventory,
  bills: dummyInventoryBills,
  transactions: dummyInventoryTransactions,
  categories: dummyCategories,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<InventoryItem>) {
      state.items.push(action.payload);
    },
    updateItem(state, action: PayloadAction<InventoryItem>) {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    addBill(state, action: PayloadAction<InventoryBill>) {
      state.bills.push(action.payload);
      // Increase stock for each product
      action.payload.products.forEach(p => {
        const item = state.items.find(i => i.id === p.productId);
        if (item) {
          item.quantity += p.quantity;
          item.lastUpdated = new Date().toISOString();
        }
      });
    },
    addTransaction(state, action: PayloadAction<InventoryTransaction>) {
      state.transactions.push(action.payload);
      const item = state.items.find(i => i.id === action.payload.productId);
      if (item) {
        if (action.payload.type === 'stock_in') item.quantity += action.payload.quantity;
        else item.quantity = Math.max(0, item.quantity - action.payload.quantity);
        item.lastUpdated = new Date().toISOString();
      }
    },
    addCategory(state, action: PayloadAction<InventoryCategory>) {
      state.categories.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<InventoryCategory>) {
      const idx = state.categories.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) state.categories[idx] = action.payload;
    },
    deleteCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
  },
});

export const { addItem, updateItem, deleteItem, addBill, addTransaction, addCategory, updateCategory, deleteCategory } = inventorySlice.actions;
export default inventorySlice.reducer;
