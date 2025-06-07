import React from 'react';
import { Server, Cloud, Shield, Zap, Users, Trophy } from 'lucide-react';

const About = () => {
  const skills = [
    { name: 'Microsoft Intune & Endpoint Management', level: 95 },
    { name: 'Cloud-Native Architecture', level: 90 },
    { name: 'Azure & AWS Infrastructure', level: 88 },
    { name: 'DevOps & Automation', level: 85 },
  ];

  const stats = [
    { icon: Server, number: '200+', label: 'Systems Deployed' },
    { icon: Users, number: '50+', label: 'Enterprise Clients' },
    { icon: Trophy, number: '5+', label: 'Years Experience' },
    { icon: Shield, number: '99.9%', label: 'Uptime Achieved' },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            About <span className="text-purple-600">LedicoTech</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            System Engineer specializing in modern IT infrastructure and cloud-native solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Engineering Robust IT Solutions
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              With over 5 years of experience in system engineering, I specialize in Microsoft Intune 
              endpoint management, cloud-native architectures, and enterprise infrastructure solutions. 
              My expertise spans across modern IT operations, from device management to scalable cloud deployments.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              I'm passionate about implementing secure, efficient, and scalable IT solutions that enable 
              organizations to thrive in the digital age. Through continuous learning and hands-on experience 
              with cutting-edge technologies, I deliver solutions that exceed expectations.
            </p>

            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-6">My Methodology</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Security-first architecture design</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Infrastructure as Code (IaC)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Automated deployment pipelines</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Continuous monitoring & optimization</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white mb-4 group-hover:scale-110 transition-transform duration-200">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;