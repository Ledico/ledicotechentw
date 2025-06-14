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
      title: 'Vertiefungsarbeit: Intune Automatisierung',
      description: 'Umfassende Automatisierung der Geräteverwaltung mit Microsoft Intune für Enterprise-Umgebungen. 95-seitige Dokumentation mit praktischer Implementierung.',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Microsoft Intune', 'Azure AD', 'PowerShell', 'Vertiefungsarbeit'],
      isVA: true,
      linkTo: '/va'
    },
    {
      title: 'Enterprise Intune Deployment',
      description: 'Komplette Microsoft Intune Einführung für 500+ Geräte mit automatisierter Registrierung, Compliance-Richtlinien und Anwendungsmanagement.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Microsoft Intune', 'Azure AD', 'PowerShell', 'Compliance'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      title: 'Cloud-Native Infrastruktur',
      description: 'Kubernetes-basierte Microservices-Plattform mit automatisierten CI/CD-Pipelines und Infrastructure as Code Implementierung.',
      image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Kubernetes', 'Docker', 'Terraform', 'Azure DevOps'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      title: 'Zero Trust Sicherheits-Framework',
      description: 'Implementierung einer umfassenden Zero Trust Architektur mit bedingten Zugriffsrichtlinien und Identitätsschutz.',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Azure AD', 'Bedingter Zugriff', 'MFA', 'Sicherheit'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      title: 'Hybrid Cloud Migration',
      description: 'Nahtlose Migration von On-Premises-Infrastruktur in eine Hybrid-Cloud-Umgebung mit minimaler Ausfallzeit.',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Azure', 'Hybrid Cloud', 'Migration', 'PowerShell'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      title: 'Automatisierte Monitoring-Lösung',
      description: 'Umfassende Überwachungs- und Alarmierungssystem mit benutzerdefinierten Dashboards und automatisierter Incident Response.',
      image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Azure Monitor', 'Log Analytics', 'PowerBI', 'Automatisierung'],
      demoUrl: '#',
      githubUrl: '#'
    }
  ];

  return (
    <section id="portfolio" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Ausgewählte <span className="text-purple-600 animate-gradient-x bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">Projekte</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Reale Implementierungen, die meine Expertise in moderner IT-Infrastruktur und Cloud-Lösungen zeigen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-slate-100 hover:border-purple-200 hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
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
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className={`px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full hover:bg-purple-100 hover:text-purple-700 transition-all duration-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                      style={{ transitionDelay: `${(index * 150) + (tagIndex * 50) + 300}ms` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-2">
                    {project.isVA ? 'Vertiefungsarbeit ansehen' : 'Projekt ansehen'}
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-slate-600 mb-6">
            Interessiert an weiteren Arbeiten oder möchten Sie ein Projekt besprechen?
          </p>
          <button 
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 animate-pulse-glow"
          >
            Zusammenarbeiten
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;