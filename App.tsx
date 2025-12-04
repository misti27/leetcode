import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, BookOpen, Star, Plus, ExternalLink, 
  Layout, Hash, Tag, Save, Edit3, ChevronRight,
  Github, Moon, Sun, Eye, List, Tags as TagsIcon, ChevronDown
} from 'lucide-react';
import { Problem, Difficulty } from './types';
import { BlockRenderer } from './components/BlockRenderer';
import { BlockEditor } from './components/BlockEditor';

// --- Mock Initial Data (Chinese) ---
const INITIAL_PROBLEMS: Problem[] = [
  {
    id: '46',
    title: '46. 全排列 (Permutations)',
    link: 'https://leetcode.cn/problems/permutations/',
    difficulty: 'Medium',
    tags: ['数组', '回溯'],
    isFavorite: true,
    lastEdited: Date.now(),
    blocks: [
      { id: '101', type: 'text', content: '给定一个不含重复数字的数组 `nums` ，返回其 **所有可能的全排列** 。你可以 **按任意顺序** 返回答案。' },
      { id: '102', type: 'callout', content: '注意：输入数组中的整数是互不相同的，这意味着我们不需要处理重复元素带来的去重问题。' },
      { id: '103', type: 'text', content: '### 解题思路：回溯算法\n\n全排列问题是典型的回溯算法应用场景。我们需要穷举所有可能的排列组合。\n\n**核心思想**：\n1. **路径**：也就是已经做出的选择。\n2. **选择列表**：当前可以做出的选择。\n3. **结束条件**：到达决策树底层，无法再做选择。\n\n我们可以将问题看作一棵 $N$ 叉树。' },
      { id: '104', type: 'code', language: 'java', content: `class Solution {

    List<List<Integer>> res = new LinkedList<>();

    /* 主函数，输入一组不重复的数字，返回它们的全排列 */
    List<List<Integer>> permute(int[] nums) {
        // 记录「路径」
        LinkedList<Integer> track = new LinkedList<>();
        // 「路径」中的元素会被标记为 true，避免重复使用
        boolean[] used = new boolean[nums.length];

        backtrack(nums, track, used);
        return res;
    }

    // 路径：记录在 track 中
    // 选择列表：nums 中不存在于 track 的那些元素（used[i] 为 false）
    // 结束条件：nums 中的元素全都在 track 中出现
    void backtrack(int[] nums, LinkedList<Integer> track, boolean[] used) {
        // 触发结束条件
        if (track.size() == nums.length) {
            res.add(new LinkedList(track));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            // 排除不合法的选择
            if (used[i]) {
                continue;
            }
            // 做选择
            track.add(nums[i]);
            used[i] = true;
            
            // 进入下一层决策树
            backtrack(nums, track, used);
            
            // 取消选择
            track.removeLast();
            used[i] = false;
        }
    }
}` },
      { id: '105', type: 'text', content: '### 复杂度分析\n\n- **时间复杂度**: $O(n \\times n!)$，其中 $n$ 为数组长度。全排列共有 $n!$ 种，每次复制需要 $O(n)$。\n- **空间复杂度**: $O(n)$，递归树深度为 $n$，`track` 列表长度为 $n$。' }
    ]
  },
  {
    id: '146',
    title: '146. LRU 缓存 (LRU Cache)',
    link: 'https://leetcode.cn/problems/lru-cache/',
    difficulty: 'Medium',
    tags: ['设计', '哈希表', '链表', '双向链表'],
    isFavorite: false,
    lastEdited: Date.now() - 100000,
    blocks: [
      { id: '201', type: 'text', content: '请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。' },
      { id: '203', type: 'code', language: 'javascript', content: `/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    this.capacity = capacity;
    this.map = new Map();
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (this.map.has(key)) {
        let val = this.map.get(key);
        this.map.delete(key);
        this.map.set(key, val);
        return val;
    }
    return -1;
};` }
    ]
  }
];

type Theme = 'light' | 'dark' | 'eyecare';

