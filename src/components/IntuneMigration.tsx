import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Calendar, Laptop, Monitor, TrendingUp, CheckCircle, XCircle, Shield, Cloud, Server, Zap, FileText, Package, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

const IntuneMigration = () => {
  usePageTitle('Intune Windows 11 Migration');
  const [isVisible, setIsVisible] = useState(true);
  const [counters, setCounters] = useState({ devices: 0, notebooks: 0, desktops: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const deviceTarget = 340;
      const notebookTarget = 300;
      const desktopTarget = 40;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setCounters({
          devices: Math.floor(deviceTarget * progress),
          notebooks: Math.floor(notebookTarget * progress),
          desktops: Math.floor(desktopTarget * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setCounters({ devices: deviceTarget, notebooks: notebookTarget, desktops: desktopTarget });
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const projectStats = [
    { label: 'Projektdauer', value: 'Jan - Nov 2025', icon: Calendar, isCounter: false },
    { label: 'Gesamtgeräte', value: '340', icon: TrendingUp, isCounter: true, counterKey: 'devices' },
    { label: 'Lenovo Notebooks', value: '300', icon: Laptop, isCounter: true, counterKey: 'notebooks' },
    { label: 'HP/Dell Desktops', value: '40', icon: Monitor, isCounter: true, counterKey: 'desktops' }
  ];

  const timeline = [
    { date: 'Januar 2025', event: 'Projektstart', description: 'Planung und Vorbereitung der Migration' },
    { date: 'März - August 2025', event: 'Vorbereitungsphase', description: 'Infrastruktur-Setup, Autopilot-Konfiguration und Testing' },
    { date: 'September - November 2025', event: 'Hauptmigration', description: 'Rollout von Windows 11 mit Intune & Autopilot für ca. 300 Notebooks und ca. 40 Desktops' },
    { date: '14. Oktober 2025', event: 'Windows 10 Support-Ende', description: 'Kritisches Datum - Ende des offiziellen Supports' },
    { date: 'November 2025', event: 'Projektabschluss', description: 'Finalisierung und Dokumentation' }
  ];

  const migrationComponents = [
    {
      id: 'identity',
      title: 'Identitätsverwaltung',
      icon: Shield,
      old: { name: 'Active Directory', tech: 'AD' },
      new: { name: 'Entra ID', tech: 'Azure AD' },
      description: 'Von On-Premise zu Cloud-basierter Identitätsverwaltung'
    },
    {
      id: 'configuration',
      title: 'Gerätekonfiguration',
      icon: Settings,
      old: { name: 'Group Policy', tech: 'GPO' },
      new: { name: 'Configuration Profiles', tech: 'Intune' },
      description: 'Von Domain Policies zu Cloud-basierten Konfigurationsprofilen'
    },
    {
      id: 'apps',
      title: 'Softwareverteilung',
      icon: Package,
      old: { name: 'Netkey', tech: 'On-Premise' },
      new: { name: 'Company Portal', tech: 'Cloud' },
      description: 'Von zentraler Installation zu Self-Service für Endbenutzer'
    },
    {
      id: 'security',
      title: 'Endpoint Protection',
      icon: Shield,
      old: { name: 'Sophos', tech: 'Drittanbieter' },
      new: { name: 'Defender for Endpoint', tech: 'Microsoft' },
      description: 'Von Drittanbieter zu nativer Windows-Security'
    }
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

  const gpVsConfigProfiles = {
    gp: [
      { pro: false, text: 'Erfordert Active Directory Domain Controller' },
      { pro: false, text: 'Nur für domain-joined Geräte verfügbar' },
      { pro: false, text: 'Komplexe Fehlersuche bei Anwendungsproblemen' },
      { pro: false, text: 'Keine native Mobile Device Management Unterstützung' },
      { pro: true, text: 'Umfangreiche Konfigurationsmöglichkeiten' },
      { pro: true, text: 'Etablierte Verwaltungsmethode' }
    ],
    configProfiles: [
      { pro: true, text: 'Cloud-basiert - keine Domain erforderlich' },
      { pro: true, text: 'Unterstützt Azure AD Joined und Hybrid Joined Geräte' },
      { pro: true, text: 'Zentrale Verwaltung über Intune Portal' },
      { pro: true, text: 'Real-time Reporting und Compliance Status' },
      { pro: true, text: 'Plattformübergreifend (Windows, macOS, iOS, Android)' },
      { pro: true, text: 'Automatisches Deployment bei Enrollment' }
    ]
  };

  const netkeyVsCompanyPortal = {
    netkey: [
      { pro: false, text: 'On-Premise Server erforderlich' },
      { pro: false, text: 'Manuelle Paketpflege und Updates' },
      { pro: false, text: 'Begrenzte Self-Service Möglichkeiten für User' },
      { pro: false, text: 'Komplexe Lizenzierung und Wartung' },
      { pro: true, text: 'Lokale Kontrolle über Software-Pakete' },
      { pro: true, text: 'Etabliertes System in der Organisation' }
    ],
    companyPortal: [
      { pro: true, text: 'Cloud-basiert - keine Server-Infrastruktur nötig' },
      { pro: true, text: 'Self-Service App-Installation für Endbenutzer' },
      { pro: true, text: 'Automatische App-Updates über Intune' },
      { pro: true, text: 'Zentrale App-Verwaltung im Microsoft Endpoint Manager' },
      { pro: true, text: 'Integration mit Microsoft Store for Business' },
      { pro: true, text: 'Verfügbarkeits- und Compliance-Reporting' }
    ]
  };

  const sophosVsDefender = {
    sophos: [
      { pro: false, text: 'Zusätzliche Lizenzkosten erforderlich' },
      { pro: false, text: 'Separate Management-Konsole notwendig' },
      { pro: false, text: 'Drittanbieter-Integration mit zusätzlichem Aufwand' },
      { pro: false, text: 'Potenzielle Konflikte mit Windows-eigener Security' },
      { pro: true, text: 'Bewährte Endpoint Protection Lösung' },
      { pro: true, text: 'Umfangreiche Threat Protection Features' }
    ],
    defender: [
      { pro: true, text: 'In Microsoft 365 E5 / Windows 11 Pro enthalten' },
      { pro: true, text: 'Native Integration in Windows Betriebssystem' },
      { pro: true, text: 'Zentrale Verwaltung über Microsoft Defender Portal' },
      { pro: true, text: 'Advanced Threat Protection (ATP) inklusive' },
      { pro: true, text: 'Automatische Updates ohne Zusatzkosten' },
      { pro: true, text: 'Zero-Touch Deployment mit Intune' }
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
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-12 md:py-20">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 sm:mb-6 md:mb-8 transition-all duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm sm:text-base group-hover:underline">Zurück zur Übersicht</span>
        </Link>

        <div className={`mb-6 sm:mb-10 md:mb-16 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 leading-tight">
            Intune Windows 11 Migration & <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Autopilot</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-3 sm:mb-4 leading-relaxed">
            Komplette Endpoint-Management-Lösung mit Geräte-Compliance, Sicherheitsrichtlinien und Cloud-Native Architektur für moderne, skalierbare und ausfallsichere IT-Infrastruktur
          </p>
          <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg shadow-md text-sm sm:text-base">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="font-semibold">Projekt durchgeführt bei SUISA</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-10 md:mb-16">
          {projectStats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-slate-800 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 cursor-pointer ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400 mb-2 sm:mb-3" />
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.isCounter ? counters[stat.counterKey as keyof typeof counters] : stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className={`bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border border-blue-200 dark:border-slate-600 mb-6 sm:mb-10 md:mb-16 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 md:mb-6 flex items-center">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 mr-2 sm:mr-3 text-blue-600" />
            Migrationsstrategie im Überblick
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 mb-3 sm:mb-4 leading-relaxed">
            Die Migration bei der SUISA umfasst vier zentrale Bereiche, die alle von traditionellen On-Premise-Lösungen zu modernen Cloud-basierten Microsoft-Services überführt werden. Dieses Projekt vereint Microsoft Intune Management, Cloud-Native Architektur, Infrastruktur-Engineering, Sicherheit & Compliance sowie DevOps & Automatisierung.
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm italic">
            Als IT-Systemadministrator bei der SUISA habe ich dieses umfassende Migrationsprojekt eigenständig geplant, koordiniert und durchgeführt - von der Geräte-Registrierung über Infrastructure as Code bis hin zur Zero Trust Architektur und Compliance-Auditing.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {migrationComponents.map((component, index) => (
              <div
                key={component.id}
                className={`bg-white dark:bg-slate-800 p-6 rounded-xl border border-blue-200 dark:border-slate-600 hover:shadow-xl transition-all duration-500 hover:scale-105 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <component.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{component.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-600 dark:text-red-400 font-medium">{component.old.name}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">{component.new.name}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{component.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-16 transition-all duration-1000 delay-400 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-blue-600 animate-pulse" />
            Projekt Timeline
          </h2>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`flex items-start group hover:scale-105 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-32 md:w-40 text-sm font-semibold text-blue-600 dark:text-blue-400 pt-1 group-hover:text-cyan-500 transition-colors duration-300">
                  {item.date}
                </div>
                <div className="relative flex-grow border-l-4 border-blue-600 dark:border-blue-400 pl-6 pb-6 group-hover:border-cyan-500 transition-colors duration-300">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full group-hover:scale-150 group-hover:bg-cyan-500 transition-all duration-300"></div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{item.event}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-16 transition-all duration-1000 delay-600 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-blue-600" />
            1. Identitätsverwaltung: Active Directory → Entra ID
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Grundlage der Cloud-Transformation: Migration von lokaler Active Directory-Infrastruktur zu Azure Entra ID für moderne, cloud-basierte Identitätsverwaltung mit Zero Trust Architektur und Identity Management.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="transform transition-all duration-500 hover:scale-105">
              <div className="flex items-center mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <Server className="h-6 w-6 mr-2 text-slate-600 dark:text-slate-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Directory (Alt)</h3>
              </div>
              <div className="space-y-3">
                {adVsEntraId.ad.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
                    style={{ transitionDelay: `${900 + index * 50}ms` }}
                  >
                    {item.pro ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    )}
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="transform transition-all duration-500 hover:scale-105">
              <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                <Cloud className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Entra ID (Neu)</h3>
              </div>
              <div className="space-y-3">
                {adVsEntraId.entraId.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start group p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
                    style={{ transitionDelay: `${900 + index * 50}ms` }}
                  >
                    {item.pro ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    )}
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-16 transition-all duration-1000 delay-800 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Settings className="h-8 w-8 mr-3 text-blue-600" />
            2. Gerätekonfiguration: Group Policy → Configuration Profiles
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Cloud-basierte Geräteverwaltung: Ablösung von klassischen Group Policies durch moderne Intune Configuration Profiles mit Infrastructure as Code und Konfigurationsmanagement für flexible Verwaltung aller Geräte.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="transform transition-all duration-500 hover:scale-105">
              <div className="flex items-center mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <FileText className="h-6 w-6 mr-2 text-slate-600 dark:text-slate-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Group Policy (Alt)</h3>
              </div>
              <div className="space-y-3">
                {gpVsConfigProfiles.gp.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
                    style={{ transitionDelay: `${1400 + index * 50}ms` }}
                  >
                    {item.pro ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    )}
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="transform transition-all duration-500 hover:scale-105">
              <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                <Settings className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Configuration Profiles (Neu)</h3>
              </div>
              <div className="space-y-3">
                {gpVsConfigProfiles.configProfiles.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start group p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
                    style={{ transitionDelay: `${1400 + index * 50}ms` }}
                  >
                    {item.pro ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    )}
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-16 transition-all duration-1000 delay-1000 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Package className="h-8 w-8 mr-3 text-blue-600" />
            3. Softwareverteilung: Netkey → Company Portal
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Self-Service Revolution: Umstellung von zentraler Softwareverteilung via Netkey zu benutzerfreundlichem Self-Service über Microsoft Company Portal mit automatisierten CI/CD Pipelines und App-Management.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="transform transition-all duration-500 hover:scale-105">
              <div className="flex items-center mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <Server className="h-6 w-6 mr-2 text-slate-600 dark:text-slate-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Netkey (Alt)</h3>
              </div>
              <div className="space-y-3">
                {netkeyVsCompanyPortal.netkey.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
                    style={{ transitionDelay: `${1700 + index * 50}ms` }}
                  >
                    {item.pro ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    )}
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="transform transition-all duration-500 hover:scale-105">
              <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                <Package className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Company Portal (Neu)</h3>
              </div>
              <div className="space-y-3">
                {netkeyVsCompanyPortal.companyPortal.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start group p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
                    style={{ transitionDelay: `${1700 + index * 50}ms` }}
                  >
                    {item.pro ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    )}
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-16 transition-all duration-1000 delay-1200 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-blue-600" />
            4. Endpoint Protection: Sophos → Microsoft Defender for Endpoint
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Native Security-Integration: Wechsel von Drittanbieter-Lösung Sophos zu Microsoft Defender for Endpoint für nahtlose Windows-Integration, erweiterte Threat Protection, Sicherheitsüberwachung und Compliance-Auditing.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="transform transition-all duration-500 hover:scale-105">
              <div className="flex items-center mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <Shield className="h-6 w-6 mr-2 text-slate-600 dark:text-slate-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sophos (Alt)</h3>
              </div>
              <div className="space-y-3">
                {sophosVsDefender.sophos.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
                    style={{ transitionDelay: `${2000 + index * 50}ms` }}
                  >
                    {item.pro ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    )}
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="transform transition-all duration-500 hover:scale-105">
              <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                <Shield className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Microsoft Defender (Neu)</h3>
              </div>
              <div className="space-y-3">
                {sophosVsDefender.defender.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start group p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
                    style={{ transitionDelay: `${2000 + index * 50}ms` }}
                  >
                    {item.pro ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                    )}
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-1000 delay-1400 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Laptop className="h-8 w-8 mr-3 text-blue-600" />
            Windows Autopilot Deployment
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Zero-Touch Bereitstellung: Windows Autopilot ermöglicht vollautomatische Gerätekonfiguration vom Auspacken bis zum produktiven Einsatz mit automatisiertem Deployment, Monitoring & Alerting - ohne manuelle IT-Intervention.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {autopilotSteps.map((step, index) => (
              <div
                key={index}
                className={`relative group ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  transitionDelay: `${1600 + index * 150}ms`,
                  animation: isVisible ? `float 3s ease-in-out ${index * 0.5}s infinite` : 'none'
                }}
              >
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600 p-6 rounded-xl border border-blue-200 dark:border-slate-600 hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-2">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-lg mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-125 transition-transform duration-300">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
                {index < autopilotSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-0.5 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600 animate-pulse" />
                Vorteile
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="hover:translate-x-2 transition-transform duration-200">• Keine manuelle Installation</li>
                <li className="hover:translate-x-2 transition-transform duration-200">• Konsistente Konfiguration</li>
                <li className="hover:translate-x-2 transition-transform duration-200">• Zeitersparnis für IT-Team</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600 animate-pulse" />
                Sicherheit
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="hover:translate-x-2 transition-transform duration-200">• Automatische Verschlüsselung</li>
                <li className="hover:translate-x-2 transition-transform duration-200">• Compliance-Richtlinien</li>
                <li className="hover:translate-x-2 transition-transform duration-200">• Sichere Identität via Entra ID</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-orange-600 animate-pulse" />
                Effizienz
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="hover:translate-x-2 transition-transform duration-200">• 75% schnellere Bereitstellung</li>
                <li className="hover:translate-x-2 transition-transform duration-200">• Reduzierte Fehlerquote</li>
                <li className="hover:translate-x-2 transition-transform duration-200">• Bessere User Experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default IntuneMigration;
