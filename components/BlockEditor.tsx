import React, { useState, useEffect, useRef } from 'react';
import { ContentBlock, BlockType } from '../types';
import { Trash2, GripVertical, Image as ImageIcon, Code, Type, MessageSquare, Eye, Edit2 } from 'lucide-react';
import { BlockRenderer } from './BlockRenderer';

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  theme?: 'light' | 'dark' | 'eyecare';
}

const EditorBlockItem = ({ 
  block, 
  index, 
  totalCount, 
  updateBlock, 
  removeBlock, 
  moveBlock, 
  theme,
  s 
}: any) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea effect
  useEffect(() => {
    if ((block.type === 'text' || block.type === 'code' || block.type === 'callout') && textareaRef.current && !isPreview) {
      // Reset height to auto to get the correct scrollHeight for shrinking
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight to fit content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [block.content, isPreview, block.type]);

  return (
    <div className={`group relative border rounded-lg p-3 transition-colors ${s.cardBg} ${s.cardBorder} ${s.hoverBorder}`}>
      
      {/* Controls */}
      <div className={`absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border rounded-md p-1 z-10 ${s.controlBg}`}>
        <button 
          onClick={() => moveBlock(index, 'up')}
          className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          disabled={index === 0}
          title="上移"
        >
          ↑
        </button>
        <button 
          onClick={() => moveBlock(index, 'down')}
          className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          disabled={index === totalCount - 1}
          title="下移"
        >
          ↓
        </button>
        <div className={`w-[1px] h-4 mx-1 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
        <button 
          onClick={() => removeBlock(block.id)}
          className="p-1 hover:bg-red-50 text-red-500 rounded"
          title="删除"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex gap-3">
        <div className="mt-2 text-gray-300 cursor-move">
          <GripVertical size={16} />
        </div>
        
        <div className="flex-1 min-w-0">
          
          {/* TEXT BLOCK */}
          {block.type === 'text' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                 <div className={`flex items-center p-1 rounded-md ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <button
                      onClick={() => setIsPreview(false)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${!isPreview ? (theme === 'dark' ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => setIsPreview(true)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${isPreview ? (theme === 'dark' ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      预览
                    </button>
                 </div>
                 <span className={`text-[10px] ${s.placeholder}`}>支持 Markdown & LaTeX</span>
              </div>

              {isPreview ? (
                <div className={`p-4 rounded-md border min-h-[4rem] ${theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
                   <BlockRenderer block={block} theme={theme} />
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  className={`w-full p-2 border-none resize-none focus:ring-0 text-base leading-relaxed ${s.cardBg} ${s.text} ${s.placeholder}`}
                  placeholder="输入文本内容..."
                  rows={1}
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  style={{ minHeight: '80px', overflow: 'hidden' }}
                />
              )}
            </div>
          )}

          {/* CODE BLOCK */}
          {block.type === 'code' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <select 
                  value={block.language}
                  onChange={(e) => updateBlock(block.id, { language: e.target.value })}
                  className={`text-xs border rounded px-2 py-1 focus:outline-none focus:border-indigo-500 ${s.inputBg} ${s.inputBorder} ${s.text}`}
                >
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                  <option value="go">Go</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="sql">SQL</option>
                </select>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Code size={12} />
                  <span>代码块</span>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                className={`w-full p-3 font-mono text-sm border rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none ${s.inputBg} ${s.inputBorder} ${s.text} ${s.placeholder}`}
                placeholder="// 粘贴代码到这里..."
                rows={3}
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                style={{ minHeight: '120px', overflow: 'hidden' }}
              />
            </div>
          )}

          {/* IMAGE BLOCK */}
          {block.type === 'image' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                  <ImageIcon size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-400">图片</span>
              </div>
              <input
                type="text"
                className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none ${s.cardBg} ${s.inputBorder} ${s.text} ${s.placeholder}`}
                placeholder="图片 URL (例如 https://...)"
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              />
              {block.content && (
                <div className="relative h-40 w-full bg-gray-100 rounded overflow-hidden border border-dashed border-gray-300">
                  <img src={block.content} alt="Preview" className="h-full w-full object-contain" />
                </div>
              )}
              <input
                type="text"
                className={`w-full p-2 border-b text-xs focus:outline-none ${s.cardBg} ${theme === 'dark' ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-500'}`}
                placeholder="图片说明 (可选)"
                value={block.caption || ''}
                onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
              />
            </div>
          )}

          {/* CALLOUT BLOCK */}
          {block.type === 'callout' && (
            <div className="flex gap-2">
              <div className="w-1 bg-amber-400 rounded-full flex-shrink-0"></div>
              <textarea
                ref={textareaRef}
                className={`w-full p-2 rounded border-none resize-none focus:ring-0 text-sm ${theme === 'dark' ? 'bg-amber-900/20 text-gray-300 placeholder-amber-700' : 'bg-amber-50 text-amber-900 placeholder-amber-300'}`}
                placeholder="重要的提示或备注..."
                rows={1}
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                style={{ minHeight: '40px', overflow: 'hidden' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange, theme = 'light' }) => {
  
  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      language: type === 'code' ? 'java' : undefined,
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === blocks.length - 1)
    ) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          cardBg: 'bg-gray-800',
          cardBorder: 'border-gray-700',
          hoverBorder: 'hover:border-indigo-500',
          controlBg: 'bg-gray-800 border-gray-700',
          text: 'text-gray-200',
          inputBg: 'bg-gray-900',
          inputBorder: 'border-gray-700',
          placeholder: 'placeholder-gray-600',
          btnBg: 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700',
        };
      case 'eyecare':
        return {
          cardBg: 'bg-[#baddbf]',
          cardBorder: 'border-[#a5c6aa]',
          hoverBorder: 'hover:border-[#8cb090]',
          controlBg: 'bg-[#baddbf] border-[#a5c6aa]',
          text: 'text-[#2c3e50]',
          inputBg: 'bg-[#e6f5e8]',
          inputBorder: 'border-[#a5c6aa]',
          placeholder: 'placeholder-[#8cb090]',
          btnBg: 'bg-[#e6f5e8] border-[#a5c6aa] text-[#2c3e50] hover:bg-[#c7edcc]',
        };
      default:
        return {
          cardBg: 'bg-white',
          cardBorder: 'border-gray-200',
          hoverBorder: 'hover:border-indigo-300',
          controlBg: 'bg-white border-gray-100',
          text: 'text-gray-700',
          inputBg: 'bg-gray-50',
          inputBorder: 'border-gray-200',
          placeholder: 'placeholder-gray-300',
          btnBg: 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50',
        };
    }
  };

  const s = getThemeStyles();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <EditorBlockItem 
            key={block.id}
            block={block}
            index={index}
            totalCount={blocks.length}
            updateBlock={updateBlock}
            removeBlock={removeBlock}
            moveBlock={moveBlock}
            theme={theme}
            s={s}
          />
        ))}
      </div>

      {/* Add Buttons */}
      <div className={`flex gap-2 justify-center py-4 border-t border-dashed ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <button onClick={() => addBlock('text')} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:text-indigo-600 transition-colors ${s.btnBg}`}>
          <Type size={16} /> 文本
        </button>
        <button onClick={() => addBlock('code')} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:text-indigo-600 transition-colors ${s.btnBg}`}>
          <Code size={16} /> 代码
        </button>
        <button onClick={() => addBlock('image')} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:text-indigo-600 transition-colors ${s.btnBg}`}>
          <ImageIcon size={16} /> 图片
        </button>
        <button onClick={() => addBlock('callout')} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:text-indigo-600 transition-colors ${s.btnBg}`}>
          <MessageSquare size={16} /> 提示框
        </button>
      </div>
    </div>
  );
};
