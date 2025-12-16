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

  const updateNestedContent = (parentKey: string, index: number, childKey: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== activeSectionId) return s;
        const newItems = [...(s.content[parentKey] || [])];
        newItems[index] = { ...newItems[index], [childKey]: value };
        return { ...s, content: { ...s.content, [parentKey]: newItems } };
      })
    }));
  };

  const addListItem = (parentKey: string, template: any) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== activeSectionId) return s;
        return { ...s, content: { ...s.content, [parentKey]: [...(s.content[parentKey] || []), template] } };
      })
    }));
  };

  const removeListItem = (parentKey: string, index: number) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== activeSectionId) return s;
        return { ...s, content: { ...s.content, [parentKey]: (s.content[parentKey] || []).filter((_: any, i: number) => i !== index) } };
      })
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
    let content: any = { title: `New ${type} Section` };
    let elements: Element[] = [];
    
    if (type === 'hero') content = { title: 'Welcome to Your Brand', subtitle: 'Modern solutions for growing businesses around the globe.', cta: 'Explore Services', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200' };
    if (type === 'services') content = { title: 'Our Expertise', items: [{ title: 'Design Strategy', desc: 'Crafting beautiful experiences.' }] };
    if (type === 'contact') content = { title: 'Let\'s Connect', subtitle: 'Reach out for a free consultation.' };
    if (type === 'pricing') content = { title: 'Flexible Plans', plans: [{ name: 'Starter', price: '0', features: ['Core Toolset', 'Community Access'] }] };
    if (type === 'custom') { content = { title: 'Your Custom Canvas' }; elements = []; }

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

  const handleAiGenerate = async (type: SectionType) => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
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
    } catch (err) {
      console.error("AI Build Error:", err);
      alert("AI was unable to generate content. Please try a different prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addElement = (elementType: Element['type']) => {
    if (!activeSection || activeSection.type !== 'custom') {
      alert("Please add/select a 'Custom' section first to add layout elements.");
      return;
    }

    const newElement: Element = {
      id: `el-${Date.now()}`,
      type: elementType,
      content: elementType === 'heading' ? 'Main Title Here' : 
               elementType === 'text' ? 'A short description of what you do best.' :
               elementType === 'button' ? 'Click Here' :
               elementType === 'image' ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800' :
               'Full Name Label',
      placeholder: elementType === 'input' ? 'e.g. John Smith' : undefined,
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

  return (
    <div className="w-80 h-full bg-white border-r flex flex-col shadow-2xl z-20">
      <div className="p-5 border-b flex justify-between items-center bg-slate-50">
        <h2 className="font-black text-slate-800 tracking-tight">SiteFlow Editor</h2>
        <div className="flex bg-white p-1 rounded-xl border shadow-sm">
          {[
            { id: 'add', icon: 'fa-plus' },
            { id: 'elements', icon: 'fa-shapes' },
            { id: 'content', icon: 'fa-pen' },
            { id: 'theme', icon: 'fa-palette' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              title={tab.id.toUpperCase()}
            >
              <i className={`fa-solid ${tab.icon} text-[11px]`}></i>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
        {activeTab === 'add' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* AI Magic Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-wand-magic-sparkles text-blue-600 text-xs"></i>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Magic Builder</h3>
              </div>
              <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
                <textarea 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="E.g., A professional hero section for a minimalist coffee shop in Tokyo..."
                  className="w-full text-[11px] p-3 bg-white border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-inner"
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-2">
                  {['hero', 'about', 'services'].map((type) => (
                    <button
                      key={type}
                      disabled={isGenerating || !aiPrompt}
                      onClick={() => handleAiGenerate(type as SectionType)}
                      className={`text-[9px] font-black uppercase py-2 rounded-lg border border-blue-200 transition-all ${isGenerating ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'}`}
                    >
                      {isGenerating ? '...' : `Generate ${type}`}
                    </button>
                  ))}
                </div>
                {isGenerating && (
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-blue-500 animate-pulse pt-1">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Gemini is crafting content...
                  </div>
                )}
              </div>
            </div>

            {/* Standard Sections */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Standard Sections</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'hero', icon: 'fa-rocket' },
                  { type: 'about', icon: 'fa-user' },
                  { type: 'services', icon: 'fa-briefcase' },
                  { type: 'pricing', icon: 'fa-tags' },
                  { type: 'contact', icon: 'fa-envelope' },
                  { type: 'custom', icon: 'fa-magic' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addSection(item.type as SectionType)}
                    className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 transition-all group shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50">
                      <i className={`fa-solid ${item.icon} text-slate-400 group-hover:text-blue-600`}></i>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{item.type}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Reordering</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">Click and drag sections in the preview using the <i className="fa-solid fa-grip-vertical"></i> handle.</p>
            </div>
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Custom Elements</h3>
             <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'heading', icon: 'fa-heading' },
                  { type: 'text', icon: 'fa-align-left' },
                  { type: 'button', icon: 'fa-square' },
                  { type: 'input', icon: 'fa-keyboard' },
                  { type: 'image', icon: 'fa-image' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addElement(item.type as any)}
                    className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 transition-all shadow-sm"
                  >
                    <i className={`fa-solid ${item.icon} text-slate-400 mb-1`}></i>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{item.type}</span>
                  </button>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
            {!activeSection ? (
              <div className="py-20 text-center space-y-4">
                <i className="fa-solid fa-mouse-pointer text-slate-200 text-4xl"></i>
                <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest">Select Section to Edit</p>
              </div>
            ) : (
              <div className="pb-10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">{activeSection.type} Content</span>
                  <button onClick={() => deleteSection(activeSection.id)} className="text-slate-300 hover:text-red-500 transition-colors" title="Delete Section"><i className="fa-solid fa-trash-can"></i></button>
                </div>
                
                <div className="space-y-6">
                  {/* Dynamic Fields for Built-in Sections */}
                  {Object.keys(activeSection.content).map(key => {
                    const value = activeSection.content[key];
                    if (typeof value === 'string') {
                      return (
                        <div key={key} className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {key === 'cta' ? 'Button Label' : key}
                          </label>
                          {key === 'text' || key === 'subtitle' || key === 'desc' ? (
                            <textarea 
                              className="w-full text-sm p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                              value={value} 
                              onChange={(e) => updateSectionContent(key, e.target.value)} 
                              rows={3} 
                            />
                          ) : (
                            <input 
                              type="text" 
                              className="w-full text-sm p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                              value={value} 
                              onChange={(e) => updateSectionContent(key, e.target.value)} 
                            />
                          )}
                        </div>
                      );
                    }

                    if (Array.isArray(value)) {
                      return (
                        <div key={key} className="space-y-4 pt-6 border-t mt-6">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key}</label>
                            <button 
                              onClick={() => addListItem(key, value[0] ? { ...value[0] } : { title: 'New Item', desc: '' })}
                              className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                            >
                              + ADD ITEM
                            </button>
                          </div>
                          <div className="space-y-4">
                            {value.map((item: any, idx: number) => (
                              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative shadow-inner">
                                <button onClick={() => removeListItem(key, idx)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500" title="Remove Item"><i className="fa-solid fa-circle-minus"></i></button>
                                {Object.keys(item).map(childKey => {
                                  if (childKey === 'features' && Array.isArray(item[childKey])) return null;
                                  return (
                                    <div key={childKey} className="mb-3 last:mb-0">
                                      <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block tracking-tight">{childKey}</label>
                                      <input 
                                        type="text" 
                                        className="w-full text-xs p-2 bg-white border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" 
                                        value={item[childKey]} 
                                        onChange={(e) => updateNestedContent(key, idx, childKey, e.target.value)} 
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}

                  {/* Manual Element Editing for 'Custom' Section */}
                  {activeSection.type === 'custom' && activeSection.elements && (
                    <div className="space-y-6 pt-6 border-t mt-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layout Elements</h3>
                      {activeSection.elements.map((el, idx) => (
                        <div key={el.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 relative group shadow-sm">
                           <div className="flex justify-between items-center mb-4">
                              <span className="text-[9px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-tighter">{el.type}</span>
                              <div className="flex gap-2">
                                 <button onClick={() => moveElement(el.id, 'up')} disabled={idx === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-20"><i className="fa-solid fa-arrow-up text-[10px]"></i></button>
                                 <button onClick={() => moveElement(el.id, 'down')} disabled={idx === activeSection.elements!.length - 1} className="text-slate-300 hover:text-slate-600 disabled:opacity-20"><i className="fa-solid fa-arrow-down text-[10px]"></i></button>
                                 <button onClick={() => removeElement(el.id)} className="text-slate-300 hover:text-red-500"><i className="fa-solid fa-trash text-[10px]"></i></button>
                              </div>
                           </div>
                           
                           <div className="space-y-3">
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                                  {el.type === 'image' ? 'Image URL' : el.type === 'button' ? 'Button Label' : el.type === 'input' ? 'Input Label' : 'Content Text'}
                                </label>
                                {el.type === 'text' ? (
                                  <textarea className="w-full text-xs p-2 bg-white border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" value={el.content} onChange={(e) => updateElementContent(el.id, { content: e.target.value })} rows={2} />
                                ) : (
                                  <input type="text" className="w-full text-xs p-2 bg-white border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" value={el.content} onChange={(e) => updateElementContent(el.id, { content: e.target.value })} />
                                )}
                              </div>
                              {el.type === 'input' && (
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Placeholder</label>
                                  <input type="text" className="w-full text-xs p-2 bg-white border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. Type something..." value={el.placeholder || ''} onChange={(e) => updateElementContent(el.id, { placeholder: e.target.value })} />
                                </div>
                              )}
                           </div>
                        </div>
                      ))}
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
                <label className="text-[10px] font-bold text-slate-500 block mb-3 uppercase">Primary Accent Color</label>
                <div className="grid grid-cols-6 gap-2">
                    {['#2563eb', '#db2777', '#10b981', '#f59e0b', '#6366f1', '#1e293b'].map(color => (
                      <button
                        key={color}
                        onClick={() => setConfig(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: color } }))}
                        className={`aspect-square rounded-full border-4 transition-all ${config.theme.primaryColor === color ? 'border-white ring-2 ring-slate-800 scale-110 shadow-lg' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                </div>
             </div>
             <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-2 uppercase tracking-tighter">Website Name</label>
                <input type="text" className="w-full text-sm p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={config.title} onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))} />
             </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-slate-50 border-t text-center">
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">SiteFlow Builder v2.0</span>
      </div>
    </div>
  );
};

export default Sidebar;

