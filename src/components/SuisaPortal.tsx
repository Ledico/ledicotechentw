import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Package, 
  Settings, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Download,
  Copy,
  CheckCircle,
  AlertTriangle,
  BarChart,
  Users,
  Wrench,
  ShoppingCart,
  Calculator,
  FileText,
  ArrowLeft,
  Minus,
  Calendar,
  StickyNote,
  User,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePageTitle } from '../hooks/usePageTitle';
import { supabase, InventoryItem, Accessory } from '../lib/supabase';

// Updated InventoryItem type to match new structure
interface ExtendedInventoryItem extends Omit<InventoryItem, 'location'> {
  restock_date?: string;
  restock_notes?: string;
  last_modified_by?: string;
  last_modified_at?: string;
  last_transaction_type?: string;
  last_transaction_date?: string;
  last_modified_user_name?: string;
}

// Function to check if item is low stock (2 or less) - moved outside component
const isLowStock = (quantity: number) => {
  return quantity <= 2;
};

const SuisaPortal: React.FC = () => {
  usePageTitle('SUISA Portal');
  const { profile, isSuisaMember } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Inventory state
  const [inventory, setInventory] = useState<ExtendedInventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Accessories state
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [accessoryQuantities, setAccessoryQuantities] = useState<Record<string, number>>({});
  const [generatedText, setGeneratedText] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ExtendedInventoryItem | null>(null);
  const [restockingItem, setRestockingItem] = useState<ExtendedInventoryItem | null>(null);

  // Form state for adding/editing inventory
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    quantity: 0,
    unit: 'Stück',
    restock_date: '',
    restock_notes: '',
    status: 'verfügbar' as const
  });

  // Restock form state
  const [restockData, setRestockData] = useState({
    quantity: 0,
    restock_date: new Date().toISOString().split('T')[0],
    restock_notes: ''
  });

  useEffect(() => {
    if (isSuisaMember) {
      loadData();
    }
  }, [isSuisaMember]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [inventoryResult, accessoriesResult] = await Promise.all([
        supabase.rpc('get_inventory_with_last_transaction'),
        supabase.from('accessories').select('id, name, category').order('category', { ascending: true })
      ]);

      if (inventoryResult.error) {
        setError('Fehler beim Laden des Werkstatt Zubehör Inventars: ' + inventoryResult.error.message);
      } else {
        setInventory(inventoryResult.data || []);
      }

      if (accessoriesResult.error) {
        setError('Fehler beim Laden der Zubehörteile: ' + accessoriesResult.error.message);
      } else {
        setAccessories(accessoriesResult.data || []);
      }
    } catch (err) {
      setError('Verbindungsfehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_inventory_with_last_transaction');

      if (error) {
        setError('Fehler beim Laden des Werkstatt Zubehör Inventars: ' + error.message);
      } else {
        setInventory(data || []);
      }
    } catch (err) {
      setError('Verbindungsfehler beim Laden des Werkstatt Zubehör Inventars');
    }
  };

  const adjustQuantity = async (itemId: string, change: number) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.rpc('adjust_inventory_quantity', {
        item_id: itemId,
        quantity_change: change,
        transaction_type: change > 0 ? 'adjustment' : 'usage',
        reason: change > 0 ? 'Bestand erhöht' : 'Bestand reduziert'
      });

      if (error) {
        setError('Fehler beim Anpassen der Menge: ' + error.message);
      } else {
        setSuccess(`Menge um ${change} ${change > 0 ? 'erhöht' : 'reduziert'}!`);
        loadInventory();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Verbindungsfehler beim Anpassen der Menge');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockingItem) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.rpc('adjust_inventory_quantity', {
        item_id: restockingItem.id,
        quantity_change: restockData.quantity,
        transaction_type: 'restock',
        reason: 'Nachbestellung',
        restock_date: restockData.restock_date,
        restock_notes: restockData.restock_notes
      });

      if (error) {
        setError('Fehler bei der Nachbestellung: ' + error.message);
      } else {
        setSuccess('Nachbestellung erfolgreich eingetragen!');
        setShowRestockModal(false);
        setRestockingItem(null);
        resetRestockForm();
        loadInventory();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Verbindungsfehler bei der Nachbestellung');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('inventory')
        .insert([{
          ...formData,
          restock_date: formData.restock_date || null,
          created_by: profile?.id
        }]);

      if (error) {
        setError('Fehler beim Hinzufügen: ' + error.message);
      } else {
        setSuccess('Artikel erfolgreich hinzugefügt!');
        setShowAddModal(false);
        resetForm();
        loadInventory();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Verbindungsfehler beim Hinzufügen');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('inventory')
        .update({
          name: formData.name,
          category: formData.category,
          description: formData.description,
          quantity: formData.quantity,
          unit: formData.unit,
          restock_date: formData.restock_date || null,
          restock_notes: formData.restock_notes,
          status: formData.status
        })
        .eq('id', editingItem.id);

      if (error) {
        setError('Fehler beim Aktualisieren: ' + error.message);
      } else {
        setSuccess('Artikel erfolgreich aktualisiert!');
        setEditingItem(null);
        resetForm();
        loadInventory();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Verbindungsfehler beim Aktualisieren');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Artikel löschen möchten?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) {
        setError('Fehler beim Löschen: ' + error.message);
      } else {
        setSuccess('Artikel erfolgreich gelöscht!');
        loadInventory();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Verbindungsfehler beim Löschen');
    } finally {
      setLoading(false);
    }
  };

  const generateAccessoryText = () => {
    const selected = accessories
      .filter(acc => accessoryQuantities[acc.id] && accessoryQuantities[acc.id] > 0)
      .map(acc => ({ ...acc, quantity: accessoryQuantities[acc.id] }));

    if (selected.length === 0) {
      setGeneratedText('Keine Zubehörteile ausgewählt.');
      return;
    }

    const items = selected.map(acc => `${acc.name} (${acc.quantity})`).join(', ');
    const text = `Zubehör: ${items}`;

    setGeneratedText(text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setSuccess('Text in die Zwischenablage kopiert!');
    setTimeout(() => setSuccess(null), 2000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      quantity: 0,
      unit: 'Stück',
      restock_date: '',
      restock_notes: '',
      status: 'verfügbar'
    });
  };

  const resetRestockForm = () => {
    setRestockData({
      quantity: 0,
      restock_date: new Date().toISOString().split('T')[0],
      restock_notes: ''
    });
  };

  const startEdit = (item: ExtendedInventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description || '',
      quantity: item.quantity,
      unit: item.unit,
      restock_date: item.restock_date || '',
      restock_notes: item.restock_notes || '',
      status: item.status
    });
  };

  const startRestock = (item: ExtendedInventoryItem) => {
    setRestockingItem(item);
    setShowRestockModal(true);
    resetRestockForm();
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

      let matchesStatus = false;
      if (filterStatus === 'all') {
        matchesStatus = true;
      } else if (filterStatus === 'verfügbar') {
        matchesStatus = item.status === 'verfügbar' && !isLowStock(item.quantity);
      } else if (filterStatus === 'knapp') {
        matchesStatus = item.status === 'verfügbar' && isLowStock(item.quantity);
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, searchTerm, filterCategory, filterStatus]);

  const categories = useMemo(() => [...new Set(inventory.map(item => item.category))], [inventory]);
  const accessoryCategories = useMemo(() => [...new Set(accessories.map(acc => acc.category))], [accessories]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  // Function to get status badge with low stock warning
  const getStatusBadge = (item: ExtendedInventoryItem) => {
    const isLow = isLowStock(item.quantity);
    
    if (item.status === 'verfügbar') {
      if (isLow) {
        return (
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-full text-sm font-medium flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>Knapp</span>
            </span>
          </div>
        );
      } else {
        return (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
            Verfügbar
          </span>
        );
      }
    } else if (item.status === 'ausgeliehen') {
      return (
        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium">
          Ausgeliehen
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-full text-sm font-medium">
          Defekt
        </span>
      );
    }
  };

  if (!isSuisaMember) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Zugriff verweigert</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Sie haben keine Berechtigung, auf das SUISA-Portal zuzugreifen. 
            Nur SUISA-Mitglieder und Administratoren können diese Seite besuchen.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300"
          >
            Zurück
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SUISA Portal</h1>
                <p className="text-slate-600 dark:text-slate-400">Werkstatt Zubehör Inventarverwaltung und Zubehör-Generator</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span>Angemeldet als: {profile?.full_name || profile?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'inventory'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Werkstatt Zubehör Inventar</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'generator'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4" />
                  <span>Zubehör-Generator</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Gesamt Artikel</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{inventory.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Verfügbar</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {inventory.filter(item => item.status === 'verfügbar' && !isLowStock(item.quantity)).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Knapper Bestand</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {inventory.filter(item => item.status === 'verfügbar' && isLowStock(item.quantity)).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Kategorien</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{categories.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Artikel suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="all">Alle Kategorien</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="all">Alle Status</option>
                    <option value="verfügbar">Verfügbar</option>
                    <option value="knapp">Knapp</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Artikel hinzufügen</span>
                </button>
              </div>
            </div>

            {/* Fixed Width Inventory Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '12%' }} />
                  </colgroup>
                  <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                    <tr>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">Artikel</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">Kategorie</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">Menge</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">Nachbestellung</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">Zuletzt geändert</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150 ${isLowStock(item.quantity) && item.status === 'verfügbar' ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            {isLowStock(item.quantity) && item.status === 'verfügbar' && (
                              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 animate-pulse" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-slate-900 dark:text-white truncate" title={item.name}>{item.name}</p>
                              {item.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate" title={item.description}>{item.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm truncate block" title={item.category}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => adjustQuantity(item.id, -1)}
                              disabled={loading || item.quantity <= 0}
                              className="w-7 h-7 flex items-center justify-center bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className={`font-medium min-w-[50px] text-center text-sm ${isLowStock(item.quantity) && item.status === 'verfügbar' ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-900 dark:text-white'}`}>
                              {item.quantity} {item.unit}
                            </span>
                            <button
                              onClick={() => adjustQuantity(item.id, 1)}
                              disabled={loading}
                              className="w-7 h-7 flex items-center justify-center bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {item.restock_date ? (
                              <>
                                <div className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400">
                                  <Calendar className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{formatDate(item.restock_date)}</span>
                                </div>
                                {item.restock_notes && (
                                  <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-500">
                                    <StickyNote className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate" title={item.restock_notes}>
                                      {item.restock_notes}
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="text-xs text-slate-400 dark:text-slate-500">Keine Nachbestellung</span>
                            )}
                            <button
                              onClick={() => startRestock(item)}
                              className="flex items-center space-x-1 px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded hover:bg-orange-200 dark:hover:bg-orange-900/40 transition-colors duration-200 font-medium"
                            >
                              <ShoppingCart className="h-3 w-3" />
                              <span>Nachbestellen</span>
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(item)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {item.last_modified_user_name && (
                              <div className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400">
                                <User className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate" title={item.last_modified_user_name}>{item.last_modified_user_name}</span>
                              </div>
                            )}
                            {item.last_modified_at && (
                              <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-500">
                                <Clock className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{formatDate(item.last_modified_at)}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => startEdit(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                              title="Bearbeiten"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                              title="Löschen"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredInventory.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">Keine Artikel gefunden</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generator Tab */}
        {activeTab === 'generator' && (
          <div className="space-y-8">
            {/* Accessory Selection - Full Width */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Zubehör Auswahl</h3>

              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {accessoryCategories.map(category => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide">{category}</h4>
                    <div className="space-y-2">
                      {accessories.filter(acc => acc.category === category).map(accessory => (
                        <div key={accessory.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-700 border border-slate-200 dark:border-slate-600">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={(accessoryQuantities[accessory.id] || 0) > 0}
                              onChange={(e) => {
                                const newQuantities = { ...accessoryQuantities };
                                if (e.target.checked) {
                                  newQuantities[accessory.id] = 1;
                                } else {
                                  newQuantities[accessory.id] = 0;
                                }
                                setAccessoryQuantities(newQuantities);
                              }}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                            />
                            <p className="font-medium text-slate-900 dark:text-white text-sm leading-tight break-words">{accessory.name}</p>
                          </div>
                          <input
                            type="number"
                            min="1"
                            value={accessoryQuantities[accessory.id] || 1}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              setAccessoryQuantities({
                                ...accessoryQuantities,
                                [accessory.id]: value
                              });
                            }}
                            className="w-14 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded-lg text-center bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm flex-shrink-0"
                            disabled={(accessoryQuantities[accessory.id] || 0) === 0}
                          />
                        </div>
                      ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600 flex space-x-3">
                <button
                  onClick={generateAccessoryText}
                  disabled={Object.values(accessoryQuantities).every(q => !q || q === 0)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="h-5 w-5" />
                  <span>Generiere</span>
                </button>
                <button
                  onClick={() => setAccessoryQuantities({})}
                  className="px-4 py-3 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200"
                >
                  Clear
                </button>
                {generatedText && (
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Copy
                  </button>
                )}
              </div>
            </div>

            {/* Generated Text */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Ausgabe</h3>

              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 min-h-[150px] flex items-center justify-center">
                {generatedText ? (
                  <div className="w-full">
                    <p className="text-lg text-slate-900 dark:text-white whitespace-pre-wrap break-words">
                      {generatedText}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Keine Ausgabe</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
            setShowAddModal(false);
            setEditingItem(null);
            resetForm();
          }}></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {editingItem ? 'Artikel bearbeiten' : 'Neuen Artikel hinzufügen'}
            </h3>
            
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Kategorie *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Menge *
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Einheit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Stück">Stück</option>
                    <option value="Meter">Meter</option>
                    <option value="Kilogramm">Kilogramm</option>
                    <option value="Liter">Liter</option>
                    <option value="Paket">Paket</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nachbestelldatum
                </label>
                <input
                  type="date"
                  value={formData.restock_date}
                  onChange={(e) => setFormData({...formData, restock_date: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nachbestellnotizen
                </label>
                <textarea
                  value={formData.restock_notes}
                  onChange={(e) => setFormData({...formData, restock_notes: e.target.value})}
                  rows={2}
                  placeholder="z.B. Lieferant, Bestellnummer, Hinweise..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="verfügbar">Verfügbar</option>
                  <option value="ausgeliehen">Ausgeliehen</option>
                  <option value="defekt">Defekt</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Speichern...' : (editingItem ? 'Aktualisieren' : 'Hinzufügen')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && restockingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
            setShowRestockModal(false);
            setRestockingItem(null);
            resetRestockForm();
          }}></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Nachbestellung für: {restockingItem.name}
            </h3>
            
            <form onSubmit={handleRestock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nachbestellte Menge *
                </label>
                <input
                  type="number"
                  value={restockData.quantity}
                  onChange={(e) => setRestockData({...restockData, quantity: parseInt(e.target.value)})}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bestelldatum *
                </label>
                <input
                  type="date"
                  value={restockData.restock_date}
                  onChange={(e) => setRestockData({...restockData, restock_date: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Notizen/Hinweise
                </label>
                <textarea
                  value={restockData.restock_notes}
                  onChange={(e) => setRestockData({...restockData, restock_notes: e.target.value})}
                  rows={3}
                  placeholder="Lieferant, Bestellnummer, erwartetes Lieferdatum..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRestockModal(false);
                    setRestockingItem(null);
                    resetRestockForm();
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Speichern...' : 'Nachbestellung eintragen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuisaPortal;