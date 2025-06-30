import React, { useState, useEffect } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase, InventoryItem, Accessory } from '../lib/supabase';

const SuisaPortal: React.FC = () => {
  const { profile, isSuisaMember } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Accessories state
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [generatedText, setGeneratedText] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form state for adding/editing inventory
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    quantity: 0,
    unit: 'Stück',
    location: '',
    status: 'verfügbar' as const
  });

  useEffect(() => {
    if (isSuisaMember) {
      loadInventory();
      loadAccessories();
    }
  }, [isSuisaMember]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError('Fehler beim Laden des Inventars: ' + error.message);
      } else {
        setInventory(data || []);
      }
    } catch (err) {
      setError('Verbindungsfehler beim Laden des Inventars');
    } finally {
      setLoading(false);
    }
  };

  const loadAccessories = async () => {
    try {
      const { data, error } = await supabase
        .from('accessories')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        setError('Fehler beim Laden der Zubehörteile: ' + error.message);
      } else {
        setAccessories(data || []);
      }
    } catch (err) {
      setError('Verbindungsfehler beim Laden der Zubehörteile');
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
        .update(formData)
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
    const selected = accessories.filter(acc => selectedAccessories.includes(acc.id));
    
    if (selected.length === 0) {
      setGeneratedText('Keine Zubehörteile ausgewählt.');
      return;
    }

    const totalPrice = selected.reduce((sum, acc) => sum + (acc.price || 0), 0);
    
    let text = `SUISA Zubehör-Konfiguration\n`;
    text += `================================\n\n`;
    text += `Ausgewählte Komponenten:\n\n`;
    
    selected.forEach((acc, index) => {
      text += `${index + 1}. ${acc.name}\n`;
      text += `   Kategorie: ${acc.category}\n`;
      text += `   Beschreibung: ${acc.description || 'Keine Beschreibung'}\n`;
      text += `   Kompatibilität: ${acc.compatibility.join(', ')}\n`;
      text += `   Preis: CHF ${acc.price?.toFixed(2) || '0.00'}\n`;
      text += `   Lieferant: ${acc.supplier || 'Nicht angegeben'}\n`;
      text += `   Artikelnummer: ${acc.part_number || 'Nicht angegeben'}\n\n`;
    });
    
    text += `Gesamtpreis: CHF ${totalPrice.toFixed(2)}\n\n`;
    text += `Generiert am: ${new Date().toLocaleDateString('de-CH')}\n`;
    text += `Erstellt von: ${profile?.full_name || profile?.email}\n`;

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
      location: '',
      status: 'verfügbar'
    });
  };

  const startEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description || '',
      quantity: item.quantity,
      unit: item.unit,
      location: item.location || '',
      status: item.status
    });
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(inventory.map(item => item.category))];
  const accessoryCategories = [...new Set(accessories.map(acc => acc.category))];

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
                <p className="text-slate-600 dark:text-slate-400">Inventarverwaltung und Zubehör-Generator</p>
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
                  <span>Inventar</span>
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
                      {inventory.filter(item => item.status === 'verfügbar').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Wrench className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">In Wartung</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {inventory.filter(item => item.status === 'wartung').length}
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
                    <option value="ausgeliehen">Ausgeliehen</option>
                    <option value="wartung">Wartung</option>
                    <option value="defekt">Defekt</option>
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

            {/* Inventory Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-white">Artikel</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-white">Kategorie</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-white">Menge</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-white">Standort</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-white">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-white">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-slate-900 dark:text-white">{item.quantity} {item.unit}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-slate-600 dark:text-slate-400">{item.location || '-'}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            item.status === 'verfügbar' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                            item.status === 'ausgeliehen' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300' :
                            item.status === 'wartung' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300' :
                            'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
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
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Accessory Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Zubehör auswählen</h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {accessoryCategories.map(category => (
                  <div key={category}>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{category}</h4>
                    <div className="space-y-2 ml-4">
                      {accessories.filter(acc => acc.category === category).map(accessory => (
                        <label key={accessory.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedAccessories.includes(accessory.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAccessories([...selectedAccessories, accessory.id]);
                              } else {
                                setSelectedAccessories(selectedAccessories.filter(id => id !== accessory.id));
                              }
                            }}
                            className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">{accessory.name}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{accessory.description}</p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">CHF {accessory.price?.toFixed(2) || '0.00'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Kompatibel mit: {accessory.compatibility.join(', ')}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
                <button
                  onClick={generateAccessoryText}
                  disabled={selectedAccessories.length === 0}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calculator className="h-5 w-5" />
                  <span>Konfiguration generieren</span>
                </button>
              </div>
            </div>

            {/* Generated Text */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Generierte Konfiguration</h3>
                {generatedText && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Kopieren</span>
                  </button>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 min-h-96">
                {generatedText ? (
                  <pre className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap font-mono">
                    {generatedText}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Wählen Sie Zubehörteile aus und klicken Sie auf "Konfiguration generieren"</p>
                    </div>
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
                  Standort
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
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
                  <option value="wartung">Wartung</option>
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
    </div>
  );
};

export default SuisaPortal;