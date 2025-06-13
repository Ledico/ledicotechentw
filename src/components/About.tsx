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
    { name: 'Cloud-Native Architektur', level: 90 },
    { name: 'Azure & AWS Infrastruktur', level: 88 },
    { name: 'DevOps & Automatisierung', level: 85 },
  ];

  const stats = [
    { icon: Server, number: '200+', label: 'Systeme implementiert' },
    { icon: Users, number: '50+', label: 'Enterprise-Kunden' },
    { icon: Trophy, number: '5+', label: 'Jahre Erfahrung' },
    { icon: Shield, number: '99.9%', label: 'Verfügbarkeit erreicht' },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Über <span className="text-purple-600 animate-gradient-x bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">mich</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            System Engineer mit Spezialisierung auf moderne IT-Infrastruktur und Cloud-Native Lösungen
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Robuste IT-Lösungen entwickeln
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Mit über 5 Jahren Erfahrung in der Systemtechnik spezialisiere ich mich auf Microsoft Intune 
              Endpoint Management, Cloud-Native Architekturen und Enterprise-Infrastrukturlösungen. 
              Meine Expertise umfasst moderne IT-Operationen, von Geräteverwaltung bis hin zu skalierbaren Cloud-Deployments.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Ich bin leidenschaftlich daran interessiert, sichere, effiziente und skalierbare IT-Lösungen zu implementieren, 
              die Organisationen dabei helfen, im digitalen Zeitalter erfolgreich zu sein. Durch kontinuierliches Lernen und 
              praktische Erfahrung mit modernsten Technologien liefere ich Lösungen, die Erwartungen übertreffen.
            </p>

            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={skill.name} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: `${400 + index * 100}ms` }}>
                  <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
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
              <h4 className="text-2xl font-bold mb-6">Meine Methodik</h4>
              <div className="space-y-4">
                {[
                  'Sicherheitsorientiertes Architekturdesign',
                  'Infrastructure as Code (IaC)',
                  'Automatisierte Deployment-Pipelines',
                  'Kontinuierliche Überwachung & Optimierung'
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
              <div className="text-3xl font-bold text-slate-900 mb-2 counter-animation">{stat.number}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;