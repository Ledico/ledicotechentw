import React from 'react';
import { Server, Cloud, Shield, Monitor, Settings, Database } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Monitor,
      title: 'Microsoft Intune Management',
      description: 'Complete endpoint management solutions with device compliance and security policies.',
      features: ['Device Enrollment', 'App Management', 'Compliance Policies', 'Conditional Access']
    },
    {
      icon: Cloud,
      title: 'Cloud-Native Architecture',
      description: 'Modern cloud solutions built for scalability, resilience, and performance.',
      features: ['Microservices Design', 'Container Orchestration', 'Serverless Computing', 'Auto-scaling']
    },
    {
      icon: Server,
      title: 'Infrastructure Engineering',
      description: 'Robust IT infrastructure design and implementation for enterprise environments.',
      features: ['Network Architecture', 'Server Management', 'Load Balancing', 'Disaster Recovery']
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Comprehensive security frameworks and compliance management solutions.',
      features: ['Zero Trust Architecture', 'Identity Management', 'Security Monitoring', 'Compliance Auditing']
    },
    {
      icon: Settings,
      title: 'DevOps & Automation',
      description: 'Streamlined development operations with automated deployment pipelines.',
      features: ['CI/CD Pipelines', 'Infrastructure as Code', 'Monitoring & Alerting', 'Configuration Management']
    },
    {
      icon: Database,
      title: 'Data & Analytics',
      description: 'Data platform solutions with real-time analytics and business intelligence.',
      features: ['Data Warehousing', 'ETL Processes', 'Business Intelligence', 'Real-time Analytics']
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Services & <span className="text-purple-600">Expertise</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive IT solutions tailored to modern enterprise needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 hover:border-purple-200"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white mb-6 group-hover:scale-110 transition-transform duration-200">
                <service.icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-slate-500">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button 
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Your Project
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;