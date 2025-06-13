import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'E-Mail',
      value: 'leonardo@dias-costa.ch',
      href: 'mailto:leonardo@dias-costa.ch'
    },
    {
      icon: MapPin,
      label: 'Standort',
      value: 'Zürich'
    }
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Lassen Sie uns <span className="text-purple-600 animate-gradient-x bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">vernetzen</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Bereit für Ihr nächstes Projekt? Lassen Sie uns besprechen, wie wir Ihre Ideen zum Leben erwecken können.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Kontakt aufnehmen</h3>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <a 
                  key={index}
                  href={info.href}
                  className={`flex items-center space-x-4 p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 group hover:scale-105 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <info.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">{info.label}</div>
                    <div className="font-medium text-slate-900 group-hover:text-purple-600 transition-colors duration-300">{info.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className={`mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Folgen Sie mir</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm hover:shadow-md hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-slate-600 hover:text-purple-600 animate-float"
                    style={{ animationDelay: `${index * 0.3}s` }}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className={`mt-12 p-6 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '800ms' }}>
              <h4 className="text-lg font-semibold mb-2">Bereit zu starten?</h4>
              <p className="text-white/90">
                Ich freue mich immer darauf, an neuen Projekten zu arbeiten und mit großartigen Menschen zusammenzuarbeiten. 
                Lassen Sie uns gemeinsam etwas Außergewöhnliches schaffen!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '400ms' }}>
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Nachricht senden</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '600ms' }}>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300"
                    placeholder="Ihr Name"
                  />
                </div>
                <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '700ms' }}>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300"
                    placeholder="ihre@email.com"
                  />
                </div>
              </div>

              <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '800ms' }}>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                  Betreff *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300"
                  placeholder="Projekt-Anfrage"
                />
              </div>

              <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '900ms' }}>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Nachricht *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none hover:border-purple-300"
                  placeholder="Erzählen Sie mir von Ihrem Projekt..."
                />
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 animate-pulse-glow ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: '1000ms' }}
              >
                <Send className="h-5 w-5" />
                <span>Nachricht senden</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-20 pt-8 border-t border-slate-200 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <p className="text-slate-600">
            © 2024 Leonardo Dias Costa. Mit Leidenschaft in der Schweiz entwickelt.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;