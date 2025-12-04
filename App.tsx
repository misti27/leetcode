
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Search, BookOpen, Star, Plus, ExternalLink, 
  Layout, Hash, Save, Edit3, ChevronRight,
  Github, Moon, Sun, Eye, List, Tags as TagsIcon, 
  PanelLeftClose, ArrowDownUp, ChevronsUp, ArrowUp, ArrowDown, Filter,
  Trophy, Target, Activity, Calendar, CheckCircle2, Circle, ChevronDown,
  FileJson, RotateCcw, X
} from 'lucide-react';
import { Problem, Difficulty, ActivityLog, MasteryStatus } from './types';
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
    status: 'mastered',
    blocks: [
      { id: '101', type: 'text', content: '给定一个不含重复数字的数组 `nums` ，返回其 **所有可能的全排列** 。你可以 **按任意顺序** 返回答案。' },
      { id: '102', type: 'callout', content: '注意：输入数组中的整数是互不相同的，这意味着我们不需要处理重复元素带来的去重问题。' },
      { id: '103', type: 'text', content: '### 解题思路：回溯算法\n\n全排列问题是典型的回溯算法应用场景。我们需要穷举所有可能的排列组合。\n\n**核心思想**：\n1. **路径**：也就是已经做出的选择。\n2. **选择列表**：当前可以做出的选择。\n3. **结束条件**：到达决策树底层，无法再做选择。\n\n我们可以将问题看作一棵 $N$ 叉树。' },
      { 
        id: '104', 
        type: 'code', 
        language: 'java', 
        content: `class Solution {

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
}`,
        codeSnippets: {
          java: `class Solution {

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

    void backtrack(int[] nums, LinkedList<Integer> track, boolean[] used) {
        if (track.size() == nums.length) {
            res.add(new LinkedList(track));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            track.add(nums[i]);
            used[i] = true;
            backtrack(nums, track, used);
            track.removeLast();
            used[i] = false;
        }
    }
}`,
          python: `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        res = []
        track = []
        used = [False] * len(nums)
        
        def backtrack(track, used):
            if len(track) == len(nums):
                res.append(track[:])
                return
            
            for i in range(len(nums)):
                if used[i]:
                    continue
                
                track.append(nums[i])
                used[i] = True
                backtrack(track, used)
                track.pop()
                used[i] = False
                
        backtrack(track, used)
        return res`,
          cpp: `class Solution {
    vector<vector<int>> res;
    
    void backtrack(vector<int>& nums, vector<int>& track, vector<bool>& used) {
        if (track.size() == nums.size()) {
            res.push_back(track);
            return;
        }
        
        for (int i = 0; i < nums.size(); i++) {
            if (used[i]) continue;
            
            track.push_back(nums[i]);
            used[i] = true;
            backtrack(nums, track, used);
            track.pop_back();
            used[i] = false;
        }
    }
    
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<int> track;
        vector<bool> used(nums.size(), false);
        backtrack(nums, track, used);
        return res;
    }
};`,
          javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
    const res = [];
    const used = new Array(nums.length).fill(false);
    
    const backtrack = (track) => {
        if (track.length === nums.length) {
            res.push([...track]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            track.push(nums[i]);
            used[i] = true;
            backtrack(track);
            track.pop();
            used[i] = false;
        }
    };
    
    backtrack([]);
    return res;
};`
        }
      },
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
    status: 'learning',
    blocks: [
      { id: '201', type: 'text', content: '请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。' },
      { 
        id: '203', 
        type: 'code', 
        language: 'javascript', 
        content: `/**
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
};`,
        codeSnippets: {
          javascript: `/**
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
};`
        }
      }
    ]
  }
];

const INITIAL_LOGS: ActivityLog[] = [
  { id: '1', problemId: '46', problemTitle: '46. 全排列 (Permutations)', type: 'create', timestamp: Date.now() - 86400000 * 5 },
  { id: '2', problemId: '46', problemTitle: '46. 全排列 (Permutations)', type: 'master', timestamp: Date.now() - 86400000 * 2 },
  { id: '3', problemId: '146', problemTitle: '146. LRU 缓存 (LRU Cache)', type: 'create', timestamp: Date.now() - 86400000 * 1 },
];

const JSON_TEMPLATE = `{
  "title": "题目名称",
  "link": "https://leetcode.cn/problems/...",
  "difficulty": "Medium",
  "tags": ["标签A", "标签B"],
  "blocks": [
    {
      "type": "text",
      "content": "这里是题目描述..."
    },
    {
      "type": "code",
      "language": "java",
      "content": "class Solution {\\n    // 代码...\\n}"
    }
  ]
}`;

type Theme = 'light' | 'dark' | 'eyecare';
type SortOption = 'id' | 'date' | 'difficulty';

// --- Dashboard Sub-Component ---
const PersonalDashboard = ({ 
  problems, 
  activityLogs, 
  theme, 
  themeClasses,
  onNavigate
}: { 
  problems: Problem[], 
  activityLogs: ActivityLog[], 
  theme: Theme,
  themeClasses: any,
  onNavigate: (id: string) => void
}) => {
  const t = themeClasses[theme];
  const [activeTab, setActiveTab] = useState<'added' | 'history'>('added');
  
  // Stats - Mastery
  const masteredCount = problems.filter(p => p.status === 'mastered').length;
  const learningCount = problems.filter(p => p.status === 'learning').length;
  const totalCount = problems.length;
  const masteredPercentage = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;
  
  // Stats - Difficulty
  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;
  
  const pEasy = totalCount > 0 ? (easyCount / totalCount) * 100 : 0;
  const pMedium = totalCount > 0 ? (mediumCount / totalCount) * 100 : 0;
  const stop1 = pEasy;
  const stop2 = pEasy + pMedium;

  // Colors for charts
  const colorMastered = '#4ade80'; // green-400
  
  const colorEasy = '#4ade80'; // green-400
  const colorMedium = '#facc15'; // yellow-400
  const colorHard = '#f87171'; // red-400

  // --- Heatmap Logic ---
  
  // Filter logs for heatmap to only include "create" (added problems)
  const submissionLogs = activityLogs.filter(l => l.type === 'create');

  // 1. Calculate Date Range (Past 365 days aligned to weeks)
  const today = new Date();
  const endDate = new Date(today);
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 365);
  // Align start date to the previous Sunday
  const startDayOfWeek = startDate.getDay(); // 0=Sun
  startDate.setDate(startDate.getDate() - startDayOfWeek);

  // 2. Generate Weeks Data
  const weeks: Date[][] = [];
  let currentDay = new Date(startDate);
  
  // Generate enough weeks to cover until today (approx 53 weeks)
  while (currentDay <= endDate || weeks.length < 53) {
     const week: Date[] = [];
     for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
     }
     weeks.push(week);
  }

  // 3. Map logs to counts (using submissionLogs only)
  const activityMap = new Map<string, number>();
  submissionLogs.forEach(log => {
    const dateStr = new Date(log.timestamp).toDateString();
    activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
  });
  
  // 4. Calculate Heatmap Stats
  const totalActivities = submissionLogs.length;
  const activeDays = new Set(submissionLogs.map(l => new Date(l.timestamp).toDateString())).size;
  
  // Calculate Streak
  let currentStreak = 0;
  // Simple streak calc (iterate backwards from today)
  let checkDate = new Date();
  while (true) {
    if (activityMap.has(checkDate.toDateString())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      if (currentStreak === 0 && checkDate.toDateString() === new Date().toDateString()) {
         checkDate.setDate(checkDate.getDate() - 1);
         continue;
      }
      break;
    }
  }

  // Helper for cell color
  const getCellColor = (count: number) => {
    if (count === 0) return theme === 'dark' ? 'bg-[#161b22]' : 'bg-[#ebedf0]';
    if (count <= 1) return theme === 'dark' ? 'bg-[#0e4429]' : 'bg-[#9be9a8]';
    if (count <= 2) return theme === 'dark' ? 'bg-[#006d32]' : 'bg-[#40c463]';
    if (count <= 4) return theme === 'dark' ? 'bg-[#26a641]' : 'bg-[#30a14e]';
    return theme === 'dark' ? 'bg-[#39d353]' : 'bg-[#216e39]';
  };

  // Recent Activity Filtering
  const sortedLogs = [...activityLogs].sort((a, b) => b.timestamp - a.timestamp);
  
  const displayedLogs = activeTab === 'added' 
    ? sortedLogs.filter(l => l.type === 'create').slice(0, 10)
    : sortedLogs.slice(0, 10);

  // Month labels logic
  const monthLabels = [];
  for (let i = 0; i < weeks.length; i++) {
    const firstDay = weeks[i][0];
    if (firstDay.getDate() <= 7) { 
       monthLabels.push({ label: firstDay.getMonth() + 1 + '月', index: i });
    }
  }

  return (
    <div className={`p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Chart Card */}
        <div className={`col-span-1 p-6 rounded-2xl shadow-sm border ${t.cardBg} ${t.cardBorder}`}>
          <h3 className={`text-sm font-semibold mb-6 ${t.textMuted}`}>掌握情况</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* CSS Conic Gradient Donut */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${colorMastered} 0% ${masteredPercentage}%, ${theme === 'dark' ? '#374151' : '#e5e7eb'} ${masteredPercentage}% 100%)`,
                  maskImage: 'radial-gradient(transparent 55%, black 56%)',
                  WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)'
                }}
              ></div>
              <div className="flex flex-col items-center z-10">
                <span className={`text-3xl font-bold ${t.text}`}>{masteredCount}题</span>
                <span className="text-xs text-green-500 font-medium">已掌握</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
                 <span className={t.textMuted}>已掌握 ({masteredCount})</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                 <span className={t.textMuted}>学习中 ({learningCount})</span>
               </div>
            </div>
          </div>
          <div className={`mt-8 text-center text-sm ${t.textMuted}`}>
             共 <span className={`font-bold ${t.text}`}>{totalCount}</span> 题
          </div>
        </div>

        {/* Difficulty Chart Card */}
        <div className={`col-span-1 p-6 rounded-2xl shadow-sm border ${t.cardBg} ${t.cardBorder}`}>
          <h3 className={`text-sm font-semibold mb-6 ${t.textMuted}`}>题目难度</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* CSS Conic Gradient Donut for Difficulty */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    ${colorEasy} 0% ${stop1}%, 
                    ${colorMedium} ${stop1}% ${stop2}%, 
                    ${colorHard} ${stop2}% 100%
                  )`,
                  maskImage: 'radial-gradient(transparent 55%, black 56%)',
                  WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)'
                }}
              ></div>
              <div className="flex flex-col items-center z-10">
                <span className={`text-3xl font-bold ${t.text}`}>{totalCount}</span>
                <span className={`text-xs ${t.textMuted} font-medium`}>总题数</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
                 <span className={t.textMuted}>简单 ({easyCount})</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                 <span className={t.textMuted}>中等 ({mediumCount})</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <span className={t.textMuted}>困难 ({hardCount})</span>
               </div>
            </div>
          </div>
          <div className={`mt-8 text-center text-sm ${t.textMuted}`}>
             难度分布
          </div>
        </div>

      </div>

      {/* Heatmap Section (Moved below top cards) */}
      <div className={`p-6 rounded-2xl shadow-sm border ${t.cardBg} ${t.cardBorder} overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
             <div className="flex items-baseline gap-2">
               <h3 className={`text-lg font-semibold ${t.text}`}>过去一年共提交 {totalActivities} 次</h3>
             </div>
             <div className={`flex items-center gap-4 text-xs ${t.textMuted}`}>
                <span>累计提交天数: {activeDays}</span>
                <span>连续提交: {currentStreak}</span>
                <div className={`px-2 py-1 rounded border ${t.divider} flex items-center gap-1`}>
                  过去一年 <ChevronDown size={12} />
                </div>
             </div>
          </div>

          <div className="flex overflow-x-auto pb-2 custom-scrollbar">
             <div className="flex flex-col gap-[3px]">
               {/* Grid */}
               <div className="flex gap-[3px]">
                 {weeks.map((week, wIndex) => (
                   <div key={wIndex} className="flex flex-col gap-[3px]">
                     {week.map((day, dIndex) => (
                       <div 
                         key={dIndex}
                         className={`w-[13px] h-[13px] rounded-[3px] ${getCellColor(activityMap.get(day.toDateString()) || 0)}`}
                         title={`${day.toLocaleDateString()} : ${activityMap.get(day.toDateString()) || 0} 次提交`}
                       ></div>
                     ))}
                   </div>
                 ))}
               </div>
               
               {/* Month Labels */}
               <div className="relative h-6 mt-1 text-xs text-gray-400">
                  {monthLabels.map((m, i) => (
                    <span 
                      key={i} 
                      className="absolute top-0"
                      style={{ left: `${m.index * 16}px` }} // 13px width + 3px gap = 16px pitch
                    >
                      {m.label}
                    </span>
                  ))}
               </div>
             </div>
          </div>
          
          <div className="flex items-center justify-end gap-1 mt-2 text-xs text-gray-400">
             <span>Less</span>
             <div className={`w-[13px] h-[13px] rounded-[3px] ${theme === 'dark' ? 'bg-[#161b22]' : 'bg-[#ebedf0]'}`}></div>
             <div className={`w-[13px] h-[13px] rounded-[3px] ${theme === 'dark' ? 'bg-[#0e4429]' : 'bg-[#9be9a8]'}`}></div>
             <div className={`w-[13px] h-[13px] rounded-[3px] ${theme === 'dark' ? 'bg-[#006d32]' : 'bg-[#40c463]'}`}></div>
             <div className={`w-[13px] h-[13px] rounded-[3px] ${theme === 'dark' ? 'bg-[#26a641]' : 'bg-[#30a14e]'}`}></div>
             <div className={`w-[13px] h-[13px] rounded-[3px] ${theme === 'dark' ? 'bg-[#39d353]' : 'bg-[#216e39]'}`}></div>
             <span>More</span>
          </div>
      </div>

      {/* Timeline Section */}
      <div className={`p-6 rounded-2xl shadow-sm border ${t.cardBg} ${t.cardBorder}`}>
        <div className="flex gap-6 border-b mb-6">
          <button 
            onClick={() => setActiveTab('added')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'added' ? 'border-indigo-500 text-indigo-600' : `border-transparent ${t.textMuted} hover:${t.text}`}`}
          >
            最近添加
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : `border-transparent ${t.textMuted} hover:${t.text}`}`}
          >
            学习记录
          </button>
        </div>

        <div className="space-y-6">
          {displayedLogs.map((log, index) => (
            <div key={log.id} className="flex gap-4 group">
               <div className="flex flex-col items-center">
                 <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${log.type === 'master' ? 'bg-green-500 ring-4 ring-green-100 dark:ring-green-900/30' : 'bg-red-500 ring-4 ring-red-100 dark:ring-red-900/30'}`}></div>
                 {index !== displayedLogs.length - 1 && (
                   <div className={`w-0.5 flex-1 mt-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                 )}
               </div>
               <div className="pb-2">
                 <div className={`text-xs mb-1 ${t.textMuted}`}>{new Date(log.timestamp).toLocaleString('zh-CN')}</div>
                 <div className={`text-sm ${t.text}`}>
                   {log.type === 'master' ? (
                     <span className="flex items-center gap-2">
                       <span className="text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs">已掌握</span>
                       已掌握题目 <span 
                         onClick={() => onNavigate(log.problemId)}
                         className="font-medium cursor-pointer hover:underline hover:text-indigo-600 transition-colors"
                       >{log.problemTitle}</span>
                     </span>
                   ) : (
                     <span className="flex items-center gap-2">
                       <span className="text-red-600 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded text-xs">学习中</span>
                       新增题目 <span 
                         onClick={() => onNavigate(log.problemId)}
                         className="font-medium cursor-pointer hover:underline hover:text-indigo-600 transition-colors"
                       >{log.problemTitle}</span>
                     </span>
                   )}
                 </div>
               </div>
            </div>
          ))}
          {displayedLogs.length === 0 && (
            <div className={`text-center py-8 ${t.textMuted}`}>暂无{activeTab === 'added' ? '新增' : '学习'}记录</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default function App() {
  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem('leetnotes-data');
    return saved ? JSON.parse(saved) : INITIAL_PROBLEMS;
  });
  
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('leetnotes-logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [view, setView] = useState<'dashboard' | 'problem'>('problem');
  const [selectedId, setSelectedId] = useState<string>(problems[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarMode, setSidebarMode] = useState<'list' | 'tags'>('list');
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  const [activeBlockId, setActiveBlockId] = useState<string>('');
  
  // Sorting & Filtering
  const [sortOption, setSortOption] = useState<SortOption>('id');
  const [isReversed, setIsReversed] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Import JSON State - PRE-FILLED with Template
  const [importJson, setImportJson] = useState(JSON_TEMPLATE);
  
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
    localStorage.setItem('leetnotes-logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('leetnotes-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Intersection Observer for Table of Contents
  useEffect(() => {
    if (isEditing || view === 'dashboard') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveBlockId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-10% 0px -60% 0px', // Trigger when element is near top of viewport
        threshold: 0
      }
    );

    const selectedProblem = problems.find(p => p.id === selectedId);
    if (selectedProblem) {
      selectedProblem.blocks.forEach((block) => {
        const el = document.getElementById(block.id);
        if (el) observer.observe(el);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [selectedId, problems, isEditing, view]);

  const selectedProblem = problems.find(p => p.id === selectedId);

  // --- Handlers ---

  const handleSelectProblem = (id: string) => {
    if (isEditing) {
      if (!confirm("你有未保存的更改。确定要放弃吗？")) return;
    }
    setSelectedId(id);
    setView('problem'); // Switch to problem view
    setIsEditing(false);
    // Reset scroll to top
    const mainContainer = document.querySelector('main');
    if (mainContainer) mainContainer.scrollTop = 0;
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSidebarMode('tags');
    setSidebarOpen(true);
    // Exclusive expansion: clear others, set this one
    setExpandedTags(new Set([tag]));
    
    // Scroll to the tag element in sidebar after render
    setTimeout(() => {
      const element = document.getElementById(`sidebar-tag-${tag}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCreateNew = () => {
    const newId = Date.now().toString();
    const newProblem: Problem = {
      id: newId,
      title: '新题目',
      link: '',
      difficulty: 'Easy',
      tags: [],
      blocks: [{ id: Date.now().toString(), type: 'text', content: '在这里输入内容...' }],
      lastEdited: Date.now(),
      isFavorite: false,
      status: 'learning'
    };
    
    // Add Log
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      problemId: newId,
      problemTitle: '新题目',
      type: 'create',
      timestamp: Date.now()
    };

    setProblems([newProblem, ...problems]);
    setActivityLogs([newLog, ...activityLogs]);
    setSelectedId(newId);
    setEditForm(newProblem);
    setIsEditing(true);
    setSidebarMode('list');
    setSidebarOpen(true);
    setView('problem');
  };

  const startEditing = () => {
    if (!selectedProblem) return;
    setEditForm(JSON.parse(JSON.stringify(selectedProblem)));
    setIsEditing(true);
  };

  const saveChanges = () => {
    if (!editForm.id) return;
    
    // Update problem
    setProblems(prev => prev.map(p => 
      p.id === editForm.id 
        ? { ...p, ...editForm, lastEdited: Date.now() } as Problem 
        : p
    ));
    
    // Update log title if changed
    if (editForm.title && selectedProblem && editForm.title !== selectedProblem.title) {
       setActivityLogs(prev => prev.map(log => 
         log.problemId === editForm.id ? { ...log, problemTitle: editForm.title! } : log
       ));
    }

    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setImportJson(JSON_TEMPLATE); // Reset to template on cancel
    if (selectedProblem?.title === '新题目' && selectedProblem.link === '') {
      setProblems(prev => prev.filter(p => p.id !== selectedProblem.id));
      setSelectedId(problems[0]?.id || '');
    }
  };
  
  const handleJsonImport = () => {
    try {
      if (!importJson.trim()) return;
      const data = JSON.parse(importJson);
      
      const newBlocks = Array.isArray(data.blocks) 
        ? data.blocks.map((b: any, idx: number) => ({
            id: `${Date.now()}-${idx}`,
            type: b.type || 'text',
            content: b.content || '',
            language: b.language || (b.type === 'code' ? 'java' : undefined),
            codeSnippets: b.codeSnippets,
            caption: b.caption
          })) 
        : editForm.blocks;

      setEditForm(prev => ({
        ...prev,
        title: data.title || prev.title,
        link: data.link || prev.link,
        difficulty: data.difficulty || prev.difficulty,
        tags: Array.isArray(data.tags) ? data.tags : prev.tags,
        blocks: newBlocks
      }));
      
      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      alert("JSON 解析失败，请检查格式是否正确。");
    }
  };

  const handleDelete = () => {
    if (!confirm("确定要删除这个笔记吗？")) return;
    const newProblems = problems.filter(p => p.id !== selectedId);
    setProblems(newProblems);
    setActivityLogs(prev => prev.filter(l => l.problemId !== selectedId));
    setSelectedId(newProblems[0]?.id || '');
    setIsEditing(false);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProblems(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const toggleStatus = (id: string) => {
    const p = problems.find(p => p.id === id);
    if (!p) return;
    
    const newStatus: MasteryStatus = p.status === 'mastered' ? 'learning' : 'mastered';
    setProblems(prev => prev.map(x => x.id === id ? { ...x, status: newStatus } : x));

    // Log activity only when mastering
    if (newStatus === 'mastered') {
       const newLog: ActivityLog = {
         id: Date.now().toString(),
         problemId: id,
         problemTitle: p.title,
         type: 'master',
         timestamp: Date.now()
       };
       setActivityLogs([newLog, ...activityLogs]);
    }
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
    setActiveBlockId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- Render Helpers ---

  const getDifficultyColor = (diff: Difficulty) => {
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

  // Helper for title text color in sidebar
  const getDifficultyTextColor = (diff: Difficulty) => {
    if (theme === 'dark') {
      switch (diff) {
        case 'Easy': return 'text-green-400';
        case 'Medium': return 'text-yellow-400';
        case 'Hard': return 'text-red-400';
        default: return 'text-gray-300';
      }
    }
    // Light & Eyecare
    switch (diff) {
      case 'Easy': return 'text-green-600';
      case 'Medium': return 'text-amber-600';
      case 'Hard': return 'text-red-600';
      default: return 'text-gray-700';
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
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      cardSelected: 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100',
      tagBg: 'bg-gray-100',
      divider: 'border-gray-100',
      scrollbarThumb: 'bg-gray-300',
      inputBorder: 'border-gray-200',
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
      cardBg: 'bg-gray-800',
      cardBorder: 'border-gray-700',
      cardSelected: 'bg-gray-800 border-indigo-500 shadow-sm ring-1 ring-indigo-900',
      tagBg: 'bg-gray-800',
      divider: 'border-gray-800',
      scrollbarThumb: 'bg-gray-600',
      inputBorder: 'border-gray-700',
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
      cardBg: 'bg-[#e6f5e8]',
      cardBorder: 'border-[#a5c6aa]',
      cardSelected: 'bg-[#e6f5e8] border-[#8cb090] shadow-sm ring-1 ring-[#8cb090]',
      tagBg: 'bg-[#baddbf]',
      divider: 'border-[#a5c6aa]',
      scrollbarThumb: 'bg-[#8cb090]',
      inputBorder: 'border-[#a5c6aa]',
    }
  };

  const t = themeClasses[theme];

  // 1. First, filter by search query
  let filteredList = problems.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 2. If "Favorite Only" is toggled
  if (showFavoritesOnly) {
    filteredList = filteredList.filter(p => p.isFavorite);
  }

  const getDifficultyValue = (d: Difficulty) => {
    switch (d) {
      case 'Easy': return 1;
      case 'Medium': return 2;
      case 'Hard': return 3;
      default: return 0;
    }
  };

  const getProblemNumber = (p: Problem) => {
    const match = p.title.trim().match(/^(\d+)[.、\s]/); // Match "123.", "123、", "123 "
    if (match) {
      return parseInt(match[1], 10);
    }
    // If ID is simple number (like mock data '46'), use it
    if (/^\d+$/.test(p.id) && p.id.length < 6) {
       return parseInt(p.id, 10);
    }
    return 999999999; // Huge number for non-numbered
  };

  const compareIds = (idA: string, idB: string) => {
    return idA.localeCompare(idB, undefined, { numeric: true });
  };

  const sortedProblems = [...filteredList].sort((a, b) => {
    let result = 0;
    switch (sortOption) {
      case 'date': 
        result = b.lastEdited - a.lastEdited; // Default: Newest first
        break;
      case 'difficulty': 
        const diff = getDifficultyValue(a.difficulty) - getDifficultyValue(b.difficulty); // Default: Easy to Hard
        result = diff !== 0 ? diff : compareIds(a.id, b.id);
        break;
      case 'id': 
      default: 
        {
           const numA = getProblemNumber(a);
           const numB = getProblemNumber(b);
           if (numA !== numB) {
             result = numA - numB;
           } else {
             // Fallback to internal ID (creation time usually)
             result = a.id.localeCompare(b.id);
           }
        }
        break;
    }
    // If reversed, flip the result
    return isReversed ? -result : result;
  });

  const problemsByTag = new Map<string, Problem[]>();
  sortedProblems.forEach(p => {
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

  // Calculate Tag Statistics (NOT USED IN UI ANYMORE, but logic kept for structure)
  const tagStats = React.useMemo(() => {
    const stats: { name: string; count: number }[] = [];
    const allProblemsByTag = new Map<string, number>();
    problems.forEach(p => {
      p.tags.forEach(t => {
        allProblemsByTag.set(t, (allProblemsByTag.get(t) || 0) + 1);
      });
    });
    allProblemsByTag.forEach((count, name) => {
      stats.push({ name, count });
    });
    return stats.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [problems]);

  // Generate Table of Contents
  const tableOfContents = React.useMemo(() => {
    if (!selectedProblem) return [];
    
    const items = [];
    if (selectedProblem.blocks.length > 0) {
        items.push({ id: selectedProblem.blocks[0].id, label: '题目描述' });
    }

    selectedProblem.blocks.forEach((block, index) => {
      if (index === 0) return;

      if (block.type === 'text' && block.content.startsWith('#')) {
        const heading = block.content.split('\n')[0].replace(/#+\s/, '');
        items.push({ id: block.id, label: heading });
      } else if (block.type === 'code') {
        items.push({ id: block.id, label: `解法代码 (${block.language})` });
      }
    });
    return items;
  }, [selectedProblem]);


  return (
    <div className={`flex flex-col h-screen ${t.bg} ${t.text} font-sans transition-colors duration-300`}>
      
      {/* --- Top Navbar --- */}
      <header className={`h-14 border-b ${t.headerBorder} flex items-center justify-between px-4 ${t.headerBg} sticky top-0 z-20 shadow-sm transition-colors duration-300`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className={`p-2 hover:bg-black/5 rounded-md ${theme === 'dark' ? 'hover:bg-white/10' : ''}`}
            title={sidebarOpen ? "收起侧边栏" : "展开侧边栏"}
          >
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

           <button 
             onClick={() => setView('dashboard')}
             className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-black/5'} ${view === 'dashboard' ? 'ring-2 ring-indigo-500' : ''}`} 
             title="个人主页"
           >
             <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
               Me
             </div>
          </button>
        </div>
      </header>

      {/* --- Main Body --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* --- Left Sidebar (Navigation) --- */}
        <aside className={`
          flex-shrink-0 border-r ${t.sidebarBorder} ${t.sidebarBg} flex flex-col transition-all duration-300 z-10
          fixed inset-y-0 left-0 lg:static lg:h-full
          ${sidebarOpen ? 'translate-x-0 w-64 lg:w-72' : '-translate-x-full w-64 lg:w-0 lg:translate-x-0 lg:overflow-hidden'}
        `}>
          
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
            {sortedProblems.length === 0 && (
               <div className={`text-center py-8 ${t.textMuted} text-sm`}>无笔记</div>
            )}
            
            {sidebarMode === 'list' ? (
              // --- LIST VIEW ---
              <div className="p-2 space-y-1">
                {/* Sort Bar */}
                <div className={`flex items-center justify-between px-2 py-2 mb-2 text-xs ${t.textMuted} border-b ${t.divider}`}>
                  <div className="flex items-center gap-1 flex-1">
                    <ArrowDownUp size={12} />
                    <select 
                      value={sortOption} 
                      onChange={(e) => setSortOption(e.target.value as any)}
                      className={`bg-transparent border-none outline-none cursor-pointer font-medium hover:${t.text} w-full`}
                    >
                      <option value="id">题号</option>
                      <option value="date">时间</option>
                      <option value="difficulty">难度</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-1 border-l pl-2 ml-1">
                    {/* Reverse Sort Toggle */}
                    <button 
                      onClick={() => setIsReversed(!isReversed)}
                      className={`p-1 rounded hover:${t.text} transition-colors ${isReversed ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
                      title={isReversed ? "当前: 倒序" : "当前: 正序"}
                    >
                       {isReversed ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    </button>
                    
                    {/* Favorites Filter Toggle */}
                    <button 
                      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      className={`p-1 rounded hover:${t.text} transition-colors ${showFavoritesOnly ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' : ''}`}
                      title={showFavoritesOnly ? "显示全部" : "只看收藏"}
                    >
                      <Star size={14} className={showFavoritesOnly ? "fill-current" : ""} />
                    </button>
                  </div>
                </div>

                {sortedProblems.map(problem => (
                  <div 
                    key={problem.id}
                    onClick={() => handleSelectProblem(problem.id)}
                    className={`group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border border-transparent ${selectedId === problem.id && view === 'problem' ? t.cardSelected : t.cardHover}`}
                  >
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${problem.status === 'mastered' ? 'bg-green-500 ring-2 ring-green-200 dark:ring-green-900' : 'bg-gray-300 dark:bg-gray-600'}`} title={problem.status === 'mastered' ? '已掌握' : '学习中'} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className={`truncate text-sm leading-tight mb-1 ${
                          selectedId === problem.id && view === 'problem' ? 'font-bold' : 'font-medium'
                        } ${getDifficultyTextColor(problem.difficulty)}`}>
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
                 <div className={`flex justify-end px-4 py-2 border-b ${t.divider}`}>
                   <button 
                     onClick={() => setExpandedTags(new Set())}
                     className={`text-xs flex items-center gap-1 hover:text-indigo-600 transition-colors ${t.textMuted}`}
                     title="全部收起"
                   >
                     <ChevronsUp size={12} /> 收起
                   </button>
                 </div>

                {sortedTags.map(tag => {
                  const tagProblems = problemsByTag.get(tag) || [];
                  const isExpanded = expandedTags.has(tag);
                  return (
                    <div key={tag} id={`sidebar-tag-${tag}`} className={`border-b ${t.divider} last:border-0`}>
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
                                className={`pl-8 pr-4 py-2 text-xs flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${selectedId === p.id && view === 'problem' ? 'border-r-2 border-indigo-500 bg-black/5 dark:bg-white/10' : ''}`}
                              >
                                 <div className="flex items-center gap-2 min-w-0">
                                   <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.status === 'mastered' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                   <span className={`truncate ${getDifficultyTextColor(p.difficulty)} ${selectedId === p.id && view === 'problem' ? 'font-bold' : ''}`}>
                                     {p.title}
                                   </span>
                                 </div>
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
          
           <div className={`p-3 border-t ${t.sidebarBorder} flex justify-end`}>
             <button 
               onClick={() => setSidebarOpen(false)}
               className={`p-2 rounded hover:bg-black/5 ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'text-gray-500'}`}
               title="收起侧边栏"
             >
               <PanelLeftClose size={18} />
             </button>
           </div>
        </aside>

        {/* --- Center Content (The Core) --- */}
        <main className={`flex-1 overflow-y-auto ${t.bg} relative transition-colors duration-300`}>
          
          {/* View Switcher */}
          {view === 'dashboard' ? (
            <PersonalDashboard 
              problems={problems} 
              activityLogs={activityLogs} 
              theme={theme}
              themeClasses={themeClasses}
              onNavigate={(id) => {
                handleSelectProblem(id);
              }}
            />
          ) : (
            <>
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
                          {/* Mastery Toggle */}
                          <button 
                             onClick={() => toggleStatus(selectedProblem.id)}
                             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-all ${selectedProblem.status === 'mastered' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : `${t.headerBorder} ${t.textMuted} hover:${t.text}`}`}
                             title={selectedProblem.status === 'mastered' ? '标记为学习中' : '标记为已掌握'}
                          >
                             {selectedProblem.status === 'mastered' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                             {selectedProblem.status === 'mastered' ? '已掌握' : '学习中'}
                          </button>

                          <div className={`w-[1px] h-6 mx-1 ${t.divider}`}></div>

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

                         {/* Quick Import (JSON) */}
                         <div className={`mt-12 pt-8 border-t ${t.divider}`}>
                            <div className="flex items-center gap-2 mb-4">
                               <FileJson size={20} className={t.textMuted} />
                               <h3 className={`text-sm font-bold ${t.text} uppercase tracking-wider`}>快速导入 (JSON)</h3>
                            </div>
                            <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-black/20 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                               <p className={`text-xs mb-3 ${t.textMuted}`}>
                                  将标准 JSON 格式粘贴到下方，可以快速修改或填充题目内容。
                               </p>
                               <textarea
                                  value={importJson}
                                  onChange={(e) => setImportJson(e.target.value)}
                                  className={`w-full h-48 font-mono text-xs p-3 rounded border focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none mb-3 ${t.inputBg} ${t.inputBorder} ${t.text}`}
                               />
                               <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => setImportJson(JSON_TEMPLATE)}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-colors border ${t.headerBorder} ${t.textMuted} hover:${t.text}`}
                                    title="恢复默认模板"
                                  >
                                    <RotateCcw size={14} /> 重置
                                  </button>
                                  <button 
                                    onClick={() => setImportJson('')}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-colors border ${t.headerBorder} ${t.textMuted} hover:${t.text}`}
                                    title="清空内容"
                                  >
                                    <X size={14} /> 清空
                                  </button>
                                  <button 
                                    onClick={handleJsonImport}
                                    className="px-4 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-sm"
                                  >
                                    确认导入
                                  </button>
                               </div>
                            </div>
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
                            
                            {/* Tags */}
                            <div className="flex gap-2">
                               {selectedProblem.tags.map(tag => (
                                 <span 
                                  key={tag} 
                                  onClick={() => handleTagClick(tag)}
                                  className={`flex items-center gap-1 text-xs ${t.textMuted} ${t.tagBg} px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity hover:text-indigo-600`}
                                  title={`查看 "${tag}" 相关笔记`}
                                 >
                                   <Hash size={10} /> {tag}
                                 </span>
                               ))}
                            </div>
                            
                            {/* Mastery Badge */}
                            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${selectedProblem.status === 'mastered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                               {selectedProblem.status === 'mastered' ? <CheckCircle2 size={12}/> : <Target size={12}/>}
                               {selectedProblem.status === 'mastered' ? '已掌握' : '学习中'}
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
            </>
          )}
        </main>
        
        {/* --- Right Sidebar (Table of Contents) --- */}
        {view === 'problem' && !isEditing && selectedProblem && tableOfContents.length > 0 && (
          <aside className={`w-64 hidden xl:block flex-shrink-0 border-l ${t.sidebarBorder} p-6 overflow-y-auto ${t.textMuted} text-sm custom-scrollbar`}>
            <h4 className={`font-bold mb-4 ${t.text}`}>此页内容</h4>
            <div className={`space-y-1 relative border-l-2 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
              {tableOfContents.map(item => (
                <div 
                  key={item.id}
                  onClick={() => scrollToBlock(item.id)}
                  className={`
                    cursor-pointer py-1 pl-4 transition-all duration-200 border-l-2 -ml-[2px]
                    ${activeBlockId === item.id 
                      ? 'border-indigo-500 font-medium text-indigo-600' 
                      : 'border-transparent hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}
                  `}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
