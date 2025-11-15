import { Code, Cloud, Palette, Headphones } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

export function Services() {
  const services = [
    {
      icon: Code,
      title: 'Custom Development',
      description: 'Tailored solutions built to match your specific business requirements and goals.',
      features: ['Web Applications', 'Mobile Apps', 'API Integration', 'Custom Workflows'],
    },
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      description: 'Scalable cloud solutions with 99.9% uptime and automatic backups.',
      features: ['Cloud Migration', 'Auto-scaling', 'Load Balancing', 'Monitoring'],
    },
    {
      icon: Palette,
      title: 'Design Services',
      description: 'Beautiful, user-centric designs that engage and convert your audience.',
      features: ['UI/UX Design', 'Branding', 'Prototyping', 'Design Systems'],
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock expert support to keep your business running smoothly.',
      features: ['Live Chat', 'Phone Support', 'Email Support', 'Priority SLA'],
    },
  ];

  return (
    <div className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-slate-900 mb-4">Comprehensive Services</h2>
          <p className="text-slate-600 text-lg">
            From concept to deployment, we've got you covered with our full suite of services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="p-8 bg-white">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-2">{service.title}</h3>
                    <p className="text-slate-600">{service.description}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
