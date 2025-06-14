import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, ExternalLink, Calendar, User, BookOpen, Target, Lightbulb, CheckCircle, Award, FileText, Presentation } from 'lucide-react';

const VA = () => {
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

  const projectDetails = {
    title: "Automatisierung der Geräteverwaltung mit Microsoft Intune",
    subtitle: "Eine umfassende Lösung für Enterprise Device Management",
    author: "Leonardo Dias Costa",
    date: "2024",
    school: "Berufsfachschule für Informatik",
    duration: "6 Monate",
    grade: "5.8/6.0"
  };

  const objectives = [
    "Implementierung einer vollständig automatisierten Geräteverwaltung",
    "Entwicklung von Compliance-Richtlinien für Enterprise-Umgebungen",
    "Integration von Zero Trust Security Prinzipien",
    "Optimierung der Benutzerfreundlichkeit und Produktivität"
  ];

  const technologies = [
    { name: "Microsoft Intune", description: "Endpoint Management Platform" },
    { name: "Azure Active Directory", description: "Identity & Access Management" },
    { name: "PowerShell", description: "Automatisierung & Scripting" },
    { name: "Microsoft Graph API", description: "Cloud Service Integration" },
    { name: "Windows Autopilot", description: "Device Provisioning" },
    { name: "Conditional Access", description: "Security Policies" }
  ];

  const achievements = [
    { icon: Target, title: "99.5% Deployment Success Rate", description: "Erfolgreiche Automatisierung der Gerätebereitstellung" },
    { icon: CheckCircle, title: "50% Reduzierung der Setup-Zeit", description: "Optimierte Prozesse für schnellere Implementierung" },
    { icon: Award, title: "Zero Security Incidents", description: "Robuste Sicherheitsarchitektur implementiert" },
    { icon: Lightbulb, title: "Innovative Lösungsansätze", description: "Entwicklung maßgeschneiderter Automatisierungsscripts" }
  ];

  const chapters = [
    { title: "Einleitung & Problemstellung", pages: "1-8" },
    { title: "Theoretische Grundlagen", pages: "9-22" },
    { title: "Analyse bestehender Systeme", pages: "23-35" },
    { title: "Konzeptentwicklung", pages: "36-48" },
    { title: "Implementierung", pages: "49-67" },
    { title: "Testing & Validierung", pages: "68-78" },
    { title: "Ergebnisse & Evaluation", pages: "79-89" },
    { title: "Fazit & Ausblick", pages: "90-95" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-slate-700 hover:text-purple-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Zurück zum Portfolio</span>
            </button>
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-slate-900" />
              <span className="text-xl font-bold text-slate-900">Leonardo Dias Costa</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Vertiefungsarbeit 2024</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              {projectDetails.title}
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-4xl mx-auto">
              {projectDetails.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-4 text-white/80">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{projectDetails.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{projectDetails.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>Note: {projectDetails.grade}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section ref={sectionRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Projektübersicht</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Diese Vertiefungsarbeit behandelt die umfassende Automatisierung der Geräteverwaltung 
                in Enterprise-Umgebungen mittels Microsoft Intune. Das Projekt demonstriert moderne 
                Ansätze für Device Management, Security Compliance und Benutzerfreundlichkeit.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Durch die Implementierung von Zero Trust Prinzipien und automatisierten Deployment-Prozessen 
                wurde eine skalierbare Lösung entwickelt, die sowohl Sicherheitsanforderungen als auch 
                operative Effizienz erfüllt.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{projectDetails.duration}</div>
                  <div className="text-sm text-slate-600">Projektdauer</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">95 Seiten</div>
                  <div className="text-sm text-slate-600">Dokumentation</div>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Projektziele</h3>
                <div className="space-y-4">
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Used */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Verwendete <span className="text-purple-600">Technologien</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Moderne Microsoft-Technologien für Enterprise Device Management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <div 
                key={index}
                className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-purple-200 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{tech.name}</h3>
                <p className="text-slate-600 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Wichtige <span className="text-purple-600">Ergebnisse</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Messbare Erfolge und Innovationen des Projekts
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-4 p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white flex-shrink-0">
                  <achievement.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{achievement.title}</h3>
                  <p className="text-slate-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Structure */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Dokument<span className="text-purple-600">struktur</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Detaillierte Gliederung der 95-seitigen Vertiefungsarbeit
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {chapters.map((chapter, index) => (
              <div 
                key={index}
                className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-purple-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">{chapter.title}</h3>
                  <span className="text-sm text-purple-600 font-medium">S. {chapter.pages}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: isVisible ? `${((index + 1) / chapters.length) * 100}%` : '0%',
                      transitionDelay: `${index * 200 + 500}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold mb-6">Vollständige Dokumentation</h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Laden Sie die komplette Vertiefungsarbeit herunter oder betrachten Sie die Präsentation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center space-x-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <Download className="h-5 w-5" />
                <span>PDF herunterladen</span>
              </button>
              <button className="flex items-center space-x-2 px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-lg hover:bg-white/20 hover:border-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <Presentation className="h-5 w-5" />
                <span>Präsentation ansehen</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">
            © 2024 Leonardo Dias Costa - Vertiefungsarbeit Automatisierung der Geräteverwaltung
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VA;