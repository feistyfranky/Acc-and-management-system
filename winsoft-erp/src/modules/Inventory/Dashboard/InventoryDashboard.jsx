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
    <div className="min-h-screen animate-fade-in" style={{ color: '#cbd5e1' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#e2e8f0' }}>Inventory Dashboard</h1>
        <p style={{ color: '#475569', fontSize: '0.875rem' }}>Track paper, ink, and plates inventory with real-time alerts</p>
      </div>

      {/* Critical Alert Banner */}
      {stats.criticalCount > 0 && (
        <div
          className="mb-6 p-4 rounded-xl flex items-start gap-4 animate-pulse-glow"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <AlertTriangle size={20} style={{ color: '#f87171', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p className="font-bold" style={{ color: '#fca5a5' }}>Critical Stock Alert</p>
            <p className="text-sm font-medium" style={{ color: '#f87171' }}>
              {stats.criticalCount} item(s) are at critical stock levels and require immediate reordering
            </p>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8 animate-fade-in-delayed">
        <div className="stat-card blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>Total Items</p>
              <p className="text-3xl font-extrabold" style={{ color: '#e2e8f0' }}>{stats.totalItems}</p>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.2)' }}>
              <Package size={22} style={{ color: '#818cf8' }} />
            </div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>In Stock</p>
              <p className="text-3xl font-extrabold" style={{ color: '#34d399' }}>{stats.inStockCount}</p>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.2)' }}>
              <span style={{ color: '#34d399', fontSize: '1.2rem', fontWeight: 800 }}>✓</span>
            </div>
          </div>
        </div>

        <div className="stat-card amber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>Low Stock</p>
              <p className="text-3xl font-extrabold" style={{ color: '#fbbf24' }}>{stats.lowStockCount}</p>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.2)' }}>
              <span style={{ color: '#fbbf24', fontSize: '1.2rem', fontWeight: 800 }}>⚠</span>
            </div>
          </div>
        </div>

        <div className="stat-card red">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>Critical</p>
              <p className="text-3xl font-extrabold" style={{ color: '#f87171' }}>{stats.criticalCount}</p>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.2)' }}>
              <span style={{ color: '#f87171', fontSize: '1.2rem', fontWeight: 800 }}>✕</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter + Search bar */}
      <div className="glass-card p-3 mb-5 flex flex-wrap gap-3 items-center animate-fade-in-delayed-2">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {['all', 'Paper', 'Ink', 'Plates'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
              style={{
                background: activeTab === tab ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: activeTab === tab ? '#a5b4fc' : '#64748b',
              }}
            >
              {tab === 'all' ? 'All' : tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1" style={{ minWidth: '180px' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={15} style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Search items, SKU, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9 pr-3 py-2 text-sm"
          />
        </div>

        <span style={{ color: '#334155', fontSize: '0.75rem' }}>
          <span style={{ color: '#64748b', fontWeight: 600 }}>{filteredItems.length}</span> / {items.length}
        </span>

        <button
          onClick={() => { setEditingItem(null); setIsAddModalOpen(true); }}
          className="btn-premium flex items-center gap-2 px-4 py-2 text-sm ml-auto"
        >
          <Plus size={15} /> Add Item
        </button>
      </div>

      {/* Inventory Table */}
      {filteredItems.length > 0 ? (
        <div className="glass-card overflow-hidden animate-fade-in-delayed-2">
          <div className="overflow-x-auto">
            <InventoryTable
              items={filteredItems}
              onEdit={(item) => { setEditingItem(item); setIsAddModalOpen(true); }}
              onDelete={handleDeleteItem}
            />
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center animate-fade-in-delayed-2">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <Package size={32} style={{ color: '#334155' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: '#64748b' }}>No items found</p>
          <p style={{ color: '#334155', fontSize: '0.8125rem' }}>Try adjusting your search or filters</p>
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
