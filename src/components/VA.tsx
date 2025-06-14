import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, ExternalLink, Calendar, User, BookOpen, Target, Lightbulb, CheckCircle, Award, FileText, Presentation, Camera, Video, Users, MapPin, BarChart, MessageSquare } from 'lucide-react';

const VA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
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
    title: "Unentdeckte Schönheiten",
    subtitle: "Orte Abseits des Tourismus",
    author: "Leonardo Dias Costa",
    date: "2024/2025",
    school: "Technische Berufsschule Zürich TBZ",
    duration: "6 Monate",
    grade: "6.0"
  };

  const objectives = [
    "Entdeckung unbekannter Orte in der Deutschschweiz",
    "Untersuchung der Merkmale von 'Hidden Gems'",
    "Förderung nachhaltigen Tourismus",
    "Multimediale Dokumentation und Meinungsvielfalt"
  ];

  const technologies = [
    { name: "Fotografie", description: "Professionelle Dokumentation der entdeckten Orte", icon: Camera },
    { name: "Videoaufnahmen", description: "Multimediale Präsentation der Hidden Gems", icon: Video },
    { name: "Umfrage", description: "Meinungsforschung zu Reisegewohnheiten", icon: BarChart },
    { name: "Interviews", description: "Expertengespräche mit Tourismusexperten", icon: MessageSquare },
    { name: "Recherche", description: "Statistische Analyse der Tourismusdaten", icon: BookOpen },
    { name: "Google Maps", description: "Kartierung und Navigation zu den Orten", icon: MapPin }
  ];

  const achievements = [
    { icon: Target, title: "4 Hidden Gems entdeckt", description: "Erfolgreiche Erkundung unbekannter Orte in der Deutschschweiz" },
    { icon: CheckCircle, title: "2 Experteninterviews", description: "Gespräche mit Tourismusexperten und Weltreisenden" },
    { icon: Award, title: "Umfassende Dokumentation", description: "51-seitige Arbeit mit multimedialen Inhalten" },
    { icon: Lightbulb, title: "Nachhaltige Tourismusförderung", description: "Bewusstseinsschaffung für verantwortliches Reisen" }
  ];

  const chapters = [
    { title: "Einleitung und Fragestellung", pages: "1-2" },
    { title: "Definition von Hidden Gems", pages: "3" },
    { title: "Roadtrips", pages: "4-21" },
    { title: "Interviews", pages: "22-28" },
    { title: "Leitfragen", pages: "28-32" },
    { title: "Umfrage", pages: "33-35" },
    { title: "Fazit und Rückblick", pages: "36-37" },
    { title: "Quellenverzeichnis und Anhang", pages: "38-51" }
  ];

  const galleryImages = [
    { src: "/img/Image.jpeg", alt: "Hidden Gem Entdeckung 1", title: "Versteckte Schönheit" },
    { src: "/img/Image (1).jpeg", alt: "Hidden Gem Entdeckung 2", title: "Naturparadies" },
    { src: "/img/Image (2).jpeg", alt: "Hidden Gem Entdeckung 3", title: "Unberührte Landschaft" },
    { src: "/img/Image (3).jpeg", alt: "Hidden Gem Entdeckung 4", title: "Geheimtipp" },
    { src: "/img/Image (4).jpeg", alt: "Hidden Gem Entdeckung 5", title: "Abseits der Pfade" },
    { src: "/img/Image (5).jpeg", alt: "Hidden Gem Entdeckung 6", title: "Ruheoase" },
    { src: "/img/Image (6).jpeg", alt: "Hidden Gem Entdeckung 7", title: "Naturjuwel" },
    { src: "/img/Luzein3.jpeg", alt: "Luzein Entdeckung 3", title: "Luzein Hidden Gem" },
    { src: "/img/Luzein2.jpeg", alt: "Luzein Entdeckung 2", title: "Luzein Naturschönheit" },
    { src: "/img/Luzein1.jpeg", alt: "Luzein Entdeckung 1", title: "Luzein Geheimtipp" }
  ];

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/src/documents/Unentdeckte Schönheiten-Leonardo_Costa.pdf';
    link.download = 'Unentdeckte_Schönheiten_Leonardo_Costa.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPPTX = () => {
    const link = document.createElement('a');
    link.href = '/src/documents/VA_Leonardo-Costa.pptx';
    link.download = 'VA_Leonardo-Costa.pptx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* Modern Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-900">
          {/* Simple pattern overlay instead of complex SVG */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-screen">
          <div className={`text-white max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <span className="text-sm font-medium">Vertiefungsarbeit 2024/2025</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold mb-8 leading-tight">
              <span className="block text-white">{projectDetails.title}</span>
              <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                {projectDetails.subtitle}
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl leading-relaxed">
              Eine Reise zu den versteckten Juwelen der Deutschschweiz - 
              Entdeckung unbekannter Orte abseits des Massentourismus
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start mb-12">
              <div className="flex items-center space-x-6 text-white/70">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{projectDetails.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{projectDetails.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">Note: {projectDetails.grade}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FileText className="h-5 w-5" />
                <span>PDF ansehen</span>
              </button>
              <button 
                onClick={handleDownloadPPTX}
                className="flex items-center space-x-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Presentation className="h-5 w-5" />
                <span>Präsentation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-purple-400/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-cyan-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-purple-300/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Project Overview - Only Objectives */}
      <section ref={sectionRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Projektübersicht</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Am 25. Oktober 2024 habe ich meine Vertiefungsarbeit begonnen. Ziel ist es, weniger bekannte Orte 
                in der Deutschschweiz zu erforschen und ihre Besonderheiten aufzuzeigen. Die Arbeit umfasst 
                8 Schulwochen und gliedert sich in Prozess, Produkt und Präsentation. 
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Ich führe Roadtrips durch, dokumentiere die Orte fotografisch und in einem Video, führe zwei Interviews 
                (mit einem Tourismusexperten und einer Weltreisenden) und starte eine Umfrage. Zudem analysiere ich 
                statistische Daten zur Tourismusentwicklung in der Schweiz.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{projectDetails.duration}</div>
                  <div className="text-sm text-slate-600">Projektdauer</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">51 Seiten</div>
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

      {/* Image Gallery Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Entdeckte <span className="text-purple-600">Hidden Gems</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Eine visuelle Reise durch die unentdeckten Schönheiten der Deutschschweiz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.slice(0, 9).map((image, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          {/* Featured Large Image */}
          <div className={`mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="/img/Image (6).jpeg" 
                alt="Hauptbild der Vertiefungsarbeit" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-cyan-900/60 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-3xl font-bold mb-4">Unentdeckte Schönheiten</h3>
                  <p className="text-xl text-white/90 max-w-2xl">
                    Eine Reise zu den versteckten Juwelen der Deutschschweiz
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Used */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Verwendete <span className="text-purple-600">Methoden</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Die verschiedenen Forschungsmethoden und Medien, die in der Vertiefungsarbeit eingesetzt wurden
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {technologies.map((tech, index) => (
                  <div 
                    key={index}
                    className={`bg-slate-50 p-4 rounded-xl hover:bg-slate-100 transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white">
                        <tech.icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-slate-900">{tech.name}</h3>
                    </div>
                    <p className="text-slate-600 text-sm">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <img 
                  src="/img/Luzein3.jpeg" 
                  alt="Luzein - Hidden Gem Entdeckung" 
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Luzein Entdeckung</h3>
                  <p className="text-white/90">
                    Eines der entdeckten Hidden Gems in der Deutschschweiz
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Wichtige <span className="text-purple-600">Ergebnisse</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Die wichtigsten Erkenntnisse und Erfolge der Vertiefungsarbeit
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Dokument<span className="text-purple-600">struktur</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Detaillierte Gliederung der 51-seitigen Vertiefungsarbeit
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {chapters.map((chapter, index) => (
              <div 
                key={index}
                className={`bg-slate-50 p-6 rounded-xl hover:bg-slate-100 transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
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
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <FileText className="h-5 w-5" />
                <span>PDF herunterladen (51 Seiten)</span>
              </button>
              <button 
                onClick={handleDownloadPPTX}
                className="flex items-center space-x-2 px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-lg hover:bg-white/20 hover:border-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Presentation className="h-5 w-5" />
                <span>Präsentation herunterladen</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">
            © 2025 Leonardo Dias Costa - Vertiefungsarbeit "Unentdeckte Schönheiten"
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VA;