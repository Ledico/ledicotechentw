import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Award,
  Eye,
  EyeOff,
  Calendar,
  ArrowUpDown,
} from 'lucide-react';
import { supabase, CareerTimelineEntry } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { usePageTitle } from '../hooks/usePageTitle';

const typeConfig = {
  work: { label: 'Beruf', icon: Briefcase, color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300' },
  education: { label: 'Ausbildung', icon: GraduationCap, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
  milestone: { label: 'Meilenstein', icon: Award, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300' },
};

const emptyForm: Partial<CareerTimelineEntry> = {
  title: '',
  company: '',
  description: '',
  start_date: '',
  end_date: null,
  type: 'work',
  skills: [],
  order_index: 0,
  is_visible: true,
};

const CareerTimelineManager: React.FC = () => {
  usePageTitle('Werdegang verwalten');
  const { profile } = useAuth();
  const [entries, setEntries] = useState<CareerTimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CareerTimelineEntry | null>(null);
  const [formData, setFormData] = useState<Partial<CareerTimelineEntry>>(emptyForm);
  const [skillInput, setSkillInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.is_admin) loadEntries();
  }, [profile?.is_admin]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('career_timeline')
        .select('*')
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;
      setEntries(data || []);
    } catch (err) {
      setError(`Fehler beim Laden: ${err instanceof Error ? err.message : 'Unbekannt'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.company || !formData.start_date) {
      setError('Titel, Unternehmen und Startdatum sind erforderlich');
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        company: formData.company,
        description: formData.description || '',
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        type: formData.type || 'work',
        skills: formData.skills || [],
        order_index: formData.order_index || 0,
        is_visible: formData.is_visible ?? true,
      };

      if (editing) {
        const { error: updateError } = await supabase
          .from('career_timeline')
          .update(payload)
          .eq('id', editing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('career_timeline')
          .insert(payload);
        if (insertError) throw insertError;
      }

      await loadEntries();
      closeModal();
    } catch (err) {
      setError(`Fehler beim Speichern: ${err instanceof Error ? err.message : 'Unbekannt'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Diesen Eintrag wirklich loeschen?')) return;
    setActionLoading(true);
    try {
      const { error: delError } = await supabase
        .from('career_timeline')
        .delete()
        .eq('id', id);
      if (delError) throw delError;
      await loadEntries();
    } catch (err) {
      setError(`Fehler beim Loeschen: ${err instanceof Error ? err.message : 'Unbekannt'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleVisibility = async (entry: CareerTimelineEntry) => {
    try {
      const { error: updateError } = await supabase
        .from('career_timeline')
        .update({ is_visible: !entry.is_visible })
        .eq('id', entry.id);
      if (updateError) throw updateError;
      await loadEntries();
    } catch (err) {
      setError(`Fehler: ${err instanceof Error ? err.message : 'Unbekannt'}`);
    }
  };

  const openEditModal = (entry: CareerTimelineEntry) => {
    setEditing(entry);
    setFormData({ ...entry });
    setSkillInput('');
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditing(null);
    setFormData({ ...emptyForm, order_index: entries.length });
    setSkillInput('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setFormData(emptyForm);
    setSkillInput('');
    setError(null);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !(formData.skills || []).includes(trimmed)) {
      setFormData({ ...formData, skills: [...(formData.skills || []), trimmed] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: (formData.skills || []).filter(s => s !== skill) });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('de-DE', { year: 'numeric', month: 'short' });
  };

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Keine Berechtigung</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Lade Werdegang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Werdegang verwalten</h1>
                <p className="text-slate-600 dark:text-slate-400">Karriere-Timeline erstellen und bearbeiten</p>
              </div>
            </div>
            <button
              onClick={openNewModal}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Neuer Eintrag</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {entries.map((entry) => {
            const config = typeConfig[entry.type];
            const TypeIcon = config.icon;

            return (
              <div
                key={entry.id}
                className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200 ${
                  !entry.is_visible ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${config.color}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{entry.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                        {!entry.is_visible && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                            Versteckt
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{entry.company}</p>
                      <div className="flex items-center space-x-1 text-xs text-slate-400 dark:text-slate-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(entry.start_date)} — {entry.end_date ? formatDate(entry.end_date) : 'Heute'}
                        </span>
                      </div>
                      {entry.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{entry.description}</p>
                      )}
                      {entry.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {entry.skills.map((skill) => (
                            <span key={skill} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-xs text-slate-400 mr-2">#{entry.order_index}</span>
                    <button
                      onClick={() => toggleVisibility(entry)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        entry.is_visible
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title={entry.is_visible ? 'Verstecken' : 'Anzeigen'}
                    >
                      {entry.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => openEditModal(entry)}
                      className="p-2 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors duration-200"
                      title="Bearbeiten"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      title="Loeschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">Noch keine Eintraege vorhanden</p>
            <button
              onClick={openNewModal}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
            >
              Ersten Eintrag erstellen
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editing ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}
              </h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Titel *</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="z.B. IT-Systemadministrator"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Unternehmen / Institution *</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="z.B. SUISA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Typ</label>
                  <select
                    value={formData.type || 'work'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'work' | 'education' | 'milestone' })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="work">Beruf</option>
                    <option value="education">Ausbildung</option>
                    <option value="milestone">Meilenstein</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Startdatum *</label>
                  <input
                    type="date"
                    value={formData.start_date || ''}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Enddatum</label>
                  <input
                    type="date"
                    value={formData.end_date || ''}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">Leer = Aktuelle Position</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Beschreibung</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Beschreibung der Taetigkeit..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Skills / Technologien</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="Skill eingeben + Enter"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {(formData.skills || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(formData.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-300 text-sm rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Reihenfolge</label>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={formData.order_index ?? 0}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_visible ?? true}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                      className="w-5 h-5 text-cyan-600 rounded border-slate-300 dark:border-slate-600 focus:ring-cyan-500"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Auf der Webseite anzeigen</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                disabled={actionLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Speichern...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Speichern</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerTimelineManager;
