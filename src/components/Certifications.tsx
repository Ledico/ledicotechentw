import React from 'react';
import { Award, Calendar, BookOpen, GraduationCap, ExternalLink } from 'lucide-react';

const Certifications: React.FC = () => {
  const certifications = [
    {
      title: 'Cloud-Native (DevOps) Vorkurs',
      institution: 'TBZ (Technische Berufsschule Zürich)',
      date: '2024',
      modules: ['M346', 'M169'],
      description: 'Intensive Weiterbildung in Cloud-nativen Technologien und DevOps-Praktiken',
      skills: ['Cloud Infrastructure', 'DevOps', 'Automation', 'CI/CD'],
      status: 'completed'
    }
  ];

  return (
    <section id="certifications" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Zertifikate & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Weiterbildungen</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Kontinuierliche Weiterbildung in modernsten Technologien und Best Practices
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {cert.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">{cert.institution}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500">
                      <Calendar className="h-4 w-4" />
                      <span>{cert.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                      Abgeschlossen
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {cert.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Modulkurse
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cert.modules.map((module, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Erworbene Kompetenzen
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-xl text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">Weitere Zertifizierungen in Planung</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
