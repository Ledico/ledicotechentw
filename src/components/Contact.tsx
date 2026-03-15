import { useEffect, useRef, useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Linkedin, Github } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Bitte fülle alle Pflichtfelder aus.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Kein Betreff',
        message: formData.message,
      });

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setErrorMsg('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Kontakt <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">aufnehmen</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Haben Sie ein spannendes Projekt oder eine Frage? Ich freue mich auf Ihre Nachricht.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-white mb-6">Schreib mir</h3>
            <p className="text-slate-400 leading-relaxed mb-8">
              Ob für Zusammenarbeit, technische Fragen oder einfach zum Netzwerken — ich bin immer offen für
              interessante Gespräche.
            </p>

            <div className="space-y-4 mb-8">
              <a
                href="mailto:leonardorafael.costa04@gmail.com"
                className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-200 group"
              >
                <div className="p-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">E-Mail</p>
                  <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">leonardorafael.costa04@gmail.com</p>
                </div>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-200 group"
              >
                <div className="p-2.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                  <Linkedin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">LinkedIn</p>
                  <p className="text-white font-medium group-hover:text-blue-400 transition-colors">Leonardo Costa</p>
                </div>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-500/50 hover:bg-slate-800/80 transition-all duration-200 group"
              >
                <div className="p-2.5 bg-slate-700 rounded-lg">
                  <Github className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">GitHub</p>
                  <p className="text-white font-medium group-hover:text-slate-300 transition-colors">GitHub Profil</p>
                </div>
              </a>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-800 rounded-2xl border border-green-800">
                <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Nachricht gesendet!</h3>
                <p className="text-slate-400 mb-6">Vielen Dank! Ich werde mich so schnell wie möglich bei dir melden.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all"
                >
                  Neue Nachricht
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 bg-slate-800 p-6 rounded-2xl border border-slate-700">
                {status === 'error' && (
                  <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Dein Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">E-Mail *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="deine@email.ch"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Betreff</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Worum geht es?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Nachricht *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                    rows={5}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                    placeholder="Deine Nachricht..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Senden...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Nachricht senden
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
