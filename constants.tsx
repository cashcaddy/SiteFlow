
import { Template } from './types';

export const INITIAL_SECTIONS = [
  {
    id: 'h1',
    type: 'header',
    content: {
      logo: 'SiteFlow',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  },
  {
    id: 'hero1',
    type: 'hero',
    content: {
      title: 'Build Your Dream Website Today',
      subtitle: 'Beautifully designed sections that you can customize in minutes.',
      cta: 'Get Started',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426'
    }
  },
  {
    id: 'footer1',
    type: 'footer',
    content: {
      copyright: '© 2024 SiteFlow Builder. All rights reserved.'
    }
  }
];

export const TEMPLATES: Template[] = [
  {
    id: 'blank-canvas',
    name: 'Blank Canvas',
    category: 'Essential',
    thumbnail: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=400',
    config: {
      title: 'New Project',
      theme: { primaryColor: '#2563eb', fontFamily: 'Inter' },
      sections: [
        {
          id: 'h1',
          type: 'header',
          content: { logo: 'My Brand', links: [] }
        },
        {
          id: 'footer1',
          type: 'footer',
          content: { copyright: '© 2024 My Brand. All rights reserved.' }
        }
      ]
    }
  },
  {
    id: 'business-pro',
    name: 'Business Pro',
    category: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400',
    config: {
      title: 'Business Pro',
      theme: { primaryColor: '#2563eb', fontFamily: 'Inter' },
      sections: [
        {
          id: 'h1',
          type: 'header',
          content: { logo: 'NexusCorp', links: [{ label: 'Solutions', href: '#services' }, { label: 'Contact', href: '#contact' }] }
        },
        {
          id: 'hero1',
          type: 'hero',
          content: { 
            title: 'Modern Solutions for Modern Business', 
            subtitle: 'We help you scale with enterprise-grade tools and local care.',
            cta: 'Our Services',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'
          }
        },
        {
          id: 'services1',
          type: 'services',
          content: {
            title: 'Our Solutions',
            items: [
              { title: 'Cloud Integration', desc: 'Seamlessly move your operations to the cloud.' },
              { title: 'Security Audits', desc: 'Protect your data with enterprise security.' },
              { title: 'AI Automation', desc: 'Boost efficiency with smart workflows.' }
            ]
          }
        },
        {
          id: 'contact1',
          type: 'contact',
          content: {
            title: 'Get In Touch',
            subtitle: 'Ready to take the next step? Contact us today.'
          }
        },
        {
          id: 'footer1',
          type: 'footer',
          content: { copyright: '© 2024 NexusCorp Global.' }
        }
      ]
    }
  },
  {
    id: 'creative-folio',
    name: 'Creative Portfolio',
    category: 'Portfolio',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=400',
    config: {
      title: 'Creative Portfolio',
      theme: { primaryColor: '#db2777', fontFamily: 'Inter' },
      sections: [
        {
          id: 'h1',
          type: 'header',
          content: { logo: 'ARTIST', links: [{ label: 'Work', href: '#services' }, { label: 'About', href: '#about' }] }
        },
        {
          id: 'hero1',
          type: 'hero',
          content: { 
            title: 'Capturing Moments In Time', 
            subtitle: 'Photographer & Visual Artist based in London.',
            cta: 'View Gallery',
            image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=1200'
          }
        },
        {
          id: 'about1',
          type: 'about',
          content: {
            title: 'My Story',
            text: 'I believe every frame tells a story. With over a decade of experience in visual arts, I bring perspectives to life.'
          }
        },
        {
          id: 'footer1',
          type: 'footer',
          content: { copyright: '© 2024 Artist Portfolio.' }
        }
      ]
    }
  }
];
