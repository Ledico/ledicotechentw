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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `Betreff: ${formData.subject}\n\n${formData.message}`
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Ihre Nachricht wurde erfolgreich gesendet! Ich werde mich bald bei Ihnen melden.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorMsg = data.details?.message || data.error || 'Beim Senden der Nachricht ist ein Fehler aufgetreten.';
        setSubmitStatus({
          type: 'error',
          message: errorMsg
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: `Netzwerkfehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
      });
    } finally {
      setIsSubmitting(false);
    }
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
    { icon: Github, href: 'https://github.com/Ledico', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/leonardo-dias-costa', label: 'LinkedIn' }
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Lassen Sie uns <span className="text-purple-600 animate-gradient-x bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">vernetzen</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Bereit für Ihr nächstes Projekt? Lassen Sie uns besprechen, wie wir Ihre Ideen zum Leben erwecken können.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Kontakt aufnehmen</h3>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <a 
                  key={index}
                  href={info.href}
                  className={`flex items-center space-x-4 p-4 bg-white dark:bg-slate-700 rounded-lg hover:shadow-md transition-all duration-300 group hover:scale-105 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <info.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{info.label}</div>
                    <div className="font-medium text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">{info.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className={`mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Folgen Sie mir</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-700 rounded-lg shadow-sm hover:shadow-md hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 animate-float"
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
          <div className={`bg-white dark:bg-slate-700 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '400ms' }}>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Nachricht senden</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '600ms' }}>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="Ihr Name"
                  />
                </div>
                <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '700ms' }}>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="ihre@email.com"
                  />
                </div>
              </div>

              <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '800ms' }}>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Betreff *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Projekt-Anfrage"
                />
              </div>

              <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '900ms' }}>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nachricht *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Erzählen Sie mir von Ihrem Projekt..."
                />
              </div>

              {submitStatus && (
                <div
                  className={`p-4 rounded-lg ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: '1000ms' }}
              >
                <Send className="h-5 w-5" />
                <span>{isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-20 pt-8 border-t border-slate-200 dark:border-slate-700 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <p className="text-slate-600 dark:text-slate-400">
            © 2025 Leonardo Dias Costa. Mit Leidenschaft in der Schweiz entwickelt.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;