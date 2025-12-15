
import React, { useState } from 'react';
import { WebsiteConfig, Section, SectionType, Element } from '../types';
import { generateSectionContent } from '../services/geminiService';

interface SidebarProps {
  config: WebsiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<WebsiteConfig>>;
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, activeSectionId, setActiveSectionId }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'theme' | 'add' | 'elements'>('add');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeSection = config.sections.find(s => s.id === activeSectionId);

  const updateSectionContent = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === activeSectionId ? { ...s, content: { ...s.content, [key]: value } } : s
      )
    }));
  };

  const updateElementContent = (elementId: string, updates: Partial<Element>) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === activeSectionId ? { 
          ...s, 
          elements: s.elements?.map(el => el.id === elementId ? { ...el, ...updates } : el) 
        } : s
      )
    }));
  };

  const removeElement = (elementId: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === activeSectionId ? { 
          ...s, 
          elements: s.elements?.filter(el => el.id !== elementId) 
        } : s
      )
    }));
  };

  const moveElement = (elementId: string, direction: 'up' | 'down') => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== activeSectionId || !s.elements) return s;
        const index = s.elements.findIndex(el => el.id === elementId);
        const newElements = [...s.elements];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newElements.length) {
          [newElements[index], newElements[targetIndex]] = [newElements[targetIndex], newElements[index]];
        }
        return { ...s, elements: newElements };
      })
    }));
  };

  const addSection = (type: SectionType) => {
    const newId = `${type}-${Date.now()}`;
    let content: any = { title: `New ${type} section` };
    let elements: Element[] = [];
    
    if (type === 'services') content = { title: 'Our Services', items: [{ title: 'Service 1', desc: 'Description' }] };
    if (type === 'contact') content = { title: 'Get In Touch', subtitle: 'Send us a message' };
    if (type === 'pricing') content = { title: 'Our Plans' };
    if (type === 'custom') {
      content = { title: 'Custom Section' };
      elements = [];
    }

    const newSection: Section = { id: newId, type, content, elements };
    
    setConfig(prev => {
      const footerIndex = prev.sections.findIndex(s => s.type === 'footer');
      const newSections = [...prev.sections];
      if (footerIndex !== -1) newSections.splice(footerIndex, 0, newSection);
      else newSections.push(newSection);
      return { ...prev, sections: newSections };
    });
    setActiveSectionId(newId);
    setActiveTab(type === 'custom' ? 'elements' : 'content');
  };

  const addElement = (elementType: Element['type']) => {
    if (!activeSection) {
      alert("Please select or add a 'Custom Section' first to add elements.");
      return;
    }

    if (activeSection.type !== 'custom') {
      alert("Elements can only be added to 'Custom' sections. Use the 'Add' tab to create a Custom section.");
      return;
    }

    const newElement: Element = {
      id: `el-${Date.now()}`,
      type: elementType,
      content: elementType === 'heading' ? 'New Heading' : 
               elementType === 'text' ? 'New text paragraph goes here.' :
               elementType === 'button' ? 'Click Me' :
               elementType === 'image' ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800' :
               'Input Label',
      placeholder: elementType === 'input' ? 'Enter text here...' : undefined,
    };

    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === activeSectionId ? { ...s, elements: [...(s.elements || []), newElement] } : s
      )
    }));
    setActiveTab('content');
  };

  const deleteSection = (id: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
    setActiveSectionId(null);
  };

  const handleAiGenerate = async (type: SectionType) => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    const content = await generateSectionContent(type, aiPrompt);
    if (content) {
      const newId = `${type}-ai-${Date.now()}`;
      const newSection: Section = { id: newId, type, content };
      setConfig(prev => {
        const footerIndex = prev.sections.findIndex(s => s.type === 'footer');
        const newSections = [...prev.sections];
        if (footerIndex !== -1) newSections.splice(footerIndex, 0, newSection);
        else newSections.push(newSection);
        return { ...prev, sections: newSections };
      });
      setActiveSectionId(newId);
      setActiveTab('content');
      setAiPrompt('');
    }
    setIsGenerating(false);
  };

  return (
    <div className="w-80 h-full bg-white border-r flex flex-col shadow-2xl z-20">
      <div className="p-5 border-b flex justify-between items-center bg-slate-50">
        <h2 className="font-black text-slate-800 tracking-tight">Editor Tools</h2>
        <div className="flex bg-white p-1 rounded-xl border">
          {[
            { id: 'add', icon: 'fa-plus', label: 'Add' },
            { id: 'elements', icon: 'fa-shapes', label: 'Elements' },
            { id: 'content', icon: 'fa-pen', label: 'Edit' },
            { id: 'theme', icon: 'fa-palette', label: 'Theme' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              title={tab.label}
            >
              <i className={`fa-solid ${tab.icon} text-xs`}></i>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
        {activeTab === 'add' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Magic Generate</h3>
              <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-inner">
                <textarea 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe section..."
                  className="w-full text-sm p-3 border-none rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    disabled={isGenerating || !aiPrompt}
                    onClick={() => handleAiGenerate('hero')}
                    className="text-[10px] font-black uppercase bg-white py-2.5 rounded-lg border hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all disabled:opacity-50"
                  >
                    Hero
                  </button>
                  <button 
                    disabled={isGenerating || !aiPrompt}
                    onClick={() => handleAiGenerate('about')}
                    className="text-[10px] font-black uppercase bg-white py-2.5 rounded-lg border hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all disabled:opacity-50"
                  >
                    About
                  </button>
                </div>
                {isGenerating && <p className="text-[10px] text-blue-600 font-bold animate-pulse text-center">AI is working...</p>}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Section Presets</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'hero', icon: 'fa-rocket', label: 'Hero' },
                  { type: 'about', icon: 'fa-user', label: 'About' },
                  { type: 'services', icon: 'fa-briefcase', label: 'Services' },
                  { type: 'pricing', icon: 'fa-tags', label: 'Pricing' },
                  { type: 'contact', icon: 'fa-envelope', label: 'Contact' },
                  { type: 'custom', icon: 'fa-wand-magic-sparkles', label: 'Custom' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addSection(item.type as SectionType)}
                    className="flex flex-col items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <i className={`fa-solid ${item.icon} text-slate-400 group-hover:text-blue-600 transition-colors`}></i>
                    </div>
                    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Insert Components</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">Select a <strong className="text-blue-600">Custom Section</strong> in the preview, then click these to add building blocks.</p>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'heading', icon: 'fa-heading', label: 'Heading' },
                  { type: 'text', icon: 'fa-align-left', label: 'Paragraph' },
                  { type: 'button', icon: 'fa-square', label: 'Button' },
                  { type: 'input', icon: 'fa-keyboard', label: 'Input Field' },
                  { type: 'image', icon: 'fa-image', label: 'Image' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addElement(item.type as Element['type'])}
                    className="flex flex-col items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <i className={`fa-solid ${item.icon} text-slate-400 group-hover:text-blue-600 transition-colors`}></i>
                    </div>
                    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
            {!activeSection ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-i-cursor text-slate-300 text-2xl"></i>
                </div>
                <p className="text-sm text-slate-400 font-medium px-4">Click any section in the preview to edit its content.</p>
              </div>
            ) : (
              <div className="pb-10">
                <div className="flex justify-between items-center mb-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">{activeSection.type} section</span>
                  <button onClick={() => deleteSection(activeSection.id)} className="text-slate-300 hover:text-red-500 transition-colors" title="Delete Section"><i className="fa-solid fa-trash-can"></i></button>
                </div>
                
                <div className="space-y-5">
                  {/* Standard Content Editing */}
                  {Object.keys(activeSection.content).map(key => {
                    const value = activeSection.content[key];
                    if (typeof value === 'string') {
                      return (
                        <div key={key} className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key}</label>
                          {key.length > 20 || ['text', 'subtitle', 'desc'].includes(key) ? (
                            <textarea 
                              className="w-full text-sm p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                              value={value}
                              onChange={(e) => updateSectionContent(key, e.target.value)}
                              rows={4}
                            />
                          ) : (
                            <input 
                              type="text"
                              className="w-full text-sm p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                              value={value}
                              onChange={(e) => updateSectionContent(key, e.target.value)}
                            />
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}

                  {/* Custom Elements Editing */}
                  {activeSection.type === 'custom' && activeSection.elements && activeSection.elements.length > 0 && (
                    <div className="pt-8 border-t mt-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layout Elements</h3>
                        <span className="text-[10px] font-bold text-slate-300">{activeSection.elements.length} components</span>
                      </div>
                      
                      <div className="space-y-6">
                        {activeSection.elements.map((el, idx) => (
                          <div key={el.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group/el shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-blue-600 uppercase px-2 py-0.5 bg-blue-50 rounded-lg border border-blue-100">
                                  {el.type}
                                </span>
                                <div className="flex gap-1">
                                  <button onClick={() => moveElement(el.id, 'up')} disabled={idx === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-30"><i className="fa-solid fa-chevron-up text-[10px]"></i></button>
                                  <button onClick={() => moveElement(el.id, 'down')} disabled={idx === activeSection.elements!.length - 1} className="text-slate-300 hover:text-slate-600 disabled:opacity-30"><i className="fa-solid fa-chevron-down text-[10px]"></i></button>
                                </div>
                              </div>
                              <button 
                                onClick={() => removeElement(el.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <i className="fa-solid fa-circle-xmark"></i>
                              </button>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">
                                  {el.type === 'image' ? 'Image URL' : el.type === 'input' ? 'Input Label' : el.type === 'button' ? 'Button Label' : 'Text Content'}
                                </label>
                                {el.type === 'text' ? (
                                  <textarea 
                                    className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={el.content}
                                    onChange={(e) => updateElementContent(el.id, { content: e.target.value })}
                                    rows={3}
                                  />
                                ) : (
                                  <input 
                                    type="text"
                                    className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={el.content}
                                    onChange={(e) => updateElementContent(el.id, { content: e.target.value })}
                                  />
                                )}
                              </div>

                              {el.type === 'input' && (
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase">Placeholder Text</label>
                                  <input 
                                    type="text"
                                    className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={el.placeholder || ''}
                                    onChange={(e) => updateElementContent(el.id, { placeholder: e.target.value })}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Branding</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-3">Primary Color</label>
                  <div className="grid grid-cols-6 gap-2">
                    {['#2563eb', '#db2777', '#10b981', '#f59e0b', '#6366f1', '#1e293b'].map(color => (
                      <button
                        key={color}
                        onClick={() => setConfig(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: color } }))}
                        className={`w-full aspect-square rounded-lg border-4 transition-all ${config.theme.primaryColor === color ? 'border-white ring-2 ring-slate-800 scale-110 shadow-lg' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-3">Project Title</label>
                  <input 
                    type="text"
                    className="w-full text-sm p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={config.title}
                    onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-slate-50 text-center border-t">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SiteFlow Creator</p>
      </div>
    </div>
  );
};

export default Sidebar;
