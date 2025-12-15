
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SectionPreview from './components/SectionPreview';
import EmptyPage from './components/EmptyPage';
import { WebsiteConfig, Template } from './types';
import { INITIAL_SECTIONS, TEMPLATES } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'builder'>('landing');
  const [config, setConfig] = useState<WebsiteConfig>({
    title: 'My Awesome Site',
    theme: {
      primaryColor: '#2563eb',
      fontFamily: 'Inter',
    },
    sections: INITIAL_SECTIONS,
  });

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [showTemplates, setShowTemplates] = useState(false);

  // Still persist config locally for convenience
  useEffect(() => {
    const savedConfig = localStorage.getItem('siteflow_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Auto-save to local storage on config change
  useEffect(() => {
    localStorage.setItem('siteflow_config', JSON.stringify(config));
  }, [config]);

  const handleSelectTemplate = (template: Template) => {
    setConfig(template.config);
    setShowTemplates(false);
    setAppState('builder');
  };

  const downloadWebsite = () => {
    const generateSectionHtml = (section: any) => {
      const { type, content, elements } = section;
      const primary = config.theme.primaryColor;
      
      switch (type) {
        case 'custom':
          const elementsHtml = (elements || []).map((el: any) => {
            switch(el.type) {
              case 'heading': return `<h2 style="font-size: 30px; font-weight: bold; margin-bottom: 16px;">${el.content}</h2>`;
              case 'text': return `<p style="color: #475569; margin-bottom: 16px; line-height: 1.6;">${el.content}</p>`;
              case 'button': return `<button style="background: ${primary}; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-bottom: 16px;">${el.content}</button>`;
              case 'input': return `<div style="margin-bottom: 16px;"><label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px;">${el.content}</label><input type="text" placeholder="${el.placeholder || 'Enter text...'}" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px;"></div>`;
              case 'image': return `<img src="${el.content}" style="width: 100%; border-radius: 16px; margin-bottom: 16px; object-fit: cover;">`;
              default: return '';
            }
          }).join('');
          return `<section style="padding: 80px 24px; background: white;"><div style="max-width: 800px; margin: 0 auto; text-align: center;">${elementsHtml}</div></section>`;
        case 'header':
          return `
            <header style="padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; background: white; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 50;">
              <div style="font-size: 24px; font-weight: bold; color: ${primary};">${content.logo || 'Logo'}</div>
              <nav style="display: flex; gap: 24px;">
                ${(content.links || []).map((l: any) => `<a href="${l.href}" style="text-decoration: none; color: #475569; font-weight: 500;">${l.label}</a>`).join('')}
              </nav>
            </header>`;
        case 'hero':
          return `
            <section style="position: relative; height: 600px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #000;">
              <img src="${content.image}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.4;" />
              <div style="position: relative; z-index: 10; text-align: center; max-width: 800px; padding: 0 24px;">
                <h1 style="font-size: 48px; font-weight: 800; color: white; margin-bottom: 24px;">${content.title}</h1>
                <p style="font-size: 20px; color: #e2e8f0; margin-bottom: 32px;">${content.subtitle}</p>
                <button style="padding: 16px 32px; border-radius: 9999px; border: none; background: ${primary}; color: white; font-weight: bold; font-size: 18px; cursor: pointer;">${content.cta}</button>
              </div>
            </section>`;
        case 'about':
          return `
            <section id="about" style="padding: 96px 24px; background: white; text-align: center;">
              <h2 style="font-size: 36px; font-weight: bold; margin-bottom: 32px;">${content.title}</h2>
              <div style="width: 64px; height: 4px; background: ${primary}; margin: 0 auto 32px;"></div>
              <p style="font-size: 18px; color: #475569; line-height: 1.6; max-width: 800px; margin: 0 auto;">${content.text}</p>
            </section>`;
        case 'services':
          return `
            <section id="services" style="padding: 96px 24px; background: #f8fafc;">
              <h2 style="font-size: 36px; font-weight: bold; text-align: center; margin-bottom: 64px;">${content.title}</h2>
              <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
                ${(content.items || []).map((item: any) => `
                  <div style="background: white; padding: 32px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="width: 48px; height: 48px; border-radius: 8px; background: ${primary}; color: white; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">★</div>
                    <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">${item.title}</h3>
                    <p style="color: #475569;">${item.desc}</p>
                  </div>
                `).join('')}
              </div>
            </section>`;
        case 'contact':
          return `
            <section id="contact" style="padding: 96px 24px; background: white;">
              <div style="max-width: 800px; margin: 0 auto;">
                <h2 style="font-size: 36px; font-weight: bold; text-align: center; margin-bottom: 16px;">${content.title}</h2>
                <p style="text-align: center; color: #475569; margin-bottom: 64px;">${content.subtitle}</p>
                <form style="display: grid; gap: 24px;">
                  <input type="text" placeholder="Name" style="padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; width: 100%;">
                  <input type="email" placeholder="Email" style="padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; width: 100%;">
                  <textarea placeholder="Message" rows="5" style="padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; width: 100%;"></textarea>
                  <button type="button" style="padding: 16px; border-radius: 8px; border: none; background: ${primary}; color: white; font-weight: bold; cursor: pointer;">Send Message</button>
                </form>
              </div>
            </section>`;
        case 'footer':
          return `
            <footer style="padding: 48px 24px; background: #0f172a; color: #94a3b8; text-align: center;">
              <p style="opacity: 0.6;">${content.copyright}</p>
            </footer>`;
        default: return '';
      }
    };

    const sectionsHtml = config.sections.map(generateSectionHtml).join('\n');
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
    <style>
      body { margin: 0; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
    </style>
</head>
<body>
    ${sectionsHtml}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (appState === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i className="fa-solid fa-layer-group text-xl"></i>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">SiteFlow</span>
          </div>
          <button 
            onClick={() => setShowTemplates(true)}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all shadow-md"
          >
            Start Building
          </button>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1]">
              Launch your website in <span className="text-blue-600">seconds.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              SiteFlow is the simplest way to create professional websites. Use AI to generate content, pick a template, and publish instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowTemplates(true)}
                className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all"
              >
                Create My Website
              </button>
              <button 
                onClick={() => setShowTemplates(true)}
                className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-lg hover:border-slate-300 transition-all"
              >
                View Templates
              </button>
            </div>
          </div>

          <div className="mt-20 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
             <img 
               src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000" 
               alt="Dashboard Preview"
               className="w-full h-auto object-cover opacity-90"
             />
          </div>
        </main>

        {showTemplates && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Choose a Template</h2>
                  <p className="text-slate-500 mt-1">Start with a professionally designed foundation.</p>
                </div>
                <button 
                  onClick={() => setShowTemplates(false)}
                  className="w-10 h-10 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {TEMPLATES.map((tpl) => (
                    <div 
                      key={tpl.id}
                      className="group relative border rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 bg-white"
                      onClick={() => handleSelectTemplate(tpl)}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-slate-200 relative">
                        <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white px-6 py-3 rounded-full font-black text-blue-600 shadow-xl">Use Template</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">{tpl.category}</div>
                        <h3 className="font-bold text-xl text-slate-800">{tpl.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Template Modal for Builder view */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-3xl font-black">Switch Template</h2>
              <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-slate-100 rounded-full"><i className="fa-solid fa-times text-xl"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid md:grid-cols-3 gap-6">
                {TEMPLATES.map((tpl) => (
                  <div key={tpl.id} onClick={() => handleSelectTemplate(tpl)} className="border rounded-xl p-2 cursor-pointer hover:border-blue-500">
                    <img src={tpl.thumbnail} className="rounded-lg mb-2" />
                    <p className="font-bold">{tpl.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'editor' && (
        <Sidebar 
          config={config} 
          setConfig={setConfig} 
          activeSectionId={activeSectionId}
          setActiveSectionId={setActiveSectionId}
        />
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setAppState('landing')}>
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white shadow-lg">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <span className="font-black text-slate-800 text-lg tracking-tight">SiteFlow</span>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('editor')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'editor' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <i className="fa-solid fa-pen mr-2"></i> Edit
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'preview' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <i className="fa-solid fa-eye mr-2"></i> Preview
            </button>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={downloadWebsite}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-download"></i> Download Site
            </button>
            <button 
              onClick={() => setShowTemplates(true)}
              className="text-slate-500 hover:text-slate-800 font-bold text-sm px-4"
            >
              Templates
            </button>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto custom-scrollbar ${viewMode === 'editor' ? 'bg-slate-200 p-4 md:p-8 lg:p-12' : 'bg-white'}`}>
          <div 
            className={`mx-auto bg-white shadow-2xl transition-all duration-700 overflow-hidden ${viewMode === 'editor' ? 'max-w-[1200px] min-h-[800px] rounded-3xl' : 'w-full min-h-full'}`}
          >
            {config.sections.length === 0 ? (
              <EmptyPage onAddSection={() => {
                setConfig(prev => ({
                  ...prev,
                  sections: INITIAL_SECTIONS
                }));
              }} />
            ) : (
              config.sections.map((section) => (
                <div 
                  key={section.id} 
                  className={`relative group ${activeSectionId === section.id && viewMode === 'editor' ? 'ring-4 ring-blue-500 ring-inset' : ''}`}
                  onClick={() => viewMode === 'editor' && setActiveSectionId(section.id)}
                >
                  {viewMode === 'editor' && (
                    <div className="absolute top-0 left-0 w-full h-full bg-blue-500/0 hover:bg-blue-500/5 cursor-pointer z-10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl">Edit Section</span>
                    </div>
                  )}
                  <SectionPreview section={section} theme={config.theme} />
                </div>
              ))
            )}
          </div>
        </div>

        {viewMode === 'editor' && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 backdrop-blur-xl shadow-2xl border px-6 py-3 rounded-2xl">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"><i className="fa-solid fa-mobile-screen"></i></button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"><i className="fa-solid fa-tablet-screen-button"></i></button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-blue-600 bg-blue-50 shadow-inner"><i className="fa-solid fa-desktop"></i></button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
