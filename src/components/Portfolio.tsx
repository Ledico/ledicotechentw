import { useEffect, useRef, useState } from 'react';
import { ExternalLink, ArrowRight, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface PortfolioProject {
  title: string;
  description: string;
  image: string;
  tags: string[];
  category?: string;
  isVA?: boolean;
  linkTo?: string;
  status?: string;
}

const fallbackProjects: PortfolioProject[] = [
  {
    title: 'Vertiefungsarbeit: Unentdeckte Schoenheiten',
    description: 'Erforschung weniger bekannter Orte in der Deutschschweiz abseits des Massentourismus. 51-seitige Dokumentation mit multimedialen Inhalten, Interviews und Umfragen.',
    image: './img/Image.jpeg',
    tags: ['Tourismus', 'Fotografie', 'Interviews', 'Vertiefungsarbeit'],
    category: 'Schulprojekte',
    isVA: true,
    linkTo: '/va',
    status: 'completed'
  },
  {
    title: 'Intune Windows 11 Migration & Autopilot',
    description: 'Mitwirkung bei der Migration zu Windows 11 fuer ueber 300 Geraete mit Microsoft Intune und Autopilot. Erfolgreich abgeschlossenes Projekt mit automatisierter Bereitstellung und Geraeteverwaltung.',
    image: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Microsoft Intune', 'Windows Autopilot', 'Windows 11', 'Migration'],
    category: 'System Administration',
    linkTo: '/intune-migration',
    status: 'completed'
  },
  {
    title: 'SharePoint Online Template Administration',
    description: 'Aufsetzen und Administrieren von SharePoint Online Templates fuer standardisierte Zusammenarbeit. Ongoing Projekt zur Optimierung der Teamarbeit und Dokumentenverwaltung.',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['SharePoint Online', 'Microsoft 365', 'Templates', 'Administration'],
    category: 'Collaboration',
    status: 'ongoing'
  },
  {
    title: 'Weitere Projekte in Planung',
    description: 'Verschiedene IT-Infrastruktur- und Cloud-Projekte befinden sich derzeit in der Planungsphase. Diese umfassen Bereiche wie Automatisierung, Sicherheit und moderne Cloud-Loesungen.',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Cloud', 'Automatisierung', 'Infrastructure', 'DevOps'],
    category: 'IT Infrastructure',
    status: 'planned'
  }
];

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: dbProjects, error } = await supabase
        .from('projects_with_tags')
        .select('*')
        .eq('status', 'published')
        .order('order_index', { ascending: true });

      if (error) throw error;

      const projectsWithTags = (dbProjects || []).map((project: any) => ({
        title: project.title,
        description: project.description || '',
        image: project.featured_image || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600',
        tags: (project.tags || []).map((t: any) => t.name),
        category: project.category_name || undefined,
        linkTo: project.slug ? `/${project.slug}` : undefined,
        status: project.status === 'published' ? 'completed' : 'planned'
      }));

      const loaded = projectsWithTags.length > 0 ? projectsWithTags : fallbackProjects;
      setProjects(loaded);

      const tags = new Set<string>();
      loaded.forEach((p: PortfolioProject) => p.tags.forEach((t) => tags.add(t)));
      setAllTags(Array.from(tags).sort());
    } catch {
      setProjects(fallbackProjects);
      const tags = new Set<string>();
      fallbackProjects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
      setAllTags(Array.from(tags).sort());
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects;

  const clearFilter = () => {
    setActiveTag(null);
  };

  if (loading) {
    return (
      <section id="portfolio" ref={sectionRef} className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Lade Projekte...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" ref={sectionRef} className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 md:mb-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">
            Ausgewaehlte <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Projekte</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Reale Implementierungen, die meine Expertise in moderner IT-Infrastruktur und Cloud-Loesungen zeigen
          </p>
        </div>

        <div className={`mb-8 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showFilters || activeTag
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filtern</span>
              {activeTag && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">1</span>
              )}
            </button>
            {activeTag && (
              <button
                onClick={clearFilter}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200"
              >
                <X className="h-3.5 w-3.5" />
                <span>Zuruecksetzen</span>
              </button>
            )}
          </div>

          {showFilters && (
            <div className="flex flex-wrap justify-center gap-2 animate-fade-in">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  !activeTag
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Alle
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTag === tag
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {activeTag && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Projekt' : 'Projekte'} mit Tag "{activeTag}"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={`${project.title}-${index}`}
              className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500 md:hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-40 sm:h-48 object-cover md:group-hover:scale-110 transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {project.status && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className={`relative inline-flex items-center space-x-1 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border transition-all duration-300 ${
                      project.status === 'completed'
                        ? 'bg-green-500/95 text-white border-green-400 shadow-lg shadow-green-500/50' :
                      project.status === 'ongoing'
                        ? 'bg-amber-500/95 text-white border-amber-400 shadow-lg shadow-amber-500/50' :
                        'bg-blue-500/95 text-white border-blue-400 shadow-lg shadow-blue-500/50'
                    }`}>
                      <span className="font-bold">
                        {project.status === 'completed' ? 'Abgeschlossen' :
                         project.status === 'ongoing' ? 'Ongoing' :
                         'In Planung'}
                      </span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-4 left-4 right-4 flex space-x-2 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    {project.linkTo ? (
                      <Link
                        to={project.linkTo}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-white/90 rounded-lg text-sm font-medium text-slate-900 hover:bg-white transition-all duration-200 hover:scale-105"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>{project.isVA ? 'VA ansehen' : 'Details ansehen'}</span>
                      </Link>
                    ) : (
                      <button className="flex items-center space-x-1 px-3 py-1.5 bg-white/90 rounded-lg text-sm font-medium text-slate-900 hover:bg-white transition-all duration-200 hover:scale-105">
                        <ExternalLink className="h-4 w-4" />
                        <span>Details</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {project.linkTo ? (
                <Link to={project.linkTo} className="block">
                  <div className="p-4 md:p-6 cursor-pointer">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-3 md:mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 md:px-3 md:py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs md:text-sm rounded-full transition-all duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-cyan-600 dark:text-cyan-400 font-medium group-hover:translate-x-3 transition-all duration-300">
                      <span className="mr-2">{project.isVA ? 'Vertiefungsarbeit ansehen' : 'Projekt Details ansehen'}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-3 md:mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 md:px-3 md:py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs md:text-sm rounded-full transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-cyan-600 dark:text-cyan-400 font-medium group-hover:translate-x-3 transition-all duration-300">
                    <span className="mr-2">Projekt ansehen</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && activeTag && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 mb-4">Keine Projekte mit dem Tag "{activeTag}" gefunden.</p>
            <button
              onClick={clearFilter}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Filter zuruecksetzen
            </button>
          </div>
        )}

        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Interessiert an weiteren Arbeiten oder moechten Sie ein Projekt besprechen?
          </p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/40 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              Zusammenarbeiten
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
