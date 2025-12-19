
import { Template, Section } from './types';

export const INITIAL_SECTIONS: Section[] = [
  {
    id: 'h1',
    type: 'header',
    content: {
      logo: 'Spark',
      links: [
        { label: 'Features', href: '#services' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  },
  {
    id: 'hero1',
    type: 'hero',
    content: {
      title: 'Ignite Your Digital Presence',
      subtitle: 'Build professional, high-performance websites in minutes with Spark AI.',
      cta: 'Start Building Free',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2426'
    }
  },
  {
    id: 'footer1',
    type: 'footer',
    content: {
      copyright: '© 2024 Spark Builder. Built with passion.'
    }
  }
];

export const TEMPLATES: Template[] = [
  {
    id: 'blank-canvas',
    name: 'Spark Minimal',
    category: 'Essential',
    thumbnail: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=400',
    config: {
      title: 'New Spark Project',
      theme: { primaryColor: '#2563eb', fontFamily: 'Inter' },
      sections: [
        {
          id: 'h1',
          type: 'header',
          content: { logo: 'Spark', links: [] }
        },
        {
          id: 'footer1',
          type: 'footer',
          content: { copyright: '© 2024 Spark Project.' }
        }
      ]
    }
  },
  {
    id: 'saas-spark',
    name: 'SaaS Ignite',
    category: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
    config: {
      title: 'Spark SaaS',
      theme: { primaryColor: '#2563eb', fontFamily: 'Inter' },
      sections: [
        {
          id: 'h1',
          type: 'header',
          content: { logo: 'IgniteApp', links: [{ label: 'Solutions', href: '#services' }, { label: 'Pricing', href: '#pricing' }] }
        },
        {
          id: 'hero1',
          type: 'hero',
          content: { 
            title: 'Automate Your Growth', 
            subtitle: 'Powerful tools for teams that want to move faster and build better.',
            cta: 'Get Started',
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200'
          }
        },
        {
          id: 'services1',
          type: 'services',
          content: {
            title: 'Why Choose Spark?',
            items: [
              { title: 'Lightning Fast', desc: 'Optimized for speed and SEO out of the box.' },
              { title: 'AI Powered', desc: 'Generate high-quality content instantly.' },
              { title: 'Full Control', desc: 'Customize every pixel to match your brand.' }
            ]
          }
        },
        {
          id: 'pricing1',
          type: 'pricing',
          content: {
            title: 'Pricing for Every Stage',
            plans: [
              { name: 'Spark', price: '0', features: ['Core Components', 'Spark Domain'] },
              { name: 'Flare', price: '19', features: ['Custom Domain', 'AI Analytics'] },
              { name: 'Nova', price: '49', features: ['White-labeling', 'API Access'] }
            ]
          }
        },
        {
          id: 'footer1',
          type: 'footer',
          content: { copyright: '© 2024 SaaS Ignite. Powered by Spark.' }
        }
      ]
    }
  }
];
