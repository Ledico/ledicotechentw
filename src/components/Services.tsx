import React, { useEffect, useRef, useState } from 'react';
import { Server, Cloud, Shield, Monitor, Settings, Database } from 'lucide-react';

const Services = () => {
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

  const services = [
    {
      icon: Monitor,
      title: 'Microsoft Intune Management',
      description: 'Komplette Endpoint-Management-Lösungen mit Geräte-Compliance und Sicherheitsrichtlinien.',
      features: ['Geräte-Registrierung', 'App-Management', 'Compliance-Richtlinien', 'Bedingter Zugriff']
    },
    {
      icon: Cloud,
      title: 'Cloud-Native Architektur',
      description: 'Moderne Cloud-Lösungen für Skalierbarkeit, Ausfallsicherheit und Performance.',
      features: ['Microservices-Design', 'Container-Orchestrierung', 'Serverless Computing', 'Auto-Skalierung']
    },
    {
      icon: Server,
      title: 'Infrastruktur-Engineering',
      description: 'Robustes IT-Infrastruktur-Design und -Implementierung für Unternehmensumgebungen.',
      features: ['Netzwerk-Architektur', 'Server-Management', 'Load Balancing', 'Disaster Recovery']
    },
    {
      icon: Shield,
      title: 'Sicherheit & Compliance',
      description: 'Umfassende Sicherheits-Frameworks und Compliance-Management-Lösungen.',
      features: ['Zero Trust Architektur', 'Identity Management', 'Sicherheitsüberwachung', 'Compliance-Auditing']
    },
    {
      icon: Settings,
      title: 'DevOps & Automatisierung',
      description: 'Optimierte Entwicklungsoperationen mit automatisierten Deployment-Pipelines.',
      features: ['CI/CD Pipelines', 'Infrastructure as Code', 'Monitoring & Alerting', 'Konfigurationsmanagement']
    },
    {
      icon: Database,
      title: 'Daten & Analytics',
      description: 'Datenplattform-Lösungen mit Echtzeit-Analytics und Business Intelligence.',
      features: ['Data Warehousing', 'ETL-Prozesse', 'Business Intelligence', 'Echtzeit-Analytics']
    }
  ];

  return (
    <section id="services" ref={sectionRef} className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Leistungen & <span className="text-purple-600 animate-gradient-x bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">Expertise</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Umfassende IT-Lösungen maßgeschneidert für moderne Unternehmensanforderungen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 group border border-slate-100 hover:border-purple-200 hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
                <service.icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={`flex items-center text-sm text-slate-500 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`} style={{ transitionDelay: `${(index * 150) + (featureIndex * 100) + 200}ms` }}>
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 flex-shrink-0 animate-pulse" style={{ animationDelay: `${featureIndex * 0.2}s` }}></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button 
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 animate-pulse-glow"
          >
            Projekt starten
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;