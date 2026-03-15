import { useEffect, useRef, useState } from 'react';
import { MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react';

const skills = [
  { category: 'Microsoft 365', items: ['Microsoft Intune', 'Entra ID', 'SharePoint Online', 'Teams', 'Exchange Online', 'Defender for Endpoint'] },
  { category: 'System Administration', items: ['Windows 11', 'Windows Autopilot', 'Active Directory', 'Group Policy', 'Sophos', 'Synology'] },
  { category: 'Cloud & DevOps', items: ['Azure', 'Docker', 'Kubernetes', 'CI/CD', 'GitLab', 'Infrastructure as Code'] },
  { category: 'Networking', items: ['TCP/IP', 'DNS', 'DHCP', 'VPN', 'Firewall', 'Subnetting'] },
];

const About = () => {
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

  return (
    <>
      <section id="about" ref={sectionRef} className="py-24 bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Über <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">mich</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Leonardo Costa"
                  className="rounded-2xl w-full max-w-md mx-auto object-cover aspect-square shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Junior-ICT-Supporter @ SUISA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Hi, ich bin Leonardo!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-lg">
                Als leidenschaftlicher ICT-Fachmann mit Abschluss als ICT-Fachmann EFZ bringe ich praktische Erfahrung
                in der modernen IT-Infrastruktur mit. Mein Fokus liegt auf Microsoft 365, Cloud-Technologien und
                modernem Device Management.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                Aktuell arbeite ich als Junior-ICT-Supporter bei der SUISA, wo ich täglich an spannenden
                Infrastrukturprojekten mitarbeite und mein Wissen kontinuierlich erweitere.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: MapPin, label: 'Standort', value: 'Schweiz' },
                  { icon: Briefcase, label: 'Aktuell', value: 'SUISA AG' },
                  { icon: GraduationCap, label: 'Abschluss', value: 'ICT-Fachmann EFZ' },
                  { icon: Heart, label: 'Leidenschaft', value: 'Cloud & DevOps' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                    <div className="p-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg">
                      <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Technische <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Skills</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Technologien und Tools, mit denen ich täglich arbeite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skillGroup, index) => (
              <div
                key={skillGroup.category}
                className={`bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 transition-all duration-700 hover:shadow-lg hover:border-cyan-200 dark:hover:border-cyan-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100 + 400}ms` }}
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></span>
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg border border-slate-200 dark:border-slate-600 hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
