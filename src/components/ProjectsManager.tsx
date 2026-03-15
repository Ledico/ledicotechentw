import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Search, Filter, Image, Eye, EyeOff, Save, X, ArrowLeft, FolderOpen, Tag, Calendar, Clock, PauseCircle, Lightbulb, Link2, Link2Off } from 'lucide-react';
import { supabase, Project, ProjectCategory, ProjectTag, ProjectWithRelations } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { usePageTitle } from '../hooks/usePageTitle';

type ProjectStatus = 'draft' | 'published' | 'ongoing' | 'on_hold' | 'planned';

const STATUS_OPTIONS: {
  value: ProjectStatus;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  activeBg: string;
  activeText: string;
  activeBorder: string;
}[] = [
  {
    value: 'published',
    label: 'Veröffentlicht',
    icon: Eye,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-white dark:bg-slate-700',
    border: 'border-slate-300 dark:border-slate-600',
    activeBg: 'bg-green-50 dark:bg-green-900/20',
    activeText: 'text-green-700 dark:text-green-300',
    activeBorder: 'border-green-500 dark:border-green-500',
  },
  {
    value: 'ongoing',
    label: 'Laufend',
    icon: Clock,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-white dark:bg-slate-700',
    border: 'border-slate-300 dark:border-slate-600',
    activeBg: 'bg-blue-50 dark:bg-blue-900/20',
    activeText: 'text-blue-700 dark:text-blue-300',
    activeBorder: 'border-blue-500 dark:border-blue-500',
  },
  {
    value: 'on_hold',
    label: 'Pausiert',
    icon: PauseCircle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-white dark:bg-slate-700',
    border: 'border-slate-300 dark:border-slate-600',
    activeBg: 'bg-amber-50 dark:bg-amber-900/20',
    activeText: 'text-amber-700 dark:text-amber-300',
    activeBorder: 'border-amber-500 dark:border-amber-500',
  },
  {
    value: 'planned',
    label: 'In Planung',
    icon: Lightbulb,
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-white dark:bg-slate-700',
    border: 'border-slate-300 dark:border-slate-600',
    activeBg: 'bg-slate-50 dark:bg-slate-700/50',
    activeText: 'text-slate-700 dark:text-slate-300',
    activeBorder: 'border-slate-500 dark:border-slate-400',
  },
  {
    value: 'draft',
    label: 'Entwurf',
    icon: EyeOff,
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-white dark:bg-slate-700',
    border: 'border-slate-300 dark:border-slate-600',
    activeBg: 'bg-slate-50 dark:bg-slate-600/30',
    activeText: 'text-slate-600 dark:text-slate-300',
    activeBorder: 'border-slate-400 dark:border-slate-500',
  },
];

