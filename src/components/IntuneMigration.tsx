import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Calendar, Laptop, Monitor, TrendingUp, CheckCircle, XCircle, Shield, Cloud, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

const IntuneMigration = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const projectStats = [
    { label: 'Projektdauer', value: 'Jan - Nov 2025', icon: Calendar },
    { label: 'Gesamtgeräte', value: '320+', icon: TrendingUp },
    { label: 'Lenovo Notebooks', value: '~250', icon: Laptop },
    { label: 'HP/Dell Desktops', value: '~70', icon: Monitor }
  ];

  const timeline = [
    { date: 'Januar 2025', event: 'Projektstart', description: 'Planung und Vorbereitung der Migration' },
    { date: 'Februar 2025', event: 'Windows 10 Support-Ende', description: '14. Februar - Kritisches Datum für Migration' },
    { date: 'März - Oktober 2025', event: 'Hauptmigration', description: 'Rollout von Windows 11 mit Intune & Autopilot' },
    { date: 'November 2025', event: 'Projektabschluss', description: 'Finalisierung und Dokumentation' }
  ];

  const adVsEntraId = {
    ad: [
      { pro: false, text: 'On-Premise Infrastruktur erforderlich' },
      { pro: false, text: 'Lokale Server-Wartung notwendig' },
      { pro: false, text: 'VPN für Remote-Zugriff erforderlich' },
      { pro: false, text: 'Höhere Infrastrukturkosten' },
      { pro: true, text: 'Bewährte Technologie' },
      { pro: true, text: 'Lokale Kontrolle über Daten' }
    ],
    entraId: [
      { pro: true, text: 'Cloud-basiert - überall verfügbar' },
      { pro: true, text: 'Keine Server-Wartung erforderlich' },
      { pro: true, text: 'Moderne Sicherheitsfeatures (MFA, Conditional Access)' },
      { pro: true, text: 'Nahtlose Integration mit Microsoft 365' },
      { pro: true, text: 'Automatische Updates und Patches' },
      { pro: true, text: 'Skalierbar und kosteneffizient' }
    ]
  };

  const autopilotSteps = [
    {
      title: 'Hardware-Hash Upload',
      description: 'Geräte-IDs werden in Intune registriert',
      icon: Laptop
    },
    {
      title: 'Autopilot-Profil',
      description: 'Konfiguration des Deployment-Profils',
      icon: Shield
    },
    {
      title: 'Zero-Touch Deployment',
      description: 'Benutzer startet Gerät, Autopilot übernimmt automatisch',
      icon: Cloud
    },
    {
      title: 'Automatische Konfiguration',
      description: 'Apps, Richtlinien und Einstellungen werden automatisch angewendet',
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link
          to="/"
          className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Zurück zur Übersicht
        </Link>

        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Intune Windows 11 Migration & <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Autopilot</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl">
            Umfassende Migration von über 320 Geräten von Windows 10 zu Windows 11 mit Microsoft Intune und Entra ID
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {projectStats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-500 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-3" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className={`bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-blue-600" />
            Projekt Timeline
          </h2>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start group hover:scale-105 transition-transform duration-300">
                <div className="flex-shrink-0 w-32 text-sm font-semibold text-blue-600 dark:text-blue-400 pt-1">
                  {item.date}
                </div>
                <div className="flex-grow border-l-4 border-blue-600 dark:border-blue-400 pl-6 pb-6 group-hover:border-cyan-500 transition-colors duration-300">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.event}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-16 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-blue-600" />
            Active Directory vs. Entra ID
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <Server className="h-6 w-6 mr-2 text-slate-600 dark:text-slate-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Directory (Alt)</h3>
              </div>
              <div className="space-y-3">
                {adVsEntraId.ad.map((item, index) => (
                  <div key={index} className="flex items-start group">
                    {item.pro ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-6">
                <Cloud className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Entra ID (Neu)</h3>
              </div>
              <div className="space-y-3">
                {adVsEntraId.entraId.map((item, index) => (
                  <div key={index} className="flex items-start group">
                    {item.pro ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              <strong>Migration:</strong> Alle Geräte wurden von Active Directory auf Entra ID (Azure AD) migriert,
              um moderne Cloud-basierte Verwaltung und verbesserte Sicherheitsfunktionen zu nutzen.
            </p>
          </div>
        </div>

        <div className={`bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
            <Laptop className="h-8 w-8 mr-3 text-blue-600" />
            Windows Autopilot Deployment
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Windows Autopilot ermöglicht Zero-Touch Deployment für neue Geräte - vom Auspacken bis zum produktiven Einsatz ohne manuelle IT-Intervention.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {autopilotSteps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600 p-6 rounded-xl border border-blue-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-4">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
                {index < autopilotSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-0.5 bg-blue-300 dark:bg-blue-700"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Vorteile
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li>• Keine manuelle Installation</li>
                <li>• Konsistente Konfiguration</li>
                <li>• Zeitersparnis für IT-Team</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Sicherheit
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li>• Automatische Verschlüsselung</li>
                <li>• Compliance-Richtlinien</li>
                <li>• Sichere Identität via Entra ID</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Effizienz
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li>• 75% schnellere Bereitstellung</li>
                <li>• Reduzierte Fehlerquote</li>
                <li>• Bessere User Experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntuneMigration;
