import { useEffect, useRef, useState } from 'react';
import { Briefcase, GraduationCap, Star, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TimelineEntry {
  id: string;
  title: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string | null;
  type: 'education' | 'work' | 'milestone';
  skills: string[];
  order_index: number;
  is_visible: boolean;
}

const typeConfig = {
  education: { icon: GraduationCap, color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-200 dark:border-cyan-800', label: 'Ausbildung' },
  work: { icon: Briefcase, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', label: 'Berufserfahrung' },
  milestone: { icon: Star, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', label: 'Meilenstein' },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' });
};

const CareerTimeline = () => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
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
        .from('career_timeline')
        .select('*')
        .eq('is_visible', true)
        .order('order_index', { ascending: true });
      if (data) setEntries(data as TimelineEntry[]);
    };
    load();
  }, []);

  return (
    <section id="career" ref={sectionRef} className="py-24 bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Mein <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Werdegang</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Mein beruflicher und ausbildungsbezogener Weg in der IT
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-slate-300 dark:to-slate-700 transform md:-translate-x-1/2"></div>

          <div className="space-y-8">
            {entries.map((entry, index) => {
              const config = typeConfig[entry.type] || typeConfig.work;
              const Icon = config.icon;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={entry.id}
                  className={`relative flex items-start gap-6 md:gap-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 z-10">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-800`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div className={`ml-20 md:ml-0 md:w-[calc(50%-2.5rem)] ${isLeft ? 'md:pr-8' : 'md:pl-8 md:ml-[calc(50%+2.5rem)]'}`}>
                    <div className={`${config.bg} border ${config.border} rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300`}>
                      <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{entry.title}</h3>
                          <p className="text-cyan-600 dark:text-cyan-400 font-semibold text-sm">{entry.company}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap`}>
                          <Calendar className="h-3 w-3" />
                          {formatDate(entry.start_date)} – {entry.end_date ? formatDate(entry.end_date) : 'Heute'}
                        </span>
                      </div>

                      {entry.description && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 leading-relaxed">{entry.description}</p>
                      )}

                      {entry.skills && entry.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.skills.map((skill) => (
                            <span key={skill} className="px-2 py-0.5 bg-white/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 text-xs rounded-md border border-slate-200 dark:border-slate-600">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerTimeline;