function getStatusBadge(status: ProjectStatus) {
  const opt = STATUS_OPTIONS.find(s => s.value === status) ?? STATUS_OPTIONS[4];
  const Icon = opt.icon;
  const colorMap: Record<ProjectStatus, string> = {
    published: 'bg-green-500',
    ongoing: 'bg-blue-500',
    on_hold: 'bg-amber-500',
    planned: 'bg-slate-500',
    draft: 'bg-slate-400',
  };
  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold text-white ${colorMap[status]}`}>
      <Icon className="h-3 w-3" />
      <span>{opt.label}</span>
    </span>
  );
}

const ProjectsManager: React.FC = () => {
  usePageTitle('Projekte verwalten');
  const { profile } = useAuth();
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [tags, setTags] = useState<ProjectTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filterStatus, setFilterStatus] = useState<'all' | ProjectStatus>('all');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithRelations | null>(null);
  const [formData, setFormData] = useState<Partial<Project> & { slug_enabled?: boolean }>({
    title: '',
    slug: '',
    description: '',
    content: '',
    featured_image: '',
    status: 'draft',
    order_index: 0,
    slug_enabled: false,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.is_admin) {
      loadData();
    }
  }, [profile?.is_admin]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsRes, categoriesRes, tagsRes] = await Promise.all([
        supabase.from('projects').select('*').order('order_index', { ascending: true }),
        supabase.from('project_categories').select('*').order('name'),
        supabase.from('project_tags').select('*').order('name'),
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (tagsRes.error) throw tagsRes.error;

      const categoriesMap = new Map((categoriesRes.data || []).map(cat => [cat.id, cat]));

      const projectsWithRelations = await Promise.all(
        (projectsRes.data || []).map(async (project) => {
          const { data: tagRelations } = await supabase
            .from('project_tag_relations')
            .select('tag_id')
            .eq('project_id', project.id);

          const projectTags = (tagRelations || [])
            .map(rel => (tagsRes.data || []).find(tag => tag.id === rel.tag_id))
            .filter(Boolean);

          return {
            ...project,
            category: project.category_id ? categoriesMap.get(project.category_id) : undefined,
            tags: projectTags,
          };
        })
      );

      setProjects(projectsWithRelations as ProjectWithRelations[]);
      setCategories(categoriesRes.data || []);
      setTags(tagsRes.data || []);
    } catch (err) {
      setError(`Fehler beim Laden der Daten: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug_enabled ? generateSlug(title) : prev.slug ?? generateSlug(title),
    }));
  };

  const handleSaveProject = async () => {
    if (!formData.title || !formData.slug) {
      setError('Titel und Slug sind erforderlich');
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const dbPayload: any = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        featured_image: formData.featured_image,
        category_id: formData.category_id || null,
        status: formData.status ?? 'draft',
        order_index: formData.order_index ?? 0,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        slug_enabled: formData.slug_enabled ?? false,
        updated_at: new Date().toISOString(),
      };

      if (editingProject) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(dbPayload)
          .eq('id', editingProject.id);

        if (updateError) throw updateError;

        await supabase
          .from('project_tag_relations')
          .delete()
          .eq('project_id', editingProject.id);

        if (selectedTags.length > 0) {
          const relations = selectedTags.map(tagId => ({
            project_id: editingProject.id,
            tag_id: tagId,
          }));
          const { error: tagError } = await supabase
            .from('project_tag_relations')
            .insert(relations);
          if (tagError) throw tagError;
        }
      } else {
        dbPayload.created_by = profile?.id;
        if (dbPayload.status === 'published') {
          dbPayload.published_at = new Date().toISOString();
        }

        const { data: newProject, error: insertError } = await supabase
          .from('projects')
          .insert(dbPayload)
          .select()
          .single();

        if (insertError) throw insertError;

        if (newProject && selectedTags.length > 0) {
          const relations = selectedTags.map(tagId => ({
            project_id: newProject.id,
            tag_id: tagId,
          }));
          const { error: tagError } = await supabase
            .from('project_tag_relations')
            .insert(relations);
          if (tagError) throw tagError;
        }
      }

      await loadData();
      closeModal();
    } catch (err) {
      setError(`Fehler beim Speichern: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Möchten Sie dieses Projekt wirklich löschen?')) return;

    setActionLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase.from('projects').delete().eq('id', projectId);
      if (deleteError) throw deleteError;
      await loadData();
    } catch (err) {
      setError('Fehler beim Löschen des Projekts');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (project: ProjectWithRelations) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      featured_image: project.featured_image,
      category_id: project.category_id,
      status: project.status,
      order_index: project.order_index,
      meta_title: project.meta_title,
      meta_description: project.meta_description,
      slug_enabled: (project as any).slug_enabled ?? false,
    });
    setSelectedTags(project.tags?.map(tag => tag.id) || []);
    setShowProjectModal(true);
  };

  const openNewModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      featured_image: '',
      status: 'draft',
      order_index: projects.length,
      slug_enabled: false,
    });
    setSelectedTags([]);
    setShowProjectModal(true);
  };

  const closeModal = () => {
    setShowProjectModal(false);
    setEditingProject(null);
    setFormData({});
    setSelectedTags([]);
    setError(null);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Lade Projekte...</p>
        </div>
      </div>
    );
  }

  const currentStatus = (formData.status ?? 'draft') as ProjectStatus;

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
              <div className="p-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projekte Verwaltung</h1>
                <p className="text-slate-600 dark:text-slate-400">Portfolio-Projekte erstellen und verwalten</p>
              </div>
            </div>
            <button
              onClick={openNewModal}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Neues Projekt</span>
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

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Projekte suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | ProjectStatus)}
                className="pl-10 pr-8 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">Alle Status</option>
                <option value="published">Veröffentlicht</option>
                <option value="ongoing">Laufend</option>
                <option value="on_hold">Pausiert</option>
                <option value="planned">In Planung</option>
                <option value="draft">Entwurf</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-200"
            >
              {project.featured_image && (
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img src={project.featured_image} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(project.status as ProjectStatus)}
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
                  {!project.featured_image && getStatusBadge(project.status as ProjectStatus)}
                </div>

                {project.description && (
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{project.description}</p>
                )}

                {project.category && (
                  <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <FolderOpen className="h-4 w-4" />
                    <span>{project.category.name}</span>
                  </div>
                )}

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.created_at).toLocaleDateString('de-DE')}</span>
                    </div>
                    {(project as any).slug_enabled ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full border border-green-200 dark:border-green-800">
                        <Link2 className="h-3 w-3" />
                        <span>/{project.slug}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-full border border-slate-200 dark:border-slate-600">
                        <Link2Off className="h-3 w-3" />
                        <span>Kein Link</span>
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200"
                      title="Bearbeiten"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      title="Löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <FolderOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Keine Projekte gefunden</p>
          </div>
        )}
      </div>

      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingProject ? 'Projekt bearbeiten' : 'Neues Projekt erstellen'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Titel *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="Projekt Titel"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Slug-Weiterleitung
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({ ...prev, slug_enabled: !prev.slug_enabled }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                        formData.slug_enabled
                          ? 'bg-green-500'
                          : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                      title={formData.slug_enabled ? 'Deaktivieren' : 'Aktivieren'}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                          formData.slug_enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {formData.slug_enabled ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <Link2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Weiterleitung aktiv — Karte verlinkt auf /{formData.slug || '...'}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-4 py-2 border border-green-400 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        placeholder="projekt-slug"
                      />
                    </>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg">
                      <Link2Off className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Deaktiviert — Karte hat keinen Link
                      </span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Kategorie
                  </label>
                  <select
                    value={formData.category_id || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value || undefined }))}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="">Keine Kategorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {STATUS_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = currentStatus === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, status: opt.value }))}
                        className={`flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-lg border-2 transition-all duration-150 ${
                          isActive
                            ? `${opt.activeBg} ${opt.activeText} ${opt.activeBorder} shadow-sm`
                            : `${opt.bg} text-slate-500 dark:text-slate-400 ${opt.border} hover:border-slate-400 dark:hover:border-slate-500`
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? opt.activeText : opt.color}`} />
                        <span className="text-xs font-medium leading-tight text-center">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kurzbeschreibung
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Kurze Beschreibung des Projekts..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Inhalt
                </label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Vollständiger Projektinhalt..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Image className="inline h-4 w-4 mr-1" />
                  Bild URL
                </label>
                <input
                  type="text"
                  value={formData.featured_image || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setSelectedTags(prev =>
                          prev.includes(tag.id) ? prev.filter(t => t !== tag.id) : [...prev, tag.id]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag.id)
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
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
                onClick={handleSaveProject}
                disabled={actionLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-200 disabled:opacity-50"
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

export default ProjectsManager;
