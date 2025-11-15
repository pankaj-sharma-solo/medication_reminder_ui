import { Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Security', 'Roadmap', 'Changelog'],
    Company: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
    Resources: ['Documentation', 'Help Center', 'Community', 'Contact', 'Status'],
    Legal: ['Privacy', 'Terms', 'Cookie Policy', 'Licenses', 'Compliance'],
  };

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Github, href: '#' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-white">TechSolutions</span>
            </div>
            <p className="text-slate-400 mb-4">
              Empowering businesses with innovative technology solutions since 2015.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => onNavigate('home')}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 TechSolutions. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button className="text-slate-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </button>
              <button className="text-slate-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </button>
              <button className="text-slate-400 hover:text-white transition-colors text-sm">
                Cookie Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
