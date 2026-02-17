import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featured_image: string;
  gallery_images: string[];
  category_id: string;
  status: 'draft' | 'published';
  published_at: string;
  view_count: number;
  order_index: number;
  tags?: string[];
  linkTo?: string;
  isVA?: boolean;
  projectStatus?: 'completed' | 'ongoing' | 'planned';
}

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_tag_relations (
            tag_id,
            project_tags (
              name
            )
          )
        `)
        .eq('status', 'published')
        .order('order_index', { ascending: true });

      if (error) throw error;

      const projectsWithTags = data?.map(project => ({
        ...project,
        tags: project.project_tag_relations?.map((rel: any) => rel.project_tags?.name).filter(Boolean) || [],
        projectStatus: extractStatusFromDescription(project.description || ''),
      })) || [];

      setProjects(projectsWithTags);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  function extractStatusFromDescription(description: string): 'completed' | 'ongoing' | 'planned' | undefined {
    if (description.toLowerCase().includes('abgeschlossen') || description.toLowerCase().includes('erfolgreich')) {
      return 'completed';
    }
    if (description.toLowerCase().includes('ongoing') || description.toLowerCase().includes('laufend')) {
      return 'ongoing';
    }
    if (description.toLowerCase().includes('planung') || description.toLowerCase().includes('geplant')) {
      return 'planned';
    }
    return undefined;
  }

  return (
    <section id="portfolio" ref={sectionRef} className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 md:mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">
            Ausgewählte <span className="text-purple-600 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Projekte</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Reale Implementierungen, die meine Expertise in moderner IT-Infrastruktur und Cloud-Lösungen zeigen
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Lade Projekte...</p>
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-12 text-slate-600 dark:text-slate-400">
            Noch keine Projekte veröffentlicht.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-400 md:hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.featured_image}
                  alt={project.title}
                  className="w-full h-40 sm:h-48 object-cover md:group-hover:scale-110 transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {project.projectStatus && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className={`relative inline-flex items-center space-x-1 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border transition-all duration-300 ${
                      project.projectStatus === 'completed'
                        ? 'bg-green-500/95 text-white border-green-400 shadow-lg shadow-green-500/50 animate-status-glow-green' :
                      project.projectStatus === 'ongoing'
                        ? 'bg-amber-500/95 text-white border-amber-400 shadow-lg shadow-amber-500/50 animate-status-glow-amber' :
                        'bg-blue-500/95 text-white border-blue-400 shadow-lg shadow-blue-500/50 animate-status-glow-blue'
                    }`}>
                      {project.projectStatus === 'completed' && (
                        <span className="text-base">✓</span>
                      )}
                      {project.projectStatus === 'ongoing' && (
                        <span className="text-base animate-pulse">⚡</span>
                      )}
                      {project.projectStatus === 'planned' && (
                        <span className="text-base">📅</span>
                      )}
                      <span className="font-bold">
                        {project.projectStatus === 'completed' ? 'Abgeschlossen' :
                         project.projectStatus === 'ongoing' ? 'Ongoing' :
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
                      <>
                        <button className="flex items-center space-x-1 px-3 py-1.5 bg-white/90 rounded-lg text-sm font-medium text-slate-900 hover:bg-white transition-all duration-200 hover:scale-105">
                          <ExternalLink className="h-4 w-4" />
                          <span>Details</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-1.5 bg-white/90 rounded-lg text-sm font-medium text-slate-900 hover:bg-white transition-all duration-200 hover:scale-105">
                          <Github className="h-4 w-4" />
                          <span>Code</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {project.linkTo ? (
                <Link to={project.linkTo} className="block">
                  <div className="p-4 md:p-6 cursor-pointer">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 transition-all duration-300">
                      {project.title}
                    </h3>

                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-3 md:mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`px-2 py-1 md:px-3 md:py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs md:text-sm rounded-full hover:bg-gradient-to-r hover:from-purple-100 hover:to-cyan-100 dark:hover:from-purple-900 dark:hover:to-cyan-900 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 cursor-pointer ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                          style={{
                            transitionDelay: `${(index * 150) + (tagIndex * 50) + 300}ms`,
                            animation: isVisible ? `slide-in-right 0.5s ease-out ${(index * 150) + (tagIndex * 50) + 300}ms forwards` : 'none'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:translate-x-3 transition-all duration-300 relative overflow-hidden">
                      <span className="mr-2 relative z-10">{project.isVA ? 'Vertiefungsarbeit ansehen' : 'Projekt Details ansehen'}</span>
                      <ArrowRight className="h-4 w-4 group-hover:animate-pulse relative z-10 group-hover:translate-x-1 transition-transform" />
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 transition-all duration-300 transform group-hover:scale-105">
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className={`px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        style={{ transitionDelay: `${(index * 150) + (tagIndex * 50) + 300}ms` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:translate-x-3 transition-all duration-300 relative overflow-hidden">
                    <span className="mr-2 relative z-10">Projekt ansehen</span>
                    <ArrowRight className="h-4 w-4 group-hover:animate-pulse relative z-10 group-hover:translate-x-1 transition-transform" />
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Interessiert an weiteren Arbeiten oder möchten Sie ein Projekt besprechen?
          </p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/40 animate-pulse-glow overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              Zusammenarbeiten
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;