import React from 'react';
import { ContentBlock, BlockType } from '../types';
import { Trash2, GripVertical, Image as ImageIcon, Code, Type, MessageSquare } from 'lucide-react';

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  theme?: 'light' | 'dark' | 'eyecare';
}

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
          <div key={block.id} className={`group relative border rounded-lg p-3 transition-colors ${s.cardBg} ${s.cardBorder} ${s.hoverBorder}`}>
            
            {/* Controls */}
            <div className={`absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border rounded-md p-1 z-10 ${s.controlBg}`}>
              <button 
                onClick={() => moveBlock(index, 'up')}
                className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                disabled={index === 0}
              >
                ↑
              </button>
              <button 
                onClick={() => moveBlock(index, 'down')}
                className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                disabled={index === blocks.length - 1}
              >
                ↓
              </button>
              <div className={`w-[1px] h-4 mx-1 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
              <button 
                onClick={() => removeBlock(block.id)}
                className="p-1 hover:bg-red-50 text-red-500 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Content Input */}
            <div className="flex gap-3">
              <div className="mt-2 text-gray-300 cursor-move">
                <GripVertical size={16} />
              </div>
              
              <div className="flex-1">
                {block.type === 'text' && (
                  <textarea
                    className={`w-full p-2 border-none resize-y focus:ring-0 text-base ${s.cardBg} ${s.text} ${s.placeholder}`}
                    placeholder="输入文本内容 (支持 markdown 格式)..."
                    rows={3}
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  />
                )}

                {block.type === 'code' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
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
                    </div>
                    <textarea
                      className={`w-full p-3 font-mono text-sm border rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none ${s.inputBg} ${s.inputBorder} ${s.text} ${s.placeholder}`}
                      placeholder="// 粘贴代码到这里..."
                      rows={8}
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    />
                  </div>
                )}

                {block.type === 'image' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none ${s.cardBg} ${s.inputBorder} ${s.text} ${s.placeholder}`}
                      placeholder="图片 URL (例如 https://...)"
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    />
                    {block.content && (
                      <div className="relative h-40 w-full bg-gray-100 rounded overflow-hidden">
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

                {block.type === 'callout' && (
                  <div className="flex gap-2">
                    <div className="w-1 bg-amber-400 rounded-full"></div>
                    <textarea
                      className={`w-full p-2 rounded border-none resize-none focus:ring-0 text-sm ${theme === 'dark' ? 'bg-amber-900/20 text-gray-300 placeholder-amber-700' : 'bg-amber-50 text-amber-900 placeholder-amber-300'}`}
                      placeholder="重要的提示或备注..."
                      rows={2}
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
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