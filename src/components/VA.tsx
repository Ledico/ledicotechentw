import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, ExternalLink, Calendar, User, BookOpen, Target, Lightbulb, CheckCircle, Award, FileText, Presentation, Camera, Video, Users, MapPin, BarChart, MessageSquare, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const VA = () => {
  const [isVisible, setIsVisible] = useState(true); // Set to true immediately
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Ensure animations are visible immediately
    setIsVisible(true);
    
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
    { icon: Target, title: "8 Hidden Gems entdeckt", description: "Erfolgreiche Erkundung unbekannter Orte in der Deutschschweiz" },
    { icon: CheckCircle, title: "2 Experteninterviews", description: "Gespräche mit Tourismusexperten und Weltreisenden" },
    { icon: Award, title: "Umfassende Dokumentation", description: "51-seitige Arbeit mit multimedialen Inhalten" },
    { icon: Lightbulb, title: "Nachhaltige Tourismusförderung", description: "Bewusstseinsschaffung für verantwortliches Reisen" }
  ];

  const chapters = [
    { title: "Einleitung und Fragestellung", pages: "1-2", endPage: 2 },
    { title: "Definition von Hidden Gems", pages: "3", endPage: 3 },
    { title: "Roadtrips", pages: "4-21", endPage: 21 },
    { title: "Interviews", pages: "22-28", endPage: 28 },
    { title: "Leitfragen", pages: "28-32", endPage: 32 },
    { title: "Umfrage", pages: "33-35", endPage: 35 },
    { title: "Fazit und Rückblick", pages: "36-37", endPage: 37 },
    { title: "Quellenverzeichnis und Anhang", pages: "38-51", endPage: 51 }
  ];

  const totalPages = 51;

  const galleryImages = [
    { 
      src: "./img/Image.jpeg", 
      alt: "Hidden Gem Entdeckung 1"
    },
    { 
      src: "./img/Image (1).jpeg", 
      alt: "Hidden Gem Entdeckung 2"
    },
    { 
      src: "./img/Image (2).jpeg", 
      alt: "Hidden Gem Entdeckung 3"
    },
    { 
      src: "./img/Image (3).jpeg", 
      alt: "Hidden Gem Entdeckung 4"
    },
    { 
      src: "./img/Image (4).jpeg", 
      alt: "Hidden Gem Entdeckung 5"
    },
    { 
      src: "./img/Image (5).jpeg", 
      alt: "Hidden Gem Entdeckung 6"
    },
    { 
      src: "./img/Luzein1.jpeg", 
      alt: "Luzein Entdeckung 1"
    },
    { 
      src: "./img/Luzein2.jpeg", 
      alt: "Luzein Entdeckung 2"
    },
    { 
      src: "./img/Luzein3.jpeg", 
      alt: "Luzein Entdeckung 3"
    }
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Auto-play slideshow with smooth transitions
  useEffect(() => {
    if (isAutoPlaying) {
      slideInterval.current = setInterval(() => {
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
        setTimeout(() => setIsTransitioning(false), 800);
      }, 5000); // 5 seconds
    } else {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    }

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isAutoPlaying, galleryImages.length]);

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = './documents/Unentdeckte Schönheiten-Leonardo_Costa.pdf';
    link.download = 'Unentdeckte_Schönheiten_Leonardo_Costa.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPPTX = () => {
    const link = document.createElement('a');
    link.href = './documents/VA_Leonardo-Costa.pptx';
    link.download = 'VA_Leonardo-Costa.pptx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-lg animate-slide-in-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-slate-700 hover:text-purple-600 transition-colors duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Zurück zum Portfolio</span>
            </button>
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-slate-900 animate-bounce" />
              <span className="text-xl font-bold text-slate-900">Leonardo Dias Costa</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-900">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full animate-pulse" style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          {/* Floating orbs */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-float"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-screen">
          <div className="text-white max-w-4xl animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20 hover:bg-white/20 transition-all duration-300 animate-bounce-in stagger-1">
              <BookOpen className="h-5 w-5 text-cyan-400 animate-spin-slow" />
              <span className="text-sm font-medium">Vertiefungsarbeit 2024/2025</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold mb-8 leading-tight">
              <span className="block text-white animate-slide-in-left stagger-2">{projectDetails.title}</span>
              <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x animate-slide-in-right stagger-3">
                {projectDetails.subtitle}
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl leading-relaxed animate-fade-in-up stagger-4">
              Eine Reise zu den versteckten Juwelen der Deutschschweiz - 
              Entdeckung unbekannter Orte abseits des Massentourismus
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start mb-12 animate-slide-in-left stagger-5">
              <div className="flex items-center space-x-6 text-white/70">
                <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300 hover:scale-105">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{projectDetails.author}</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300 hover:scale-105">
                  <Calendar className="h-5 w-5" />
                  <span>{projectDetails.date}</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300 hover:scale-105">
                  <Award className="h-5 w-5 text-yellow-400 animate-pulse" />
                  <span className="font-semibold text-yellow-400">Note: {projectDetails.grade}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-bounce-in stagger-6">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 animate-glow-pulse"
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
      </section>

      {/* Full Screen Interactive Image Slideshow with Enhanced Animations */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Entdeckte <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">Hidden Gems</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Eine visuelle Reise durch die unentdeckten Schönheiten der Deutschschweiz
            </p>
          </div>

          {/* Enhanced Slideshow Container with Smooth Animations */}
          <div className="relative animate-slide-in-left">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-black/50 backdrop-blur-sm border border-white/10">
              {/* Main Image Container with Advanced Transitions */}
              <div className="relative h-[70vh] overflow-hidden">
                {/* Multiple layered images for smooth crossfade effect */}
                <div className="relative w-full h-full">
                  {galleryImages.map((image, index) => (
                    <img 
                      key={index}
                      src={image.src}
                      alt={image.alt}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-800 ease-in-out ${
                        index === currentSlide 
                          ? isTransitioning 
                            ? 'opacity-100 scale-105 blur-sm' 
                            : 'opacity-100 scale-100 blur-0'
                          : 'opacity-0 scale-95'
                      }`}
                      style={{
                        transitionDelay: index === currentSlide ? '0ms' : '200ms',
                        filter: index === currentSlide && isTransitioning ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)'
                      }}
                    />
                  ))}
                  
                  {/* Enhanced gradient overlay with animation */}
                  <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-800 ease-in-out ${
                    isTransitioning 
                      ? 'from-black/80 via-black/20 to-purple-900/30' 
                      : 'from-black/60 via-transparent to-black/20'
                  }`}></div>
                  
                  {/* Animated corner accents with enhanced effects */}
                  <div className={`absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 rounded-tl-lg transition-all duration-500 ${
                    isTransitioning ? 'border-cyan-300 animate-pulse' : 'border-purple-400/50'
                  }`}></div>
                  <div className={`absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 rounded-tr-lg transition-all duration-500 ${
                    isTransitioning ? 'border-purple-300 animate-pulse' : 'border-cyan-400/50'
                  }`} style={{ animationDelay: '100ms' }}></div>
                  <div className={`absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 rounded-bl-lg transition-all duration-500 ${
                    isTransitioning ? 'border-purple-300 animate-pulse' : 'border-purple-400/50'
                  }`} style={{ animationDelay: '200ms' }}></div>
                  <div className={`absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 rounded-br-lg transition-all duration-500 ${
                    isTransitioning ? 'border-cyan-300 animate-pulse' : 'border-cyan-400/50'
                  }`} style={{ animationDelay: '300ms' }}></div>

                  {/* Floating particles during transitions */}
                  {isTransitioning && (
                    <>
                      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-400/60 rounded-full animate-ping"></div>
                      <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping" style={{ animationDelay: '200ms' }}></div>
                      <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-purple-300/40 rounded-full animate-ping" style={{ animationDelay: '400ms' }}></div>
                    </>
                  )}
                </div>
              </div>

              {/* Enhanced Navigation Controls with Animation Feedback */}
              <button 
                onClick={prevSlide}
                disabled={isTransitioning}
                className={`absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed group ${
                  isTransitioning 
                    ? 'bg-purple-500/30 scale-110' 
                    : 'bg-white/10 hover:bg-white/20 hover:scale-110'
                }`}
              >
                <ChevronLeft className={`h-6 w-6 transition-all duration-200 ${
                  isTransitioning ? 'scale-125 text-purple-200' : 'group-hover:scale-110'
                }`} />
              </button>
              
              <button 
                onClick={nextSlide}
                disabled={isTransitioning}
                className={`absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed group ${
                  isTransitioning 
                    ? 'bg-cyan-500/30 scale-110' 
                    : 'bg-white/10 hover:bg-white/20 hover:scale-110'
                }`}
              >
                <ChevronRight className={`h-6 w-6 transition-all duration-200 ${
                  isTransitioning ? 'scale-125 text-cyan-200' : 'group-hover:scale-110'
                }`} />
              </button>

              {/* Enhanced Control Panel with Transition Effects */}
              <div className="absolute top-6 right-6 flex items-center space-x-3">
                {/* Auto-play Control with Enhanced Animation */}
                <button 
                  onClick={toggleAutoPlay}
                  className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/20 group ${
                    isAutoPlaying 
                      ? 'bg-green-500/20 hover:bg-green-500/30' 
                      : 'bg-red-500/20 hover:bg-red-500/30'
                  }`}
                >
                  {isAutoPlaying ? 
                    <Pause className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" /> : 
                    <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  }
                </button>

                {/* Enhanced Slide Counter with Transition Animation */}
                <div className={`backdrop-blur-md rounded-full px-4 py-2 text-white border border-white/20 transition-all duration-300 ${
                  isTransitioning 
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 scale-105' 
                    : 'bg-white/10'
                }`}>
                  <span className="text-sm font-medium">
                    {currentSlide + 1} / {galleryImages.length}
                  </span>
                </div>
              </div>

              {/* Enhanced Progress Bar with Smooth Animation */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div 
                  className={`h-full transition-all duration-800 ease-out ${
                    isTransitioning 
                      ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400' 
                      : 'bg-gradient-to-r from-purple-500 to-cyan-500'
                  }`}
                  style={{ 
                    width: `${((currentSlide + 1) / galleryImages.length) * 100}%`,
                    boxShadow: isTransitioning ? '0 0 20px rgba(147, 51, 234, 0.5)' : 'none'
                  }}
                ></div>
              </div>

              {/* Transition Loading Indicator */}
              {isTransitioning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Enhanced Slide Indicators with Animation */}
            <div className="flex justify-center space-x-3 mt-8">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`relative transition-all duration-500 disabled:cursor-not-allowed ${
                    index === currentSlide 
                      ? 'w-12 h-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-lg' 
                      : 'w-4 h-4 bg-white/30 hover:bg-white/50 rounded-full hover:scale-125'
                  }`}
                >
                  {index === currentSlide && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-ping opacity-75"></div>
                    </>
                  )}
                  {isTransitioning && index === currentSlide && (
                    <div className="absolute -inset-2 border-2 border-purple-400/50 rounded-full animate-spin"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview - Only Objectives */}
      <section ref={sectionRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
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
                <div className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-all duration-300 hover:scale-105 animate-bounce-in stagger-1">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{projectDetails.duration}</div>
                  <div className="text-sm text-slate-600">Projektdauer</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-all duration-300 hover:scale-105 animate-bounce-in stagger-2">
                  <div className="text-2xl font-bold text-purple-600 mb-1">51 Seiten</div>
                  <div className="text-sm text-slate-600">Dokumentation</div>
                </div>
              </div>
            </div>

            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8 text-white hover:scale-105 transition-transform duration-300 shadow-xl animate-glow-pulse">
                <h3 className="text-2xl font-bold mb-6">Projektziele</h3>
                <div className="space-y-4">
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex items-start space-x-3 hover:translate-x-2 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 animate-pulse" style={{ animationDelay: `${index * 0.5}s` }} />
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Verwendete <span className="text-purple-600 animate-gradient-x bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">Methoden</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Die verschiedenen Forschungsmethoden und Medien, die in der Vertiefungsarbeit eingesetzt wurden
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {technologies.map((tech, index) => (
                  <div 
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-slate-100 hover:border-purple-200 animate-bounce-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white hover:scale-110 transition-transform duration-300">
                        <tech.icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-slate-900">{tech.name}</h3>
                    </div>
                    <p className="text-slate-600 text-sm">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-slide-in-right">
              <div className="relative group overflow-hidden rounded-2xl">
                <img 
                  src="./img/Luzein2.jpeg" 
                  alt="Luzein - Hidden Gem Entdeckung" 
                  className="w-full h-80 object-cover shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all duration-500"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-2 animate-typewriter">Luzein Entdeckung</h3>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Wichtige <span className="text-purple-600 animate-gradient-x bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">Ergebnisse</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Die wichtigsten Erkenntnisse und Erfolge der Vertiefungsarbeit
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4 p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounce-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white flex-shrink-0 hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
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
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Dokument<span className="text-purple-600 animate-gradient-x bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">struktur</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Detaillierte Gliederung der 51-seitigen Vertiefungsarbeit
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {chapters.map((chapter, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-slate-100 hover:border-purple-200 animate-slide-in-left"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 pr-4">{chapter.title}</h3>
                  <span className="text-sm text-purple-600 font-medium animate-pulse whitespace-nowrap">S. {chapter.pages}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 h-3 rounded-full transition-all duration-2000 ease-out relative overflow-hidden"
                    style={{ 
                      width: isVisible ? `${(chapter.endPage / totalPages) * 100}%` : '0%',
                      transitionDelay: `${index * 200 + 500}ms`
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Bis Seite {chapter.endPage}</span>
                  <span>{Math.round((chapter.endPage / totalPages) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-6">Vollständige Dokumentation</h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Laden Sie die komplette Vertiefungsarbeit herunter oder betrachten Sie die Präsentation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-bounce-in stagger-1"
              >
                <FileText className="h-5 w-5" />
                <span>PDF herunterladen (51 Seiten)</span>
              </button>
              <button 
                onClick={handleDownloadPPTX}
                className="flex items-center space-x-2 px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-lg hover:bg-white/20 hover:border-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 animate-bounce-in stagger-2"
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
          <p className="text-slate-400 animate-fade-in-up">
            © 2025 Leonardo Dias Costa - Vertiefungsarbeit "Unentdeckte Schönheiten"
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VA;