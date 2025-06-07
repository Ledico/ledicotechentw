import React from 'react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const Portfolio = () => {
  const projects = [
    {
      title: 'Enterprise Intune Deployment',
      description: 'Complete Microsoft Intune rollout for 500+ devices with automated enrollment, compliance policies, and application management.',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Microsoft Intune', 'Azure AD', 'PowerShell', 'Compliance'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      title: 'Cloud-Native Infrastructure',
      description: 'Kubernetes-based microservices platform with automated CI/CD pipelines and infrastructure as code implementation.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Kubernetes', 'Docker', 'Terraform', 'Azure DevOps'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      title: 'Zero Trust Security Framework',
      description: 'Implementation of comprehensive zero trust architecture with conditional access policies and identity protection.',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Azure AD', 'Conditional Access', 'MFA', 'Security'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      title: 'Hybrid Cloud Migration',
      description: 'Seamless migration of on-premises infrastructure to hybrid cloud environment with minimal downtime.',
      image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Azure', 'Hybrid Cloud', 'Migration', 'PowerShell'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      title: 'Automated Monitoring Solution',
      description: 'Comprehensive monitoring and alerting system with custom dashboards and automated incident response.',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Azure Monitor', 'Log Analytics', 'PowerBI', 'Automation'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      title: 'DevOps Pipeline Implementation',
      description: 'End-to-end DevOps pipeline with automated testing, deployment, and infrastructure provisioning.',
      image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Azure DevOps', 'Git', 'ARM Templates', 'PowerShell'],
      demoUrl: '#',
      githubUrl: '#'
    }
  ];

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Featured <span className="text-purple-600">Projects</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real-world implementations showcasing expertise in modern IT infrastructure and cloud solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 hover:border-purple-200"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-white/90 rounded-lg text-sm font-medium text-slate-900 hover:bg-white transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      <span>Details</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-white/90 rounded-lg text-sm font-medium text-slate-900 hover:bg-white transition-colors">
                      <Github className="h-4 w-4" />
                      <span>Code</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                  <span className="mr-2">View Project</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-600 mb-6">
            Interested in seeing more work or discussing a project?
          </p>
          <button 
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Let's Work Together
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;