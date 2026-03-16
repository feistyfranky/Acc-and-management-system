import React, { useState, useMemo } from 'react';
import { AlertTriangle, Package, Plus, Search, Edit2, Eye } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import AddInventoryModal from './AddInventoryModal';
import InventoryTable from './InventoryTable';

const InventoryDashboard = () => {
  const { inventory: items, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Paper': 'bg-blue-100 text-blue-800',
      'Ink': 'bg-purple-100 text-purple-800',
      'Plates': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Get stock status color
  const getStatusColor = (status) => {
    const colors = {
      'In Stock': 'bg-green-100 text-green-800',
      'Low Stock': 'bg-yellow-100 text-yellow-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Filter items based on tab and search
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.category === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [items, activeTab, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const allItems = items;
    const criticalItems = allItems.filter(item => item.status === 'Critical');
    const lowStockItems = allItems.filter(item => item.status === 'Low Stock');
    const inStockItems = allItems.filter(item => item.status === 'In Stock');

    return {
      totalItems: allItems.length,
      criticalCount: criticalItems.length,
      lowStockCount: lowStockItems.length,
      inStockCount: inStockItems.length,
      totalValue: allItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0)
    };
  }, [items]);

  // Handle add/update item
  const handleSaveItem = (itemData) => {
    if (editingItem) {
      updateInventoryItem({ ...editingItem, ...itemData });
      setEditingItem(null);
    } else {
      addInventoryItem(itemData);
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItem(itemId);
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">Inventory Dashboard</h1>
        <p className="text-slate-500 font-medium tracking-wide">Track paper, ink, and plates inventory with real-time alerts</p>
      </div>

      {/* Critical Alert Banner */}
      {stats.criticalCount > 0 && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-4 shadow-sm">
          <AlertTriangle size={24} className="text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-800">Critical Stock Alert</p>
            <p className="text-sm font-medium text-rose-600">
              {stats.criticalCount} item(s) are at critical stock levels and require immediate reordering
            </p>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-delayed">
        <div className="glass-card p-6 border-b-4 border-b-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Items</p>
              <p className="text-3xl font-extrabold text-slate-800">{stats.totalItems}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">In Stock</p>
              <p className="text-3xl font-extrabold text-emerald-600">{stats.inStockCount}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 text-xl font-bold">
              ✓
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Low Stock</p>
              <p className="text-3xl font-extrabold text-amber-600">{stats.lowStockCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 text-xl font-bold">
              ⚠
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Critical</p>
              <p className="text-3xl font-extrabold text-rose-600">{stats.criticalCount}</p>
            </div>
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 text-xl font-bold">
              ✕
            </div>
          </div>
        </div>
      </div>

      {/* Tab Filter and Search */}
      <div className="glass-card p-6 mb-6 animate-fade-in-delayed-2">
        <div className="flex flex-col md:flex-row gap-6 mb-4 items-start md:items-center justify-between">
          {/* Tabs */}
          <div className="flex gap-2 bg-white/50 p-1.5 rounded-xl border border-slate-200">
            {['all', 'Paper', 'Ink', 'Plates'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
                className={`px-5 py-2.5 rounded-lg font-bold transition-all text-sm ${
                  activeTab === tab
                    ? 'bg-white shadow text-indigo-600 border border-slate-200'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/40 border border-transparent'
                }`}
              >
                {tab === 'all' ? 'All Categories' : tab}
              </button>
            ))}
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 btn-premium px-6 py-2.5"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by item name, SKU, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-slate-500 font-medium px-2">
        Showing <span className="font-bold text-slate-700">{filteredItems.length}</span> of{' '}
        <span className="font-bold text-slate-700">{items.length}</span> items
      </div>

      {/* Inventory Table */}
      {filteredItems.length > 0 ? (
        <div className="glass-card overflow-hidden animate-fade-in-delayed-2">
          <div className="overflow-x-auto">
            <InventoryTable
              items={filteredItems}
              onEdit={(item) => {
                setEditingItem(item);
                setIsAddModalOpen(true);
              }}
              onDelete={handleDeleteItem}
              getCategoryColor={getCategoryColor}
              getStatusColor={getStatusColor}
            />
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center animate-fade-in-delayed-2">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-slate-400" />
          </div>
          <p className="text-slate-700 text-xl font-bold mb-2">No items found</p>
          <p className="text-slate-500 font-medium">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />
    </div>
  );
};

export default InventoryDashboard;
