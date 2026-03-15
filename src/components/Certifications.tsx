import { useEffect, useRef, useState } from 'react';
import { Award, Calendar, ExternalLink, CheckCircle, Clock, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issued_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  modules: string[];
  skills: string[];
  status: 'completed' | 'in_progress' | 'planned';
  order_index: number;
}

const statusConfig = {
  completed: { icon: CheckCircle, label: 'Abgeschlossen', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
  in_progress: { icon: Clock, label: 'In Bearbeitung', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  planned: { icon: Lightbulb, label: 'Geplant', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' },
};

const Certifications = () => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('certifications')
        .select('*')
        .order('order_index', { ascending: true });
      if (data) setCerts(data as Certification[]);
    };
    load();
  }, []);

  if (certs.length === 0) return null;

  return (
    <section id="certifications" ref={sectionRef} className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Zertifikate & <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Ausbildungen</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Kontinuierliche Weiterbildung und Zertifizierungen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, index) => {
            const config = statusConfig[cert.status] || statusConfig.completed;
            const StatusIcon = config.icon;

            return (
              <div
                key={cert.id}
                className={`${config.bg} border ${config.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-500 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <Award className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color} bg-white/60 dark:bg-slate-800/60`}>
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {cert.name}
                </h3>
                <p className="text-cyan-600 dark:text-cyan-400 font-medium text-sm mb-3">{cert.issuer}</p>

                {cert.issued_date && (
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-4">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Ausgestellt: {new Date(cert.issued_date).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</span>
                  </div>
                )}

                {cert.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{cert.description}</p>
                )}

                {cert.modules && cert.modules.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Module</p>
                    <ul className="space-y-1">
                      {cert.modules.map((mod) => (
                        <li key={mod} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                          <span className="w-1 h-1 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0"></span>
                          {mod}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cert.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-white/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 text-xs rounded-md border border-slate-200 dark:border-slate-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Zertifikat ansehen
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
