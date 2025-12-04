
import React, { useState, useEffect } from 'react';
import { ContentBlock } from '../types';
import { Copy, Bot, Check, Lightbulb } from 'lucide-react';
import { explainCode } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';

interface BlockRendererProps {
  block: ContentBlock;
  theme?: 'light' | 'dark' | 'eyecare';
}

// Helper for rainbow colors based on nesting depth
const getRainbowColor = (depth: number, theme: 'light' | 'dark' | 'eyecare') => {
  const colors = {
    // Updated Dark Mode colors to be brighter/neon as requested
    dark: ['#ffd700', '#ff79c6', '#8be9fd'], // Gold, Hot Pink, Cyan
    light: ['#0451a5', '#098658', '#af00db'], // Blue, Green, Purple
    eyecare: ['#8b4513', '#006400', '#00008b'], // SaddleBrown, DarkGreen, DarkBlue
  };
  const palette = colors[theme] || colors.light;
  return palette[depth % palette.length];
};

// Simple syntax highlighting tailored for themes
const syntaxHighlight = (code: string, theme: 'light' | 'dark' | 'eyecare') => {
  if (!code) return [];

  // Enhanced tokenizer:
  // 1. Comments (// or /* ... */)
  // 2. Strings ("..." or '...')
  // 3. Delimiters/Brackets
  // 4. Whitespace
  const tokens = code.split(/(\/\/.*|\/\*[\s\S]*?\*\/|"[^"]*"|'[^']*'|[(){}\[\],;.]|\s+)/g).filter(Boolean);

  let bracketDepth = 0;

  return tokens.map((token, i) => {
    // Comments
    if (token.startsWith('//') || token.startsWith('/*')) {
      return <span key={i} className={theme === 'dark' ? "text-[#6a9955] italic" : "text-[#4b9f52] italic"}>{token}</span>;
    }

    // Strings
    if (token.startsWith('"') || token.startsWith("'")) {
       return <span key={i} className={theme === 'dark' ? "text-[#ce9178]" : "text-[#a31515]"}>{token}</span>;
    }

    // Brackets (Rainbow Logic)
    if (/^[(){}\[\]]$/.test(token)) {
      const isOpen = '({['.includes(token);
      let colorIndex;
      
      if (isOpen) {
        colorIndex = bracketDepth;
        bracketDepth++;
      } else {
        bracketDepth = Math.max(0, bracketDepth - 1);
        colorIndex = bracketDepth;
      }
      
      return <span key={i} style={{ color: getRainbowColor(colorIndex, theme) }}>{token}</span>;
    }
    
    // Keywords
    if (/^(class|new|return|void|int|boolean|if|else|for|while|break|continue|static|public|private|import|package|var|let|const|function|this|def|None|True|False|self|range|in|len|typeof|instanceof|try|catch|finally|throw|async|await)$/.test(token)) {
      return <span key={i} className={theme === 'dark' ? "text-[#569cd6] font-bold" : "text-[#0d4aa6] font-bold"}>{token}</span>;
    }

    // Types/Classes
    if (/^[A-Z][a-zA-Z0-9]*$/.test(token) && !/^(true|false|null|Map|Set|List)$/.test(token)) {
      return <span key={i} className={theme === 'dark' ? "text-[#4ec9b0]" : "text-[#267f99]"}>{token}</span>;
    }
    
    // Numbers
    if (/^\d+$/.test(token)) {
       return <span key={i} className={theme === 'dark' ? "text-[#b5cea8]" : "text-[#098658]"}>{token}</span>;
    }

    // Annotations
    if (token.startsWith('@')) {
      return <span key={i} className={theme === 'dark' ? "text-[#dcdcaa]" : "text-[#795e26]"}>{token}</span>;
    }

    return <span key={i} className={theme === 'dark' ? "text-[#d4d4d4]" : "text-[#24292e]"}>{token}</span>;
  });
};

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, theme = 'light' }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // State for currently displayed language in Read Mode
  const [activeLang, setActiveLang] = useState(block.language || 'java');

  // Update active language if block changes externally
  useEffect(() => {
    if (block.language) {
      setActiveLang(block.language);
    }
  }, [block.language]);

  const handleCopy = () => {
    const contentToCopy = block.codeSnippets ? (block.codeSnippets[activeLang] || block.content) : block.content;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExplain = async () => {
    setLoading(true);
    const codeContent = block.codeSnippets ? (block.codeSnippets[activeLang] || block.content) : block.content;
    const result = await explainCode(codeContent, activeLang);
    setExplanation(result);
    setLoading(false);
  };

  const getCodeStyles = () => {
    switch(theme) {
      case 'dark':
        return {
          wrapper: 'bg-[#1e1e1e] border-[#333]',
          header: 'bg-[#252526] border-[#333]',
          body: 'bg-[#1e1e1e]',
          lineNum: 'text-[#858585] border-[#333] bg-[#1e1e1e]',
          tabActive: 'bg-[#1e1e1e] text-white border-blue-400',
          tabInactive: 'text-[#969696] hover:text-[#ccc]',
          btn: 'text-[#ccc] hover:bg-[#333]',
          langTag: 'text-[#444]'
        };
      case 'eyecare':
        return {
          wrapper: 'bg-[#e6f5e8] border-[#a5c6aa]',
          header: 'bg-[#dcecd0] border-[#a5c6aa]',
          body: 'bg-[#e6f5e8]',
          lineNum: 'text-[#8cb090] border-[#a5c6aa] bg-[#dcecd0]',
          tabActive: 'bg-[#e6f5e8] text-[#2c3e50] border-green-600',
          tabInactive: 'text-[#5d6b75] hover:text-[#2c3e50]',
          btn: 'text-[#5d6b75] hover:bg-[#c7edcc]',
          langTag: 'text-[#a5c6aa]'
        };
      default: // light
        return {
          wrapper: 'bg-[#f7f9fa] border-[#dce4e9]',
          header: 'bg-[#eef3f6] border-[#dce4e9]',
          body: 'bg-[#fafbfc]',
          lineNum: 'text-gray-300 border-gray-200 bg-[#fafbfc]',
          tabActive: 'bg-white text-gray-800 border-blue-500',
          tabInactive: 'text-gray-500 hover:text-gray-700',
          btn: 'text-gray-600 hover:bg-indigo-50',
          langTag: 'text-gray-300'
        };
    }
  };

  const styles = getCodeStyles();

  switch (block.type) {
    case 'text':
      return (
        <div id={block.id} className={`mb-6 leading-relaxed text-base block-markdown ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
           <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({node, ...props}) => <h1 className={`text-2xl font-bold mt-6 mb-4 border-b pb-2 ${theme === 'dark' ? 'text-white border-gray-700' : 'text-gray-900 border-gray-200'}`} {...props} />,
              h2: ({node, ...props}) => <h2 className={`text-xl font-bold mt-6 mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`} {...props} />,
              h3: ({node, ...props}) => <h3 className={`text-lg font-bold mt-5 mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`} {...props} />,
              p: ({node, ...props}) => <p className="mb-4" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className={`border-l-4 pl-4 italic my-4 ${theme === 'dark' ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'}`} {...props} />,
              a: ({node, ...props}) => <a className="text-blue-500 hover:underline" {...props} />,
              ul: ({node, ...props}) => <ul className={`list-disc pl-5 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} {...props} />,
              ol: ({node, ...props}) => <ol className={`list-decimal pl-5 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              code: ({node, inline, className, children, ...props}: any) => {
                return inline ? (
                  <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${theme === 'dark' ? 'bg-gray-800 text-pink-400' : 'bg-gray-100 text-pink-600'}`} {...props}>
                    {children}
                  </code>
                ) : (
                  <div className={`rounded-md p-4 overflow-x-auto border mb-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                    <code className="text-sm font-mono" {...props}>
                      {children}
                    </code>
                  </div>
                );
              },
              table: ({node, ...props}) => <div className="overflow-x-auto mb-4"><table className={`min-w-full divide-y border ${theme === 'dark' ? 'divide-gray-700 border-gray-700' : 'divide-gray-200 border-gray-200'}`} {...props} /></div>,
              th: ({node, ...props}) => <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider border-b ${theme === 'dark' ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-500 border-gray-200'}`} {...props} />,
              td: ({node, ...props}) => <td className={`px-3 py-2 whitespace-nowrap text-sm border-b ${theme === 'dark' ? 'text-gray-300 border-gray-700' : 'text-gray-600 border-gray-100'}`} {...props} />,
            }}
           >
             {block.content}
           </ReactMarkdown>
        </div>
      );

    case 'code':
      // Determine available languages: either keys from snippets, or just the single language
      const snippets = block.codeSnippets || { [block.language || 'java']: block.content };
      const availableLangs = Object.keys(snippets);
      // Ensure specific order if possible, or just standard
      const standardOrder = ['java', 'cpp', 'python', 'go', 'javascript', 'typescript'];
      const sortedLangs = availableLangs.sort((a, b) => {
        const idxA = standardOrder.indexOf(a);
        const idxB = standardOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      });

      const displayContent = snippets[activeLang] || block.content || '';
      const lines = displayContent.split('\n');

      return (
        <div id={block.id} className="mb-8 mt-4 group">
          <div className={`rounded-lg overflow-hidden border ${styles.wrapper}`}>
            
            {/* Header / Tabs */}
            <div className={`flex justify-between items-center border-b ${styles.header} overflow-x-auto custom-scrollbar`}>
              <div className="flex">
                 {sortedLangs.map(lang => (
                   <button 
                     key={lang}
                     onClick={() => setActiveLang(lang)}
                     className={`px-4 py-2 text-sm font-medium cursor-pointer border-t-2 capitalize whitespace-nowrap outline-none
                       ${lang === activeLang 
                         ? styles.tabActive
                         : `border-transparent ${styles.tabInactive}`
                       }`}
                   >
                     {lang}
                   </button>
                 ))}
              </div>
              
              <div className="flex items-center gap-1 pr-2 pl-2">
                 <button 
                  onClick={handleExplain}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${styles.btn}`}
                  title="让 AI 解释代码"
                >
                  <Bot size={14} />
                  <span className="hidden sm:inline">AI 解释</span>
                </button>
                <div className={`w-[1px] h-4 mx-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <button 
                  onClick={handleCopy}
                  className={`p-1.5 rounded transition-colors ${styles.btn}`}
                  title="复制代码"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className={`relative overflow-x-auto ${styles.body}`}>
              <div className="flex text-sm font-mono leading-6 p-4 min-w-[500px]">
                <div className={`flex-shrink-0 flex flex-col items-end select-none pr-4 border-r mr-4 ${styles.lineNum}`}>
                   {lines.map((_, i) => (
                     <span key={i} className="h-6 leading-6">{i + 1}</span>
                   ))}
                </div>
                
                <pre className="flex-1 w-full outline-none">
                  {syntaxHighlight(displayContent, theme as 'light' | 'dark' | 'eyecare')}
                </pre>
              </div>
            </div>
          </div>
          
          {loading && (
            <div className={`mt-2 p-3 rounded-md text-sm flex items-center gap-2 animate-pulse ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
              <Bot size={16} /> Gemini 正在分析 {activeLang} 代码...
            </div>
          )}
          {explanation && (
            <div className={`mt-3 p-4 border rounded-lg shadow-sm text-sm ring-1 ${theme === 'dark' ? 'bg-gray-800 border-indigo-900 text-gray-200 ring-indigo-900' : 'bg-white border-indigo-100 text-gray-800 ring-indigo-50'}`}>
              <div className={`flex justify-between items-start mb-2 border-b pb-2 ${theme === 'dark' ? 'border-indigo-900' : 'border-indigo-50'}`}>
                <h4 className={`font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'}`}>
                  <Bot size={16} /> AI 代码解析 ({activeLang})
                </h4>
                <button onClick={() => setExplanation(null)} className="opacity-60 hover:opacity-100">&times;</button>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{explanation}</div>
            </div>
          )}
        </div>
      );

    case 'image':
      return (
        <div id={block.id} className="mb-6">
          <div className={`rounded-lg overflow-hidden border shadow-sm ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
             <img 
               src={block.content || 'https://picsum.photos/800/400'} 
               alt={block.caption || 'Problem visual'} 
               className={`w-full h-auto object-cover ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://picsum.photos/800/400?grayscale';
               }}
             />
          </div>
          {block.caption && (
            <p className={`mt-2 text-center text-sm italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{block.caption}</p>
          )}
        </div>
      );

    case 'callout':
      return (
        <div id={block.id} className={`mb-6 p-4 border-l-4 rounded-r-lg shadow-sm ${theme === 'dark' ? 'border-amber-600 bg-amber-900/20 text-gray-300' : 'border-amber-400 bg-amber-50 text-gray-700'}`}>
          <div className={`flex items-center gap-2 font-bold mb-1 ${theme === 'dark' ? 'text-amber-500' : 'text-amber-800'}`}>
             <Lightbulb size={16} />
             <span>注意</span>
          </div>
          <div className="text-sm opacity-90 block-markdown">
            <ReactMarkdown 
              remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]} 
              rehypePlugins={[rehypeKatex]}
              components={{ p: ({node, ...props}) => <span {...props} /> }}
            >
              {block.content}
            </ReactMarkdown>
          </div>
        </div>
      );

    default:
      return null;
  }
};
