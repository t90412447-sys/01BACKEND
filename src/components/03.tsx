import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Sparkles, Bot, User, Loader2, CheckCircle, Circle, RotateCw, Scissors, Target, Lightbulb, Trash2, Calendar, BookOpen, TrendingUp, Settings, Zap, ChevronDown, MessageSquare, Award, Flame, Star, Trophy, Clock } from 'lucide-react';

// ==================== TYPES & INTERFACES ====================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
  type?: 'text' | 'task-list' | 'lesson' | 'action-confirm' | 'loading';
}

interface Task {
  id: string;
  title: string;
  description?: string;
  task?: {
    task: string;
  };
  done: boolean;
}

interface Lesson {
  date: string;
  title?: string;
  lesson?: string;
  summary: string;
  motivation?: string;
  quote?: string;
  secret_hacks_and_shortcuts?: string;
  tiny_daily_rituals_that_transform?: string;
  tasks?: Task[];
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: string;
  description: string;
  color: string;
  emoji: string;
}

// ==================== CONSTANTS ====================

const API_BASE_URL = 'https://agent-f8uq.onrender.com';
const TYPING_DELAY = 1500;

// Default user_id - Replace this with actual Firebase auth user ID
const DEFAULT_USER_ID = 'HfwcJgkyNNb3T3UdWRDbrCiRQuS2';

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: <Calendar className="w-4 h-4" />,
    label: "Today's Tasks",
    action: "show me today's tasks",
    description: "View your daily task list",
    color: "from-blue-500 to-cyan-500",
    emoji: "📋"
  },
  {
    icon: <BookOpen className="w-4 h-4" />,
    label: "Today's Lesson",
    action: "show me today's lesson",
    description: "Read your learning material",
    color: "from-purple-500 to-pink-500",
    emoji: "📚"
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    label: "My Progress",
    action: "show my progress",
    description: "Check your learning stats",
    color: "from-emerald-500 to-teal-500",
    emoji: "📊"
  },
  {
    icon: <RotateCw className="w-4 h-4" />,
    label: "Regenerate Tasks",
    action: "regenerate all my tasks",
    description: "Get new AI-generated tasks",
    color: "from-orange-500 to-red-500",
    emoji: "🔄"
  },
  {
    icon: <Scissors className="w-4 h-4" />,
    label: "Simplify Tasks",
    action: "simplify all my tasks",
    description: "Make tasks easier",
    color: "from-violet-500 to-purple-500",
    emoji: "✂️"
  },
  {
    icon: <Lightbulb className="w-4 h-4" />,
    label: "Get Motivation",
    action: "motivate me",
    description: "Boost your energy",
    color: "from-amber-500 to-yellow-500",
    emoji: "💡"
  },
];

// ==================== UTILITY FUNCTIONS ====================

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const simulateTypingDelay = async (delay: number = TYPING_DELAY): Promise<void> => new Promise(resolve => setTimeout(resolve, delay));

const formatTime = (date: Date): string => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

// ==================== API SERVICE ====================

class APIService {
  private baseUrl: string = API_BASE_URL;
  private userId: string = DEFAULT_USER_ID;

  async getTodaysTasks(date: string = getTodayDate()): Promise<Task[]> {
    try {
      const url = `${this.baseUrl}/todays_tasks?user_id=${this.userId}&date=${date}`;
      console.log('Fetching tasks from:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (data.success && data.tasks) {
        return data.tasks.map((task: any) => ({
          id: task.id || generateId(),
          title: task.title || 'Untitled Task',
          description: task.description || '',
          task: { task: task.description || task.title || '' },
          done: false
        }));
      }
      
      // If no tasks but success, return empty array
      if (data.success) {
        return [];
      }
      
      throw new Error(data.message || 'Failed to fetch tasks');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async summarizeLesson(date: string = getTodayDate()): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/summarize_lesson?user_id=${this.userId}&date=${date}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        }
      );
      const data = await response.json();
      
