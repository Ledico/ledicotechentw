import React, { useEffect, useRef, useState } from 'react';
import { Server, Cloud, Shield, Zap, Users, Trophy } from 'lucide-react';

const About = () => {
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

  const skills = [
    { name: 'Microsoft Intune & Endpoint Management', level: 95 },
    { name: 'Windows 11 Migration & Autopilot', level: 90 },
    { name: 'Microsoft 365 Administration (SharePoint, Exchange, Teams)', level: 88 },
    { name: 'Azure Entra ID & Cloud-Migration', level: 85 },
  ];

  const stats = [
    { icon: Server, number: '340+', label: 'Geräte migriert (SUISA)' },
    { icon: Users, number: '300+', label: 'Notebooks deployed' },
    { icon: Trophy, number: '5+', label: 'Jahre Erfahrung' },
    { icon: Shield, number: '100%', label: 'Autopilot Success Rate' },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Über <span className="text-purple-600 animate-gradient-x bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">mich</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            IT-Systemadministrator bei SUISA mit Spezialisierung auf Microsoft Intune, Windows 11 Migration und Microsoft 365 Administration
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Praktische IT-Expertise aus realen Enterprise-Projekten
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Als IT-Systemadministrator bei der SUISA leite ich aktuell die Migration von über 340 Geräten zu Windows 11
              mit Microsoft Intune und Windows Autopilot. Von der Geräte-Registrierung über App-Management bis zur
              Zero-Touch Bereitstellung – ich implementiere moderne Cloud-basierte Endpoint-Management-Lösungen.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Meine Expertise umfasst die Migration von Active Directory zu Azure Entra ID, die Implementierung von
              SharePoint Online Templates, sowie den Wechsel von Drittanbieter-Security-Lösungen zu Microsoft Defender for Endpoint.
              Durch kontinuierliches Lernen und praktische Erfahrung mit Microsoft 365 Technologien liefere ich Lösungen,
              die den Unternehmensalltag verbessern.
            </p>

            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={skill.name} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: `${400 + index * 100}ms` }}>
                  <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 h-2 rounded-full transition-all duration-2000 ease-out"
                      style={{ 
                        width: isVisible ? `${skill.level}%` : '0%',
                        transitionDelay: `${600 + index * 200}ms`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8 text-white hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
              <h4 className="text-2xl font-bold mb-6">Meine Arbeitsweise</h4>
              <div className="space-y-4">
                {[
                  'Cloud-First Ansatz mit Microsoft 365',
                  'Zero-Touch Deployment mit Autopilot',
                  'Self-Service für Endbenutzer (Company Portal)',
                  'Native Microsoft Security Integration'
                ].map((item, index) => (
                  <div key={index} className={`flex items-start space-x-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`} style={{ transitionDelay: `${800 + index * 100}ms` }}>
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className={`text-center group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${600 + index * 150}ms` }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white mb-4 group-hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 counter-animation">{stat.number}</div>
              <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;