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
      description: 'Migration von 340+ Geräten zu Windows 11 mit Autopilot. Komplettes Endpoint-Management mit Compliance und Zero-Touch Bereitstellung.',
      features: ['Windows Autopilot', 'Geräte-Registrierung', 'App-Management via Company Portal', 'Compliance-Richtlinien']
    },
    {
      icon: Cloud,
      title: 'Microsoft 365 Administration',
      description: 'SharePoint Online Templates, Exchange Online und Teams-Administration für optimierte Zusammenarbeit und Dokumentenverwaltung.',
      features: ['SharePoint Templates', 'Exchange Online', 'Teams Administration', 'Microsoft 365 Governance']
    },
    {
      icon: Server,
      title: 'Cloud-Infrastruktur & Migration',
      description: 'Migration von On-Premise zu Cloud: Active Directory zu Entra ID, Group Policies zu Intune Configuration Profiles.',
      features: ['Azure Entra ID Migration', 'Cloud-Infrastruktur Setup', 'Hybrid-Umgebungen', 'Configuration Management']
    },
    {
      icon: Shield,
      title: 'Endpoint Security',
      description: 'Microsoft Defender for Endpoint Implementation. Wechsel von Drittanbieter-Lösungen zu nativer Microsoft Security.',
      features: ['Defender for Endpoint', 'Sicherheitsrichtlinien', 'Bedrohungserkennung', 'Endpoint Compliance']
    },
    {
      icon: Settings,
      title: 'IT-Automatisierung',
      description: 'Automatisierte Softwareverteilung und Self-Service Lösungen. Deployment-Automatisierung mit Intune und Autopilot.',
      features: ['Automatische Bereitstellung', 'Self-Service Portal', 'Software Deployment', 'Zero-Touch Provisioning']
    },
    {
      icon: Database,
      title: 'Systemtechnik & Support',
      description: 'Enterprise IT-Support bei SUISA. Server-Management, Netzwerk-Administration und IT-Infrastruktur-Betreuung.',
      features: ['IT-Systemadministration', 'Server-Management', 'Netzwerk-Support', 'IT-Projekt-Koordination']
    }
  ];

  return (
    <section id="services" ref={sectionRef} className="py-12 md:py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 md:mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">
            Leistungen & <span className="text-purple-600 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Expertise</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Praktische Erfahrung aus realen Enterprise-Projekten: Microsoft Intune, Windows 11 Migration und Microsoft 365 Administration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`bg-white dark:bg-slate-700 rounded-xl p-4 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 dark:border-slate-600 hover:border-purple-200 dark:hover:border-purple-500 md:hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white mb-4 md:mb-6 md:group-hover:scale-110 transition-all duration-300">
                <service.icon className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-4 md:mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={`flex items-center text-xs md:text-sm text-slate-500 dark:text-slate-400 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`} style={{ transitionDelay: `${(index * 100) + (featureIndex * 50) + 200}ms` }}>
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2 md:mr-3 flex-shrink-0" style={{ animationDelay: `${featureIndex * 0.2}s` }}></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;