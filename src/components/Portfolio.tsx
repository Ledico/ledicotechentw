import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  const projects = [
    {
      title: 'Vertiefungsarbeit: Unentdeckte Schönheiten',
      description: 'Erforschung weniger bekannter Orte in der Deutschschweiz abseits des Massentourismus. 51-seitige Dokumentation mit multimedialen Inhalten, Interviews und Umfragen.',
      image: './img/Image.jpeg',
      tags: ['Tourismus', 'Fotografie', 'Interviews', 'Vertiefungsarbeit'],
      isVA: true,
      linkTo: '/va',
      status: 'completed'
    },
    {
      title: 'Intune Windows 11 Migration & Autopilot',
      description: 'Mitwirkung bei der Migration zu Windows 11 für über 300 Geräte mit Microsoft Intune und Autopilot. Ongoing Projekt mit automatisierter Bereitstellung und Geräteverwaltung.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Microsoft Intune', 'Windows Autopilot', 'Windows 11', 'Migration'],
      demoUrl: '#',
      githubUrl: '#',
      status: 'ongoing'
    },
    {
      title: 'SharePoint Online Template Administration',
      description: 'Aufsetzen und Administrieren von SharePoint Online Templates für standardisierte Zusammenarbeit. Zukünftige Aktivität zur Optimierung der Teamarbeit und Dokumentenverwaltung.',
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['SharePoint Online', 'Microsoft 365', 'Templates', 'Administration'],
      demoUrl: '#',
      githubUrl: '#',
      status: 'planned'
    },
    {
      title: 'Weitere Projekte in Planung',
      description: 'Verschiedene IT-Infrastruktur- und Cloud-Projekte befinden sich derzeit in der Planungsphase. Diese umfassen Bereiche wie Automatisierung, Sicherheit und moderne Cloud-Lösungen.',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Cloud', 'Automatisierung', 'Infrastructure', 'DevOps'],
      demoUrl: '#',
      githubUrl: '#',
      status: 'planned'
    }
  ];

  return (
    <section id="portfolio" ref={sectionRef} className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Ausgewählte <span className="text-purple-600 animate-gradient-x bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">Projekte</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Reale Implementierungen, die meine Expertise in moderner IT-Infrastruktur und Cloud-Lösungen zeigen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-slate-100 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-400 hover:scale-105 hover:-translate-y-3 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                transitionDelay: `${index * 150}ms`,
                animation: isVisible ? `bounce-in 0.8s ease-out ${index * 150}ms forwards` : 'none'
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {project.status && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`relative px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md border-2 transition-all duration-300 ${
                      project.status === 'completed'
                        ? 'bg-green-500/90 text-white border-green-300 animate-status-glow-green hover:scale-110' :
                      project.status === 'ongoing'
                        ? 'bg-blue-500/90 text-white border-blue-300 animate-status-glow-blue hover:scale-110' :
                        'bg-amber-500/90 text-white border-amber-300 animate-status-glow-amber hover:scale-110'
                    }`}>
                      <span className="flex items-center space-x-1.5">
                        {project.status === 'completed' && (
                          <span className="inline-block transform group-hover:rotate-12 transition-transform">✓</span>
                        )}
                        {project.status === 'ongoing' && (
                          <span className="inline-block animate-lightning-strike">⚡</span>
                        )}
                        {project.status === 'planned' && (
                          <span className="inline-block transform group-hover:scale-125 transition-transform">📅</span>
                        )}
                        <span>
                          {project.status === 'completed' ? 'Abgeschlossen' :
                           project.status === 'ongoing' ? 'Ongoing' :
                           'In Planung'}
                        </span>
                      </span>
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-[badge-shine_2s_ease-in-out_infinite]"></span>
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-4 left-4 right-4 flex space-x-2 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    {project.isVA ? (
                      <Link 
                        to={project.linkTo}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-white/90 rounded-lg text-sm font-medium text-slate-900 hover:bg-white transition-all duration-200 hover:scale-105"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>VA ansehen</span>
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
              
              {project.isVA ? (
                <Link to={project.linkTo} className="block">
                  <div className="p-6 cursor-pointer">
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
                          className={`px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm rounded-full hover:bg-gradient-to-r hover:from-purple-100 hover:to-cyan-100 dark:hover:from-purple-900 dark:hover:to-cyan-900 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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
                      <span className="mr-2 relative z-10">Vertiefungsarbeit ansehen</span>
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