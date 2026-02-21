import { useEffect, useRef, useState } from 'react';
import { Briefcase, GraduationCap, Award, Calendar, MapPin } from 'lucide-react';
import { supabase, CareerTimelineEntry } from '../lib/supabase';

const typeConfig = {
  work: { icon: Briefcase, gradient: 'from-cyan-500 to-blue-600', ring: 'ring-cyan-200 dark:ring-cyan-800', dot: 'bg-cyan-500' },
  education: { icon: GraduationCap, gradient: 'from-blue-500 to-sky-600', ring: 'ring-blue-200 dark:ring-blue-800', dot: 'bg-blue-500' },
  milestone: { icon: Award, gradient: 'from-amber-500 to-orange-600', ring: 'ring-amber-200 dark:ring-amber-800', dot: 'bg-amber-500' },
};

const CareerTimeline = () => {
  const [entries, setEntries] = useState<CareerTimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      const { data, error } = await supabase
        .from('career_timeline')
        .select('*')
        .eq('is_visible', true)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('de-DE', { year: 'numeric', month: 'short' });
  };

  const getDuration = (start: string, end: string | null | undefined) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0 && remainingMonths > 0) return `${years} J. ${remainingMonths} Mt.`;
    if (years > 0) return `${years} Jahr${years > 1 ? 'e' : ''}`;
    return `${remainingMonths} Monat${remainingMonths > 1 ? 'e' : ''}`;
  };

  if (loading) {
    return (
      <section id="career" ref={sectionRef} className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Lade Werdegang...</p>
          </div>
        </div>
      </section>
    );
  }

  if (entries.length === 0) return null;

  return (
    <section id="career" ref={sectionRef} className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-300 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Beruflicher <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Werdegang</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Mein bisheriger Weg in der IT -- von der Ausbildung bis zum heutigen Stand
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-slate-300 dark:to-slate-600 md:-translate-x-px"></div>

          <div className="space-y-12">
            {entries.map((entry, index) => {
              const config = typeConfig[entry.type];
              const EntryIcon = config.icon;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={entry.id}
                  className={`relative flex items-start transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${200 + index * 150}ms` }}
                >
                  <div className={`hidden md:block w-[calc(50%-2rem)] ${isLeft ? 'text-right pr-8' : 'order-2 pl-8'}`}>
                    <div className={`inline-block ${isLeft ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-2 mb-1 text-sm text-slate-500 dark:text-slate-400">
                        {isLeft ? (
                          <>
                            <span>{getDuration(entry.start_date, entry.end_date)}</span>
                            <Calendar className="h-3.5 w-3.5" />
                          </>
                        ) : (
                          <>
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{getDuration(entry.start_date, entry.end_date)}</span>
                          </>
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {formatDate(entry.start_date)} — {entry.end_date ? formatDate(entry.end_date) : 'Heute'}
                      </span>
                    </div>
                  </div>

                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center ring-4 ${config.ring} shadow-lg`}>
                      <EntryIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:order-2 md:pl-8' : 'md:pr-8'}`}>
                    <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-600 hover:shadow-md hover:border-cyan-300 dark:hover:border-cyan-600 transition-all duration-300 group">
                      <div className="md:hidden flex items-center gap-2 mb-2 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(entry.start_date)} — {entry.end_date ? formatDate(entry.end_date) : 'Heute'}</span>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <span>{getDuration(entry.start_date, entry.end_date)}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200">
                        {entry.title}
                      </h3>
                      <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400 mt-0.5">
                        {entry.company}
                      </p>

                      {entry.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                          {entry.description}
                        </p>
                      )}

                      {entry.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {entry.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {!entry.end_date && (
                        <div className="mt-4 flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">Aktuelle Position</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 -bottom-2">
            <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-slate-50 dark:ring-slate-800"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerTimeline;