      if (data.success && data.summary) {
        return data.summary;
      }
      return 'No lesson summary available.';
    } catch (error) {
      console.error('Error fetching lesson:', error);
      throw error;
    }
  }

  async generateTasks(instruction: string = '', date: string = getTodayDate()): Promise<Task[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/generate_tasks?user_id=${this.userId}&date=${date}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ instruction })
        }
      );
      const data = await response.json();
      
      if (data.success && data.tasks) {
        return data.tasks.map((task: any) => ({
          id: task.id || generateId(),
          title: task.title || 'Untitled Task',
          description: task.description || '',
          task: { task: task.description || task.title || '' },
          done: false
        }));
      }
      return [];
    } catch (error) {
      console.error('Error generating tasks:', error);
      throw error;
    }
  }
}

// ==================== AI RESPONSE GENERATOR ====================

class AIAssistant {
  private apiService: APIService;
  private currentTasks: Task[] = [];
  private currentLesson: string = '';

  constructor() {
    this.apiService = new APIService();
  }

  async processUserInput(input: string): Promise<Message> {
    const lowerInput = input.toLowerCase();

    // Fetch Today's Tasks
    if (lowerInput.includes('task') && (lowerInput.includes('today') || lowerInput.includes('show') || lowerInput.includes('my'))) {
      try {
        const tasks = await this.apiService.getTodaysTasks();
        this.currentTasks = tasks;
        
        if (tasks.length === 0) {
          return {
            id: generateId(),
            role: 'assistant',
            content: 'No tasks found for today. Would you like me to generate some tasks for you?',
            timestamp: new Date(),
            type: 'text'
          };
        }

        return {
          id: generateId(),
          role: 'assistant',
          content: `Perfect! Here are your ${tasks.length} tasks for today. Click on any task to expand it and see AI-powered actions!`,
          timestamp: new Date(),
          type: 'task-list',
          data: { tasks }
        };
      } catch (error: any) {
        console.error('Task fetch error:', error);
        return {
          id: generateId(),
          role: 'assistant',
          content: `Sorry, I had trouble fetching your tasks.\n\nError: ${error.message || 'Unknown error'}\n\nPlease check:\n• Your internet connection\n• The API is accessible\n• User ID and date are correct\n\nCheck the browser console for more details.`,
          timestamp: new Date(),
          type: 'text'
        };
      }
    }

    // Fetch Lesson Summary
    if (lowerInput.includes('lesson') && (lowerInput.includes('today') || lowerInput.includes('show'))) {
      try {
        const summary = await this.apiService.summarizeLesson();
        this.currentLesson = summary;
        
        const lesson: Lesson = {
          date: getTodayDate(),
          title: 'Today\'s Lesson',
          summary: summary,
          quote: 'Learning is a journey, not a destination.',
          motivation: 'Keep pushing forward! Every step counts.',
          secret_hacks_and_shortcuts: 'Break down complex topics into smaller chunks.',
          tiny_daily_rituals_that_transform: 'Dedicate 25 minutes each morning to focused learning.'
        };

        return {
          id: generateId(),
          role: 'assistant',
          content: 'Here is your lesson for today. Take your time reading through this!',
          timestamp: new Date(),
          type: 'lesson',
          data: { lesson }
        };
      } catch (error) {
        return {
          id: generateId(),
          role: 'assistant',
          content: 'Sorry, I had trouble fetching your lesson. Please try again.',
          timestamp: new Date(),
          type: 'text'
        };
      }
    }

    // Regenerate Tasks
    if (lowerInput.includes('regenerate') && lowerInput.includes('task')) {
      return {
        id: generateId(),
        role: 'assistant',
        content: 'I will use AI to create brand new tasks tailored to your learning style! This will replace your current tasks. Ready to proceed?',
        timestamp: new Date(),
        type: 'action-confirm',
        data: { action: 'regenerate_all', message: 'Generate new AI-powered tasks' }
      };
    }

    // Simplify Tasks
    if ((lowerInput.includes('simplify') || lowerInput.includes('easier')) && lowerInput.includes('task')) {
      return {
        id: generateId(),
        role: 'assistant',
        content: 'No worries! I will break down your tasks into smaller, easier steps. Shall I simplify them for you?',
        timestamp: new Date(),
        type: 'action-confirm',
        data: { action: 'simplify_all', message: 'Simplify all tasks' }
      };
    }

    // Make Tasks Harder
    if ((lowerInput.includes('harder') || lowerInput.includes('challenge')) && lowerInput.includes('task')) {
      return {
        id: generateId(),
        role: 'assistant',
        content: 'Love the ambition! I will add more complexity and advanced concepts to challenge your skills. Ready to level up?',
        timestamp: new Date(),
        type: 'action-confirm',
        data: { action: 'make_harder_all', message: 'Increase difficulty level' }
      };
    }

    // Progress Stats
    if (lowerInput.includes('progress') || lowerInput.includes('stat')) {
      const completed = this.currentTasks.filter(t => t.done).length;
      const total = this.currentTasks.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        id: generateId(),
        role: 'assistant',
        content: `Your Progress Today:\n\nCompleted: ${completed}/${total} tasks\nProgress: ${percentage}%\nStreak: 7 days\nXP Earned: ${completed * 50}\n\n${completed === total ? 'Perfect! You have crushed all tasks today!' : `${total - completed} more to go! You got this!`}`,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Motivation
    if (lowerInput.includes('motivate') || lowerInput.includes('encourage')) {
      return {
        id: generateId(),
        role: 'assistant',
        content: `You are doing amazing!\n\n"The only way to do great work is to love what you do."\n\nEvery expert was once a beginner. Keep learning and growing!\n\nRemember: Small daily progress leads to big results!`,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Default Response
    return {
      id: generateId(),
      role: 'assistant',
      content: `Hey! I am here to help you learn!\n\nI can:\n\n• Show your daily tasks\n• Display today's lesson\n• Regenerate or simplify tasks\n• Give you hints and motivation\n• Track your progress\n\nWhat would you like to do?`,
      timestamp: new Date(),
      type: 'text'
    };
  }

  async executeAction(action: string): Promise<{ tasks?: Task[], message: string }> {
    await simulateTypingDelay(2000);
    
    if (action === 'regenerate_all') {
      try {
        const tasks = await this.apiService.generateTasks('Regenerate all tasks with fresh ideas');
        this.currentTasks = tasks;
        return {
          tasks,
          message: 'Done! I have created brand new AI-generated tasks matched to your skill level! Check them out above!'
        };
      } catch (error) {
        return {
          message: 'Sorry, I had trouble generating new tasks. Please try again.'
        };
      }
    }
    
    if (action === 'simplify_all') {
      try {
        const tasks = await this.apiService.generateTasks('Make these tasks easier for a beginner');
        this.currentTasks = tasks;
        return {
          tasks,
          message: 'Perfect! All tasks are now simplified and broken into easier steps! Start small and build momentum!'
        };
      } catch (error) {
        return {
          message: 'Sorry, I had trouble simplifying tasks. Please try again.'
        };
      }
    }
    
    if (action === 'make_harder_all') {
      try {
        const tasks = await this.apiService.generateTasks('Make these tasks more challenging with advanced concepts');
        this.currentTasks = tasks;
        return {
          tasks,
          message: 'Challenge accepted! Tasks upgraded with advanced concepts! Time to push your limits!'
        };
      } catch (error) {
        return {
          message: 'Sorry, I had trouble making tasks harder. Please try again.'
        };
      }
    }

    return {
      message: 'Action completed successfully!'
    };
  }

  updateTaskCompletion(taskId: string, done: boolean) {
    const task = this.currentTasks.find(t => t.id === taskId);
    if (task) {
      task.done = done;
    }
  }

  getTasks(): Task[] {
    return this.currentTasks;
  }
}

// ==================== COMPONENTS ====================

const DuolingoActionButton = ({ action, onClick }: {
  action: QuickAction;
  onClick: () => void;
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`group relative overflow-hidden rounded-xl transition-all duration-200 ${
        isPressed ? 'scale-95' : 'scale-100 hover:scale-105'
      }`}
      style={{
        boxShadow: isPressed 
          ? '0 2px 8px rgba(0,0,0,0.1)' 
          : '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
      
      <div className="relative px-3 py-3 flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <span className="text-base">{action.emoji}</span>
        </div>
        
        <div className="flex-1 text-left min-w-0">
          <h3 className="text-white font-bold text-xs mb-0.5 truncate">{action.label}</h3>
          <p className="text-white/80 text-[10px] font-medium truncate">{action.description}</p>
        </div>

        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform flex-shrink-0">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};

const TaskCard = ({ task, onToggleComplete, onAction }: {
  task: Task;
  onToggleComplete: (id: string) => void;
  onAction: (action: string, taskId: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const taskContent = task.description || task.task?.task || task.title;

  return (
    <div className={`bg-white rounded-xl border-2 transition-all duration-300 ${
      task.done 
        ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50' 
        : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
    }`}>
      <div className="p-3">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleComplete(task.id)}
            className="mt-0.5 flex-shrink-0 transition-all duration-200 hover:scale-110"
          >
            {task.done ? (
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full hover:border-purple-500 transition-colors" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className={`font-bold text-sm ${task.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </h4>
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {!expanded && (
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {taskContent}
              </p>
            )}
            
            {expanded && (
              <div className="space-y-3 mt-3">
                <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {taskContent}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span>AI Actions</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onAction('regenerate', task.id)}
                      className="px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-lg hover:shadow-lg active:scale-95 transition-all"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <RotateCw className="w-3 h-3" />
                        Regenerate
                      </div>
                    </button>
                    <button
                      onClick={() => onAction('simplify', task.id)}
                      className="px-3 py-2 bg-white border-2 border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:border-purple-300 hover:shadow-md active:scale-95 transition-all"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Scissors className="w-3 h-3" />
                        Simplify
                      </div>
                    </button>
                    <button
                      onClick={() => onAction('harder', task.id)}
                      className="px-3 py-2 bg-white border-2 border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:border-purple-300 hover:shadow-md active:scale-95 transition-all"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Target className="w-3 h-3" />
                        Harder
                      </div>
                    </button>
                    <button
                      onClick={() => onAction('hint', task.id)}
                      className="px-3 py-2 bg-white border-2 border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:border-purple-300 hover:shadow-md active:scale-95 transition-all"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        Hint
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LessonCard = ({ lesson }: { lesson: Lesson }) => (
  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200 shadow-lg">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
        <BookOpen className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-black text-gray-800 text-base mb-0.5">{lesson.title || 'Today\'s Lesson'}</h3>
        <p className="text-xs text-gray-600 font-semibold">{lesson.date}</p>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-200">
        <h4 className="font-bold text-gray-700 text-xs mb-2 flex items-center gap-2">
          <Star className="w-3 h-3 text-amber-500" />
          Summary
        </h4>
        <p className="text-xs text-gray-700 leading-relaxed">{lesson.summary}</p>
      </div>
      
      {lesson.quote && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 border-2 border-purple-300">
          <p className="text-xs text-gray-800 italic font-medium text-center">{lesson.quote}</p>
        </div>
      )}
      
      {(lesson.secret_hacks_and_shortcuts || lesson.tiny_daily_rituals_that_transform) && (
        <div className="grid grid-cols-1 gap-2">
          {lesson.secret_hacks_and_shortcuts && (
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-emerald-200">
              <h4 className="font-bold text-gray-700 text-xs mb-2 flex items-center gap-2">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                Secret Hack
              </h4>
              <p className="text-xs text-gray-700">{lesson.secret_hacks_and_shortcuts}</p>
            </div>
          )}
          
          {lesson.tiny_daily_rituals_that_transform && (
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-blue-200">
              <h4 className="font-bold text-gray-700 text-xs mb-2 flex items-center gap-2">
                <Target className="w-3 h-3 text-blue-500" />
                Daily Ritual
              </h4>
              <p className="text-xs text-gray-700">{lesson.tiny_daily_rituals_that_transform}</p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

const ActionConfirmCard = ({ message, action, onConfirm, onCancel }: {
  message: string;
  action: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-300 shadow-lg">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <Zap className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-gray-800 text-sm mb-1">Confirm Action</h4>
        <p className="text-xs text-gray-700 font-medium">{message}</p>
      </div>
    </div>
    
    <div className="flex gap-2">
      <button
        onClick={onConfirm}
        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-black rounded-lg hover:shadow-lg active:scale-95 transition-all"
      >
        Yes, Do It!
      </button>
      <button
        onClick={onCancel}
        className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 text-xs font-black rounded-lg hover:border-gray-400 hover:shadow-md active:scale-95 transition-all"
      >
        Cancel
      </button>
    </div>
  </div>
);

const MessageBubble = ({ message, onTaskToggle, onTaskAction, onActionConfirm, onActionCancel }: {
  message: Message;
  onTaskToggle: (taskId: string) => void;
  onTaskAction: (action: string, taskId: string) => void;
  onActionConfirm: (action: string) => void;
  onActionCancel: () => void;
}) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
          : 'bg-gradient-to-br from-emerald-400 to-teal-500'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-xl px-3 py-2 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
            : 'bg-white border-2 border-gray-200 text-gray-800 shadow-sm'
        }`}>
          {message.type === 'loading' ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
              <span className="text-xs font-semibold text-gray-600">Thinking...</span>
            </div>
          ) : message.type === 'task-list' && message.data?.tasks ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold mb-3">{message.content}</p>
              {message.data.tasks.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onTaskToggle}
                  onAction={onTaskAction}
                />
              ))}
            </div>
          ) : message.type === 'lesson' && message.data?.lesson ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold mb-3">{message.content}</p>
              <LessonCard lesson={message.data.lesson} />
            </div>
          ) : message.type === 'action-confirm' && message.data ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold mb-3">{message.content}</p>
              <ActionConfirmCard
                message={message.data.message}
                action={message.data.action}
                onConfirm={() => onActionConfirm(message.data.action)}
                onCancel={onActionCancel}
              />
            </div>
          ) : (
            <p className="text-xs whitespace-pre-line leading-relaxed font-medium">{message.content}</p>
          )}
        </div>
        <span className="text-[10px] text-gray-400 mt-1 px-2 font-semibold">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const GoalGridChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: 'Hey there, learner! I am your AI buddy!\n\nI am here to help you learn and grow. Pick an action below or just chat with me!',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streak, setStreak] = useState(7);
  const [xp, setXp] = useState(350);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiAssistant = useRef(new AIAssistant());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isTyping) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const loadingMessage: Message = {
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      type: 'loading'
    };

    setMessages(prev => [...prev, loadingMessage]);

    await simulateTypingDelay();

    try {
      const response = await aiAssistant.current.processUserInput(textToSend);
      setMessages(prev => prev.filter(m => m.id !== 'loading').concat(response));
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => prev.filter(m => m.id !== 'loading').concat(errorMessage));
    }

    setIsTyping(false);
  }, [inputValue, isTyping]);

  const handleQuickAction = useCallback((action: string) => {
    handleSendMessage(action);
  }, [handleSendMessage]);

  const handleTaskToggle = useCallback((taskId: string) => {
    aiAssistant.current.updateTaskCompletion(taskId, true);
    setXp(prev => prev + 50);
    
    setMessages(prev => prev.map(msg => {
      if (msg.type === 'task-list' && msg.data?.tasks) {
        return {
          ...msg,
          data: {
            ...msg.data,
            tasks: msg.data.tasks.map((t: Task) =>
              t.id === taskId ? { ...t, done: !t.done } : t
            )
          }
        };
      }
      return msg;
    }));
  }, []);

  const handleTaskAction = useCallback(async (action: string, taskId: string) => {
    const loadingMessage: Message = {
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      type: 'loading'
    };

    setMessages(prev => [...prev, loadingMessage]);
    setIsTyping(true);

    await simulateTypingDelay();

    let responseContent = '';
    
    if (action === 'regenerate') {
      responseContent = `Task regenerated! I have created a fresh version of this task with a new approach. Check it out above!`;
    } else if (action === 'simplify') {
      responseContent = `Task simplified! I have broken this down into smaller, easier steps. You got this!`;
    } else if (action === 'harder') {
      responseContent = `Challenge mode activated! This task now includes advanced concepts to push your skills further!`;
    } else if (action === 'hint') {
      responseContent = `Here is a hint: Start by breaking the task into 3 smaller steps. Focus on understanding the core concept first before diving into implementation. You are on the right track!`;
    }

    const response: Message = {
      id: generateId(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => prev.filter(m => m.id !== 'loading').concat(response));
    setIsTyping(false);
  }, []);

  const handleActionConfirm = useCallback(async (action: string) => {
    const loadingMessage: Message = {
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      type: 'loading'
    };

    setMessages(prev => [...prev, loadingMessage]);
    setIsTyping(true);

    try {
      const result = await aiAssistant.current.executeAction(action);
      
      const response: Message = {
        id: generateId(),
        role: 'assistant',
        content: result.message,
        timestamp: new Date(),
        type: result.tasks ? 'task-list' : 'text',
        data: result.tasks ? { tasks: result.tasks } : undefined
      };

      setMessages(prev => prev.filter(m => m.id !== 'loading').concat(response));
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => prev.filter(m => m.id !== 'loading').concat(errorMessage));
    }

    setIsTyping(false);
  }, []);

  const handleActionCancel = useCallback(() => {
    const cancelMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: 'No problem! Action cancelled. What else can I help you with?',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, cancelMessage]);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden" style={{ height: '700px' }}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-white">GoalGrid AI</h1>
                <p className="text-xs text-white/90 font-semibold">Your Learning Companion</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl">
                <Flame className="w-4 h-4 text-white" />
                <div>
                  <p className="text-[10px] text-white/80 font-semibold">Streak</p>
                  <p className="text-sm font-black text-white">{streak} days</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl">
                <Trophy className="w-4 h-4 text-white" />
                <div>
                  <p className="text-[10px] text-white/80 font-semibold">XP</p>
                  <p className="text-sm font-black text-white">{xp}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-pink-50/50">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onTaskToggle={handleTaskToggle}
                onTaskAction={handleTaskAction}
                onActionConfirm={handleActionConfirm}
                onActionCancel={handleActionCancel}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-5 py-4 bg-white border-t-2 border-purple-100 flex-shrink-0">
            <div className="mb-3">
              <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {QUICK_ACTIONS.map((action, index) => (
                  <DuolingoActionButton
                    key={index}
                    action={action}
                    onClick={() => handleQuickAction(action.action)}
                  />
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex gap-3 items-end">
              <div className="flex-1 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-purple-400 transition-colors">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything or describe what you want to learn..."
                  className="w-full px-4 py-3 bg-transparent resize-none outline-none text-sm font-medium text-gray-800 placeholder-gray-400"
                  rows={2}
                  disabled={isTyping}
                />
              </div>
              
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className={`px-5 py-3 rounded-xl font-black text-white shadow-lg transition-all ${
                  inputValue.trim() && !isTyping
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-xl hover:scale-105 active:scale-95'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalGridChatbot;