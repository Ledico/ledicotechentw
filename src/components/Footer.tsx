import { Mail, MapPin, Github, Linkedin, ChevronUp, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { href: '#about', label: 'Über mich' },
    { href: '#services', label: 'Leistungen' },
    { href: '#portfolio', label: 'Projekte' },
    { href: '#certifications', label: 'Zertifikate' },
    { href: '#contact', label: 'Kontakt' },
  ];

  const serviceLinks = [
    'Microsoft Intune',
    'Windows Autopilot',
    'Microsoft 365',
    'Azure Entra ID',
    'Endpoint Security',
    'Cloud-Migration',
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Ledico', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/leonardo-dias-costa', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:leonardo@dias-costa.ch', label: 'E-Mail' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-slate-900 dark:bg-slate-950 text-slate-300 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
                <Terminal className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Leonardo Dias Costa</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              System Engineer & Cloud-Spezialist mit Fokus auf Microsoft Intune,
              Cloud-Native Loesungen und Enterprise-Systemtechnik.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-center w-10 h-10 bg-slate-800 hover:bg-cyan-600 rounded-lg transition-all duration-300 text-slate-400 hover:text-white hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Expertise</h3>
            <ul className="space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <span className="text-sm text-slate-400">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Kontakt</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:leonardo@dias-costa.ch"
                  className="flex items-center space-x-3 text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>leonardo@dias-costa.ch</span>
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Zuerich, Schweiz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Leonardo Dias Costa. Mit Leidenschaft in der Schweiz entwickelt.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200 group"
          >
            <span>Nach oben</span>
            <div className="p-1.5 bg-slate-800 group-hover:bg-cyan-600 rounded-lg transition-all duration-300 group-hover:scale-110">
              <ChevronUp className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