export default function App() {
  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem('leetnotes-data');
    return saved ? JSON.parse(saved) : INITIAL_PROBLEMS;
  });
  
  const [selectedId, setSelectedId] = useState<string>(problems[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarMode, setSidebarMode] = useState<'list' | 'tags'>('list');
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  
  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('leetnotes-theme') as Theme) || 'light';
  });
  
  // Temporary state for editing
  const [editForm, setEditForm] = useState<Partial<Problem>>({});

  useEffect(() => {
    localStorage.setItem('leetnotes-data', JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem('leetnotes-theme', theme);
    // Apply dark class to body for global scrollbars etc if needed
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const selectedProblem = problems.find(p => p.id === selectedId);

  // --- Handlers ---

  const handleSelectProblem = (id: string) => {
    if (isEditing) {
      if (!confirm("你有未保存的更改。确定要放弃吗？")) return;
    }
    setSelectedId(id);
    setIsEditing(false);
  };

  const handleCreateNew = () => {
    const newId = Date.now().toString();
    const newProblem: Problem = {
      id: newId,
      title: '新题目',
      link: '',
      difficulty: 'Easy',
      tags: [],
      blocks: [{ id: '0', type: 'text', content: '在这里输入内容...' }],
      lastEdited: Date.now(),
      isFavorite: false,
    };
    setProblems([newProblem, ...problems]);
    setSelectedId(newId);
    setEditForm(newProblem);
    setIsEditing(true);
    setSidebarMode('list');
  };

  const startEditing = () => {
    if (!selectedProblem) return;
    setEditForm(JSON.parse(JSON.stringify(selectedProblem)));
    setIsEditing(true);
  };

  const saveChanges = () => {
    if (!editForm.id) return;
    
    setProblems(prev => prev.map(p => 
      p.id === editForm.id 
        ? { ...p, ...editForm, lastEdited: Date.now() } as Problem 
        : p
    ));
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (selectedProblem?.title === '新题目' && selectedProblem.link === '') {
      setProblems(prev => prev.filter(p => p.id !== selectedProblem.id));
      setSelectedId(problems[0]?.id || '');
    }
  };

  const handleDelete = () => {
    if (!confirm("确定要删除这个笔记吗？")) return;
    const newProblems = problems.filter(p => p.id !== selectedId);
    setProblems(newProblems);
    setSelectedId(newProblems[0]?.id || '');
    setIsEditing(false);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProblems(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const toggleTag = (tag: string) => {
    const newSet = new Set(expandedTags);
    if (newSet.has(tag)) newSet.delete(tag);
    else newSet.add(tag);
    setExpandedTags(newSet);
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('eyecare');
    else setTheme('light');
  };

  const scrollToBlock = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- Render Helpers ---

  const getDifficultyColor = (diff: Difficulty) => {
    // These colors need to adapt to theme slightly or stay vibrant
    if (theme === 'dark') {
      switch (diff) {
        case 'Easy': return 'bg-green-900/30 text-green-400 border-green-800';
        case 'Medium': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800';
        case 'Hard': return 'bg-red-900/30 text-red-400 border-red-800';
        default: return 'bg-gray-800 text-gray-400';
      }
    }
    // Light & Eyecare
    switch (diff) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // --- Theme Style Mappings ---
  const themeClasses = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-800',
      textMuted: 'text-gray-500',
      headerBg: 'bg-white',
      headerBorder: 'border-gray-200',
      sidebarBg: 'bg-gray-50',
      sidebarBorder: 'border-gray-200',
      inputBg: 'bg-gray-100',
      inputFocus: 'focus:bg-white',
      cardHover: 'hover:bg-white hover:border-gray-200',
      cardSelected: 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100',
      tagBg: 'bg-gray-100',
      divider: 'border-gray-100',
      scrollbarThumb: 'bg-gray-300',
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      textMuted: 'text-gray-400',
      headerBg: 'bg-gray-900',
      headerBorder: 'border-gray-800',
      sidebarBg: 'bg-gray-800/50',
      sidebarBorder: 'border-gray-800',
      inputBg: 'bg-gray-800',
      inputFocus: 'focus:bg-gray-800',
      cardHover: 'hover:bg-gray-800 hover:border-gray-700',
      cardSelected: 'bg-gray-800 border-indigo-500 shadow-sm ring-1 ring-indigo-900',
      tagBg: 'bg-gray-800',
      divider: 'border-gray-800',
      scrollbarThumb: 'bg-gray-600',
    },
    eyecare: {
      bg: 'bg-[#C7EDCC]',
      text: 'text-[#2c3e50]',
      textMuted: 'text-[#5d6b75]',
      headerBg: 'bg-[#C7EDCC]',
      headerBorder: 'border-[#a5c6aa]',
      sidebarBg: 'bg-[#baddbf]',
      sidebarBorder: 'border-[#a5c6aa]',
      inputBg: 'bg-[#baddbf]',
      inputFocus: 'focus:bg-[#e6f5e8]',
      cardHover: 'hover:bg-[#e6f5e8] hover:border-[#a5c6aa]',
      cardSelected: 'bg-[#e6f5e8] border-[#8cb090] shadow-sm ring-1 ring-[#8cb090]',
      tagBg: 'bg-[#baddbf]',
      divider: 'border-[#a5c6aa]',
      scrollbarThumb: 'bg-[#8cb090]',
    }
  };

  const t = themeClasses[theme];

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const problemsByTag = new Map<string, Problem[]>();
  filteredProblems.forEach(p => {
    if (p.tags.length === 0) {
      const untaggedKey = '未分类';
      if (!problemsByTag.has(untaggedKey)) problemsByTag.set(untaggedKey, []);
      problemsByTag.get(untaggedKey)?.push(p);
    } else {
      p.tags.forEach(t => {
        if (!problemsByTag.has(t)) problemsByTag.set(t, []);
        problemsByTag.get(t)?.push(p);
      });
    }
  });
  const sortedTags = Array.from(problemsByTag.keys()).sort((a, b) => a.localeCompare(b, 'zh-CN'));


  return (
    <div className={`flex flex-col h-screen ${t.bg} ${t.text} font-sans transition-colors duration-300`}>
      
      {/* --- Top Navbar --- */}
      <header className={`h-14 border-b ${t.headerBorder} flex items-center justify-between px-4 ${t.headerBg} sticky top-0 z-20 shadow-sm transition-colors duration-300`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 hover:bg-black/5 rounded-md lg:hidden ${theme === 'dark' ? 'hover:bg-white/10' : ''}`}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-1 rounded-md">
              <BookOpen size={20} />
            </div>
            <span>算法笔记</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted}`} size={18} />
          <input 
            type="text" 
            placeholder="搜索题目、标签..." 
            className={`w-full pl-10 pr-4 py-1.5 ${t.inputBg} border-transparent focus:border-blue-500 border rounded-full text-sm transition-all outline-none ${t.text} placeholder-gray-400 ${t.inputFocus}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={`flex items-center gap-3 ${t.textMuted}`}>
          <a 
            href="https://github.com/misti27" 
            target="_blank" 
            rel="noreferrer"
            className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-black/5'}`} 
            title="GitHub: misti27"
          >
            <Github size={18} />
          </a>
          
          <button 
            onClick={cycleTheme}
            className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-black/5'}`} 
            title={`当前模式: ${theme === 'light' ? '日间' : theme === 'dark' ? '夜间' : '护眼'}`}
          >
            {theme === 'light' && <Moon size={18} />}
            {theme === 'dark' && <Eye size={18} />}
            {theme === 'eyecare' && <Sun size={18} />}
          </button>

           <button className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-black/5'}`} title="User">
             <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
               Me
             </div>
          </button>
        </div>
      </header>

      {/* --- Main Body --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* --- Left Sidebar (Navigation) --- */}
        <aside className={`${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'} lg:translate-x-0 lg:w-72 flex-shrink-0 border-r ${t.sidebarBorder} ${t.sidebarBg} flex flex-col transition-all duration-300 absolute lg:relative h-full z-10`}>
          
          <div className={`p-4 border-b ${t.sidebarBorder} ${t.sidebarBg} space-y-3 transition-colors duration-300`}>
             <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold ${t.textMuted} uppercase tracking-wider`}>
                  {sidebarMode === 'list' ? '题目列表' : '标签分类'}
                </span>
                <button 
                  onClick={handleCreateNew} 
                  className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                  title="新建笔记"
                >
                  <Plus size={14} /> 新建
                </button>
             </div>
             
             {/* View Toggle */}
             <div className={`flex p-1 rounded-md ${theme === 'dark' ? 'bg-gray-900' : theme === 'eyecare' ? 'bg-[#a5c6aa]/30' : 'bg-gray-100'}`}>
               <button 
                 onClick={() => setSidebarMode('list')}
                 className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-sm transition-all ${sidebarMode === 'list' ? `${t.bg} shadow-sm text-indigo-600` : `${t.textMuted} hover:${t.text}`}`}
               >
                 <List size={14} /> 列表
               </button>
               <button 
                 onClick={() => setSidebarMode('tags')}
                 className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-sm transition-all ${sidebarMode === 'tags' ? `${t.bg} shadow-sm text-indigo-600` : `${t.textMuted} hover:${t.text}`}`}
               >
                 <TagsIcon size={14} /> 标签
               </button>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {filteredProblems.length === 0 && (
               <div className={`text-center py-8 ${t.textMuted} text-sm`}>无笔记</div>
            )}
            
            {sidebarMode === 'list' ? (
              // --- LIST VIEW ---
              <div className="p-2 space-y-1">
                {filteredProblems.map(problem => (
                  <div 
                    key={problem.id}
                    onClick={() => handleSelectProblem(problem.id)}
                    className={`group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border border-transparent ${selectedId === problem.id ? t.cardSelected : t.cardHover}`}
                  >
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${problem.difficulty === 'Easy' ? 'bg-green-400' : problem.difficulty === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium truncate text-sm leading-tight mb-1 ${selectedId === problem.id ? 'text-indigo-600' : t.text}`}>
                          {problem.title}
                        </h3>
                        {problem.isFavorite && <Star size={12} className="text-yellow-400 fill-current mt-0.5 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${t.textMuted} flex items-center gap-1`}>
                          {new Date(problem.lastEdited).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // --- TAGS VIEW ---
              <div className="pb-4">
                {sortedTags.map(tag => {
                  const tagProblems = problemsByTag.get(tag) || [];
                  const isExpanded = expandedTags.has(tag);
                  return (
                    <div key={tag} className={`border-b ${t.divider} last:border-0`}>
                      <div 
                        onClick={() => toggleTag(tag)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-black/5 cursor-pointer text-sm font-medium select-none ${t.text}`}
                      >
                         <div className="flex items-center gap-2">
                           <Hash size={14} className={t.textMuted} />
                           <span>{tag}</span>
                           <span className={`px-1.5 py-0.5 rounded-full text-[10px] min-w-[20px] text-center ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>{tagProblems.length}</span>
                         </div>
                         <ChevronRight size={14} className={`${t.textMuted} transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                      
                      {isExpanded && (
                        <div className={`pb-2 space-y-0.5 animate-in slide-in-from-top-1 duration-200 ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-50/50'}`}>
                           {tagProblems.map(p => (
                              <div 
                                key={p.id} 
                                onClick={() => handleSelectProblem(p.id)}
                                className={`pl-10 pr-4 py-2 text-xs flex items-center justify-between cursor-pointer hover:text-indigo-600 transition-colors ${selectedId === p.id ? 'text-indigo-600 font-medium border-r-2 border-indigo-500' : t.textMuted}`}
                              >
                                 <span className="truncate">{p.title}</span>
                                 {p.isFavorite && <Star size={10} className="text-yellow-400 fill-current flex-shrink-0" />}
                              </div>
                           ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* --- Center Content (The Core) --- */}
        <main className={`flex-1 overflow-y-auto ${t.bg} relative transition-colors duration-300`}>
          {selectedProblem ? (
            <div className="max-w-5xl mx-auto min-h-full pb-20">
              
              {/* Toolbar */}
              <div className={`sticky top-0 ${theme === 'dark' ? 'bg-gray-900/95' : theme === 'eyecare' ? 'bg-[#C7EDCC]/95' : 'bg-white/95'} backdrop-blur-sm z-10 px-8 py-4 border-b ${t.divider} flex justify-between items-center shadow-sm transition-colors duration-300`}>
                <div className={`flex items-center gap-2 text-sm ${t.textMuted}`}>
                  <span 
                    className={`hover:${t.text} cursor-pointer`}
                    onClick={() => {
                       setSidebarOpen(true);
                       setSidebarMode('list');
                    }}
                  >
                    全部题目
                  </span>
                  <ChevronRight size={14} />
                  <span className={`font-medium truncate max-w-[200px] ${t.text}`}>{isEditing ? editForm.title : selectedProblem.title}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      <button 
                        onClick={(e) => toggleFavorite(selectedProblem.id, e)} 
                        className={`p-2 rounded-md border transition-colors ${selectedProblem.isFavorite ? 'border-yellow-200 bg-yellow-50 text-yellow-600' : `${t.headerBorder} ${t.textMuted} hover:${t.text}`}`}
                        title="收藏"
                      >
                        <Star size={18} className={selectedProblem.isFavorite ? 'fill-current' : ''} />
                      </button>
                      <button 
                        onClick={startEditing}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-md hover:opacity-80 text-sm font-medium transition-colors ${t.bg} ${t.headerBorder} ${t.text}`}
                      >
                        <Edit3 size={16} /> 编辑
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleDelete}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors mr-2"
                      >
                        删除
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className={`px-4 py-2 ${t.text} hover:opacity-80 rounded-md text-sm font-medium transition-colors`}
                      >
                        取消
                      </button>
                      <button 
                        onClick={saveChanges}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-md transition-all active:scale-95"
                      >
                        <Save size={16} /> 保存
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="px-8 py-8">
                {isEditing ? (
                  // --- EDIT MODE ---
                  <div className="space-y-6 animate-in fade-in duration-200">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className={`text-xs font-semibold ${t.textMuted} uppercase`}>标题</label>
                          <input 
                            value={editForm.title} 
                            onChange={e => setEditForm({...editForm, title: e.target.value})}
                            className={`w-full text-xl font-bold border-b pb-2 focus:border-indigo-500 focus:outline-none ${t.divider} ${t.bg} ${t.text}`}
                            placeholder="题目名称"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={`text-xs font-semibold ${t.textMuted} uppercase`}>题目链接</label>
                          <div className="flex">
                             <input 
                              value={editForm.link} 
                              onChange={e => setEditForm({...editForm, link: e.target.value})}
                              className={`w-full text-sm border-b pb-2 focus:border-indigo-500 focus:outline-none text-blue-600 ${t.divider} ${t.bg}`}
                              placeholder="https://leetcode.cn/problems/..."
                            />
                          </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className={`text-xs font-semibold ${t.textMuted} uppercase`}>难度</label>
                          <div className="flex gap-2">
                            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                              <button
                                key={d}
                                onClick={() => setEditForm({...editForm, difficulty: d})}
                                className={`px-4 py-1.5 rounded-full text-sm border ${editForm.difficulty === d ? getDifficultyColor(d) + ' ring-2 ring-offset-1 ' + (theme === 'dark' ? 'ring-gray-700' : 'ring-gray-200') : `${t.divider} ${t.textMuted} ${t.bg} hover:opacity-80`}`}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className={`text-xs font-semibold ${t.textMuted} uppercase`}>标签</label>
                          <input 
                            value={editForm.tags?.join(', ')} 
                            onChange={e => setEditForm({...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                            className={`w-full text-sm border-b pb-2 focus:border-indigo-500 focus:outline-none ${t.divider} ${t.bg} ${t.text}`}
                            placeholder="数组, 回溯, 链表 (逗号分隔)"
                          />
                        </div>
                     </div>
                    
                    <div className={`pt-6 border-t ${t.divider}`}>
                      <label className={`text-xs font-semibold ${t.textMuted} uppercase mb-4 block`}>内容编辑</label>
                      <BlockEditor 
                        blocks={editForm.blocks || []} 
                        onChange={(newBlocks) => setEditForm({...editForm, blocks: newBlocks})}
                        theme={theme}
                      />
                    </div>
                  </div>
                ) : (
                  // --- READ MODE ---
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(selectedProblem.difficulty)}`}>
                          {selectedProblem.difficulty}
                        </span>
                        <div className="flex gap-2">
                           {selectedProblem.tags.map(tag => (
                             <span key={tag} className={`flex items-center gap-1 text-xs ${t.textMuted} ${t.tagBg} px-2 py-1 rounded`}>
                               <Hash size={10} /> {tag}
                             </span>
                           ))}
                        </div>
                      </div>
                      
                      <h1 className={`text-3xl font-extrabold ${t.text} tracking-tight mb-4 leading-tight`}>
                        {selectedProblem.title}
                      </h1>
                      
                      {selectedProblem.link && (
                        <a 
                          href={selectedProblem.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 hover:underline text-sm font-medium transition-colors"
                        >
                          <ExternalLink size={14} /> 查看原题
                        </a>
                      )}
                    </div>

                    <div className={`prose max-w-none prose-p:leading-loose prose-pre:p-0 prose-pre:bg-transparent ${theme === 'dark' ? 'prose-invert' : 'prose-slate'}`}>
                       {selectedProblem.blocks.map(block => (
                         <BlockRenderer key={block.id} block={block} theme={theme} />
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`h-full flex flex-col items-center justify-center ${t.textMuted}`}>
              <Layout size={64} className="mb-4 opacity-50" />
              <p className="text-lg">请选择一道题目查看笔记</p>
              <button 
                onClick={handleCreateNew}
                className="mt-4 text-indigo-600 hover:underline"
              >
                或创建一个新笔记
              </button>
            </div>
          )}
        </main>

        {/* --- Right Sidebar (Table of Contents / Info) --- */}
        <aside className={`w-72 border-l ${t.sidebarBorder} ${t.bg} hidden xl:block overflow-y-auto p-6 transition-colors duration-300`}>
          <div className="sticky top-6">
            <h3 className={`text-xs font-bold ${t.textMuted} uppercase tracking-wider mb-4`}>此页内容</h3>
            <ul className={`space-y-3 text-sm border-l ${t.divider}`}>
               {selectedProblem && !isEditing && (
                 <>
                   <li 
                    onClick={() => scrollToBlock(selectedProblem.blocks[0]?.id)}
                    className="pl-4 border-l-2 border-indigo-500 text-indigo-600 font-medium cursor-pointer"
                   >
                    简介
                  </li>
                   {selectedProblem.blocks.map((block, idx) => {
                     // Generate pseudo TOC items from content
                     if (block.type === 'text' && block.content.startsWith('#')) {
                        const heading = block.content.split('\n')[0].replace(/#+\s/, '');
                        return (
                          <li 
                            key={block.id} 
                            onClick={() => scrollToBlock(block.id)}
                            className={`pl-4 border-l-2 border-transparent ${theme === 'dark' ? 'hover:border-gray-500 hover:text-gray-300' : 'hover:border-gray-300 hover:text-gray-800'} ${t.textMuted} transition-colors cursor-pointer truncate`}
                          >
                             {heading}
                          </li>
                        )
                     }
                     if (block.type === 'code') {
                       return (
                          <li 
                            key={block.id} 
                            onClick={() => scrollToBlock(block.id)}
                            className={`pl-4 border-l-2 border-transparent ${theme === 'dark' ? 'hover:border-gray-500 hover:text-gray-300' : 'hover:border-gray-300 hover:text-gray-800'} ${t.textMuted} transition-colors cursor-pointer truncate`}
                          >
                             解法代码 ({block.language})
                          </li>
                       )
                     }
                     return null;
                   })}
                 </>
               )}
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
}