import React, { useState } from 'react';
import { WebsiteConfig, Section, SectionType, Element } from '../types';
import { generateSectionContent } from '../services/geminiService';

interface SidebarProps {
  config: WebsiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<WebsiteConfig>>;
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
}

/* ---------------------------------- AI CONFIG ---------------------------------- */

const AI_SECTION_TYPES: SectionType[] = [
  'header',
  'hero',
  'about',
  'services',
  'pricing',
  'contact',
  'custom',
];

const isValidAIContent = (type: SectionType, data: any) => {
  if (!data || typeof data !== 'object') return false;

  if (type === 'header') return data.logo && Array.isArray(data.links);
  if (type === 'hero') return data.title && data.subtitle && data.cta;
  if (type === 'services') return data.title && Array.isArray(data.items);
  if (type === 'pricing') return data.title && Array.isArray(data.plans);
  if (type === 'about') return data.title;
  if (type === 'contact') return data.title;
  if (type === 'custom') return true;

  return true;
};

/* ---------------------------------- COMPONENT ---------------------------------- */

const Sidebar: React.FC<SidebarProps> = ({
  config,
  setConfig,
  activeSectionId,
  setActiveSectionId,
}) => {
  const [activeTab, setActiveTab] =
    useState<'add' | 'elements' | 'content' | 'theme'>('add');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeSection = config.sections.find(s => s.id === activeSectionId);

  /* ---------------------------------- SECTION HELPERS ---------------------------------- */

  const updateSectionContent = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === activeSectionId
          ? { ...s, content: { ...s.content, [key]: value } }
          : s
      ),
    }));
  };

  const updateNestedContent = (
    parentKey: string,
    index: number,
    childKey: string,
    value: any
  ) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== activeSectionId) return s;
        const items = [...(s.content[parentKey] || [])];
        items[index] = { ...items[index], [childKey]: value };
        return { ...s, content: { ...s.content, [parentKey]: items } };
      }),
    }));
  };

  const addListItem = (parentKey: string, template: any) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === activeSectionId
          ? {
              ...s,
              content: {
                ...s.content,
                [parentKey]: [...(s.content[parentKey] || []), template],
              },
            }
          : s
      ),
    }));
  };

  const removeListItem = (parentKey: string, index: number) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === activeSectionId
          ? {
              ...s,
              content: {
                ...s.content,
                [parentKey]: s.content[parentKey].filter(
                  (_: any, i: number) => i !== index
                ),
              },
            }
          : s
      ),
    }));
  };

  /* ---------------------------------- ELEMENT HELPERS ---------------------------------- */

  const addElement = (type: Element['type']) => {
    if (!activeSection || activeSection.type !== 'custom') {
      alert("Select a 'Custom' section first.");
      return;
    }

    const newElement: Element = {
      id: crypto.randomUUID(),
      type,
      content:
        type === 'heading'
          ? 'Heading Text'
          : type === 'text'
          ? 'Descriptive text goes here.'
          : type === 'button'
          ? 'Click Me'
          : type === 'image'
          ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
          : '',
      placeholder: type === 'input' ? 'Placeholder...' : undefined,
    };

    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === activeSectionId
          ? { ...s, elements: [...(s.elements || []), newElement] }
          : s
      ),
    }));

    setActiveTab('content');
  };

  const updateElementContent = (id: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === activeSectionId
          ? {
              ...s,
              elements: s.elements?.map(el =>
                el.id === id ? { ...el, content: value } : el
              ),
            }
          : s
      ),
    }));
  };

  const removeElement = (id: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === activeSectionId
          ? { ...s, elements: s.elements?.filter(el => el.id !== id) }
          : s
      ),
    }));
  };

  /* ---------------------------------- ADD SECTION ---------------------------------- */

  const addSection = (type: SectionType) => {
    const id = `${type}-${Date.now()}`;
    let content: any = { title: `New ${type}` };
    let elements: Element[] | undefined = undefined;

    if (type === 'hero')
      content = {
        title: 'Welcome to Your Brand',
        subtitle: 'We build modern experiences.',
        cta: 'Get Started',
        image:
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174',
      };

    if (type === 'services')
      content = {
        title: 'Our Services',
        items: [{ title: 'Design', desc: 'Clean UI & UX' }],
      };

    if (type === 'pricing')
      content = {
        title: 'Pricing',
        plans: [{ name: 'Starter', price: '0', features: ['Basic Tools'] }],
      };

    if (type === 'custom') {
      content = { title: 'Custom Section' };
      elements = [];
    }

    const section: Section = { id, type, content, elements };

    setConfig(prev => ({
      ...prev,
      sections: [...prev.sections, section],
    }));

    setActiveSectionId(id);
    setActiveTab(type === 'custom' ? 'elements' : 'content');
  };

  /* ---------------------------------- AI BUILDER ---------------------------------- */

  const handleAiGenerate = async (type: SectionType) => {
    if (!aiPrompt.trim()) {
      alert('Describe what you want Spark AI to build.');
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateSectionContent(type, aiPrompt);

      if (!isValidAIContent(type, result)) {
        alert('AI returned invalid content. Try again.');
        return;
      }

      const { elements: aiElements, ...cleanContent } = result;

      const elements =
        type === 'custom' && Array.isArray(aiElements)
          ? aiElements.map((el: any) => ({
              ...el,
              id: crypto.randomUUID(),
            }))
          : undefined;

      const section: Section = {
        id: `${type}-ai-${Date.now()}`,
        type,
        content: cleanContent,
        elements,
      };

      setConfig(prev => ({
        ...prev,
        sections: [...prev.sections, section],
      }));

      setActiveSectionId(section.id);
      setActiveTab(type === 'custom' ? 'elements' : 'content');
      setAiPrompt('');
    } catch (e) {
      console.error(e);
      alert('Spark AI failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <div className="w-80 h-full bg-white border-r flex flex-col shadow-xl">
      <div className="p-4 border-b flex justify-between">
        <h2 className="font-black">Spark Editor</h2>
        <div className="flex gap-1">
          {['add', 'elements', 'content', 'theme'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-2 text-xs ${
                activeTab === tab ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'add' && (
          <>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Describe your section..."
              className="w-full p-2 border rounded mb-3"
            />
            <div className="grid grid-cols-2 gap-2 mb-6">
              {AI_SECTION_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => handleAiGenerate(type)}
                  disabled={isGenerating}
                  className="border rounded p-2 text-xs"
                >
                  {isGenerating ? '...' : type}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {AI_SECTION_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="border rounded p-2 text-xs"
                >
                  Add {type}
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === 'elements' &&
          activeSection?.type === 'custom' &&
          ['heading', 'text', 'button', 'input', 'image'].map(type => (
            <button
              key={type}
              onClick={() => addElement(type as any)}
              className="block w-full mb-2 border p-2"
            >
              Add {type}
            </button>
          ))}

        {activeTab === 'content' &&
          activeSection &&
          Object.keys(activeSection.content).map(key => (
            <div key={key} className="mb-3">
              <label className="text-xs uppercase">{key}</label>
              <textarea
                value={activeSection.content[key]}
                onChange={e => updateSectionContent(key, e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}

        {activeTab === 'content' &&
          activeSection?.elements?.map(el => (
            <div key={el.id} className="border p-2 mb-2">
              <input
                value={el.content}
                onChange={e => updateElementContent(el.id, e.target.value)}
                className="w-full"
              />
              <button
                onClick={() => removeElement(el.id)}
                className="text-red-500 text-xs mt-1"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
