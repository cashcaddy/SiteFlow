
import React from 'react';
import { Section, Element } from '../types';

interface SectionPreviewProps {
  section: Section;
  theme: { primaryColor: string };
}

const ElementRenderer: React.FC<{ element: Element; theme: { primaryColor: string } }> = ({ element, theme }) => {
  switch (element.type) {
    case 'heading':
      return <h2 className="text-3xl font-bold mb-4" style={element.style}>{element.content}</h2>;
    case 'text':
      return <p className="text-slate-600 mb-4 leading-relaxed whitespace-pre-wrap" style={element.style}>{element.content}</p>;
    case 'button':
      return (
        <button 
          className="px-6 py-3 rounded-xl text-white font-bold transition-transform hover:scale-105 mb-4"
          style={{ backgroundColor: theme.primaryColor, ...element.style }}
        >
          {element.content}
        </button>
      );
    case 'input':
      return (
        <div className="w-full text-left mb-4 max-w-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">{element.content}</label>
          <input 
            type="text" 
            placeholder={element.placeholder || "Enter text..."}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            style={element.style}
            disabled
          />
        </div>
      );
    case 'image':
      return (
        <img 
          src={element.content} 
          className="w-full h-auto rounded-2xl mb-4 object-cover max-h-[500px] shadow-lg"
          alt="Custom"
          style={element.style}
        />
      );
    default:
      return null;
  }
};

const SectionPreview: React.FC<SectionPreviewProps> = ({ section, theme }) => {
  const { type, content, elements } = section;

  switch (type) {
    case 'custom':
      return (
        <section className="py-20 px-8 bg-white" id={section.id}>
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            {elements && elements.length > 0 ? (
              elements.map(el => <ElementRenderer key={el.id} element={el} theme={theme} />)
            ) : (
              <div className="p-16 border-2 border-dashed border-slate-200 rounded-3xl w-full text-slate-400 bg-slate-50/50">
                <i className="fa-solid fa-shapes text-3xl mb-4"></i>
                <p className="font-medium italic text-slate-400">Section is empty. Add elements in the sidebar.</p>
              </div>
            )}
          </div>
        </section>
      );

    case 'header':
      return (
        <header className="py-6 px-8 flex justify-between items-center bg-white border-b sticky top-0 z-50">
          <div className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
            {content.logo || 'Logo'}
          </div>
          <nav className="flex gap-6">
            {content.links?.map((link: any, i: number) => (
              <a key={i} href={link.href} className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                {link.label}
              </a>
            ))}
          </nav>
        </header>
      );

    case 'hero':
      return (
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <img 
            src={content.image || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200'} 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center max-w-3xl px-6">
            <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
              {content.title || 'Welcome'}
            </h1>
            {content.subtitle && (
              <p className="text-xl text-slate-200 mb-8">
                {content.subtitle}
              </p>
            )}
            <button 
              className="px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg transform transition hover:scale-105"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {content.cta || 'Get Started'}
            </button>
          </div>
        </section>
      );

    case 'about':
      return (
        <section className="py-24 px-8 bg-white" id="about">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-slate-900">
              {content.title || 'About Us'}
            </h2>
            <div className="w-16 h-1 mx-auto mb-8" style={{ backgroundColor: theme.primaryColor }}></div>
            <p className="text-lg text-slate-600 leading-relaxed">
              {content.text || 'Tell your story here.'}
            </p>
          </div>
        </section>
      );

    case 'services':
      return (
        <section className="py-24 px-8 bg-slate-50" id="services">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-16">{content.title || 'Our Services'}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.items?.map((item: any, i: number) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 mx-auto text-white text-xl" style={{ backgroundColor: theme.primaryColor }}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'pricing':
      return (
        <section className="py-24 px-8 bg-slate-50" id="pricing">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-16">{content.title || 'Simple Pricing'}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.plans?.map((plan: any, i: number) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-black mb-6" style={{ color: theme.primaryColor }}>
                    ${plan.price}
                    <span className="text-sm text-slate-400 font-normal">/mo</span>
                  </div>
                  <ul className="space-y-4 mb-8 text-slate-600 text-left">
                    {plan.features?.map((f: string, fi: number) => (
                      <li key={fi} className="flex items-center gap-2 text-sm"><i className="fa-solid fa-circle-check text-green-500"></i> {f}</li>
                    ))}
                  </ul>
                  <button 
                    className="w-full py-3 rounded-xl font-bold border-2 transition-colors"
                    style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'contact':
      return (
        <section className="py-24 px-8 bg-white" id="contact">
          <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-4xl font-bold mb-4">{content.title || 'Contact Us'}</h2>
             {content.subtitle && <p className="text-slate-600 mb-12">{content.subtitle}</p>}
             <div className="grid gap-6 max-w-lg mx-auto">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border rounded-xl bg-slate-50" disabled />
                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 border rounded-xl bg-slate-50" disabled />
                <textarea placeholder="Your Message" className="w-full px-4 py-3 border rounded-xl bg-slate-50" rows={4} disabled></textarea>
                <button className="px-8 py-3 rounded-full text-white font-bold" style={{ backgroundColor: theme.primaryColor }}>Send Message</button>
             </div>
          </div>
        </section>
      );

    case 'footer':
      return (
        <footer className="py-12 px-8 bg-slate-900 text-slate-400 text-center border-t border-slate-800">
          <p className="text-sm">{content.copyright || '© 2024 Your Company.'}</p>
        </footer>
      );

    default:
      return null;
  }
};

export default SectionPreview;
