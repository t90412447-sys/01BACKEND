import { useState, useEffect, useMemo } from 'react';
import { Sparkles, Trophy, Flame, TrendingUp, Calendar, Target, Award, CheckCircle, Star, Plus, Trash2, Edit3, BarChart3, Zap, Heart, MessageCircle, Users, Gift } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Action {
  id: string;
  label: string;
  difficulty: 'easy' | 'medium' | 'hard';
  benefit: string;
  count: number;
  stars: number;
  reflection: string;
  timestamp: number;
  category: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  unlocked: boolean;
  progress: number;
}

interface Stats {
  totalActions: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  weeklyAverage: number;
  completionRate: number;
}

// ============================================================================
// CONSTANTS & PREDEFINED DATA
// ============================================================================

const PREDEFINED_ACTIONS = [
  { label: 'Compliment Someone', difficulty: 'easy' as const, benefit: 'Builds rapport & spreads positivity', category: 'Connection' },
  { label: 'Practice Small Talk', difficulty: 'easy' as const, benefit: 'Improves everyday social fluency', category: 'Communication' },
  { label: 'Help a Colleague', difficulty: 'easy' as const, benefit: 'Builds goodwill & team trust', category: 'Collaboration' },
  { label: 'Send Thank You Message', difficulty: 'easy' as const, benefit: 'Strengthens relationships', category: 'Gratitude' },
  { label: 'Active Listening Practice', difficulty: 'easy' as const, benefit: 'Enhances understanding & empathy', category: 'Communication' },
  
  { label: 'Initiate Conversation', difficulty: 'medium' as const, benefit: 'Builds confidence & social momentum', category: 'Initiative' },
  { label: 'Join Group Activity', difficulty: 'medium' as const, benefit: 'Expands social circle & comfort zone', category: 'Collaboration' },
  { label: 'Reconnect with Old Friend', difficulty: 'medium' as const, benefit: 'Maintains valuable relationships', category: 'Connection' },
  { label: 'Public Speaking Moment', difficulty: 'medium' as const, benefit: 'Overcomes fear & builds presence', category: 'Leadership' },
  { label: 'Network with Stranger', difficulty: 'medium' as const, benefit: 'Opens new opportunities', category: 'Initiative' },
  
  { label: 'Ask for Honest Feedback', difficulty: 'hard' as const, benefit: 'Accelerates self-awareness & growth', category: 'Development' },
  { label: 'Share Vulnerable Story', difficulty: 'hard' as const, benefit: 'Deepens authentic connection', category: 'Connection' },
  { label: 'Give Constructive Criticism', difficulty: 'hard' as const, benefit: 'Builds trust through honesty', category: 'Leadership' },
  { label: 'Invite Someone New Out', difficulty: 'hard' as const, benefit: 'Expands network courageously', category: 'Initiative' },
  { label: 'Resolve a Conflict', difficulty: 'hard' as const, benefit: 'Strengthens emotional intelligence', category: 'Development' },
];

const DIFFICULTY_CONFIG = {
  easy: { xp: 10, color: '#a78bfa', label: 'Easy', icon: '🌱' },
  medium: { xp: 25, color: '#c084fc', label: 'Medium', icon: '🔥' },
  hard: { xp: 50, color: '#e879f9', label: 'Hard', icon: '💎' },
};

const ACHIEVEMENTS = [
  { id: 'first_step', title: 'First Step', description: 'Complete your first action', icon: '🌟', threshold: 1 },
  { id: 'getting_started', title: 'Getting Started', description: 'Complete 5 actions', icon: '✨', threshold: 5 },
  { id: 'momentum_builder', title: 'Momentum Builder', description: 'Complete 10 actions', icon: '🚀', threshold: 10 },
  { id: 'social_warrior', title: 'Social Warrior', description: 'Complete 25 actions', icon: '⚡', threshold: 25 },
  { id: 'legendary', title: 'Legendary', description: 'Complete 50 actions', icon: '👑', threshold: 50 },
  { id: 'streak_master', title: 'Streak Master', description: 'Maintain a 7-day streak', icon: '🔥', threshold: 7 },
  { id: 'xp_hunter', title: 'XP Hunter', description: 'Earn 500 XP', icon: '💰', threshold: 500 },
];

const MOTIVATIONAL_QUOTES = [
  "Every conversation is a chance to grow.",
  "Small actions create powerful momentum.",
  "You're building skills that last a lifetime.",
  "Consistency beats perfection every time.",
  "Your comfort zone is expanding!",
  "Social skills are learnable, not innate.",
  "Each interaction is practice, not performance.",
  "Progress, not perfection, is the goal.",
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const calculateStreak = (actions: Action[]): number => {
  if (actions.length === 0) return 0;
  
  const sortedActions = [...actions].sort((a, b) => b.timestamp - a.timestamp);
  const today = new Date().setHours(0, 0, 0, 0);
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  let streak = 0;
  let currentDate = today;
  
  for (const action of sortedActions) {
    const actionDate = new Date(action.timestamp).setHours(0, 0, 0, 0);
    const diffDays = Math.floor((currentDate - actionDate) / oneDayMs);
    
    if (diffDays === 0 || diffDays === 1) {
      if (diffDays === 1) streak++;
      currentDate = actionDate;
    } else {
      break;
    }
  }
  
  return streak;
};

const getWeeklyData = (actions: Action[]) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const count = actions.filter(a => 
      a.timestamp >= date.getTime() && a.timestamp < nextDate.getTime()
    ).length;
    
    weekData.push({
      day: days[date.getDay()],
      actions: count,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return weekData;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BlogView() {
  const [actions, setActions] = useState<Action[]>([]);
  const [customAction, setCustomAction] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [dailyQuote, setDailyQuote] = useState('');

  // Initialize daily quote
  useEffect(() => {
    const quoteIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
    setDailyQuote(MOTIVATIONAL_QUOTES[quoteIndex]);
  }, []);

  // Calculate statistics
  const stats: Stats = useMemo(() => {
    const totalActions = actions.length;
    const totalXP = actions.reduce((sum, action) => 
      sum + (DIFFICULTY_CONFIG[action.difficulty].xp * action.count), 0
    );
    const currentStreak = calculateStreak(actions);
    const weeklyData = getWeeklyData(actions);
    const weeklyAverage = weeklyData.reduce((sum, day) => sum + day.actions, 0) / 7;
    const actionsWithReflections = actions.filter(a => a.reflection.trim().length > 0).length;
    const completionRate = totalActions > 0 ? (actionsWithReflections / totalActions) * 100 : 0;

    return {
      totalActions,
      totalXP,
      currentStreak,
      longestStreak: currentStreak,
      weeklyAverage: Math.round(weeklyAverage * 10) / 10,
      completionRate: Math.round(completionRate)
    };
  }, [actions]);

  // Calculate achievements
  const achievements: Achievement[] = useMemo(() => {
    return ACHIEVEMENTS.map(achievement => {
      let progress = 0;
      
      if (achievement.id === 'streak_master') {
        progress = stats.currentStreak;
      } else if (achievement.id === 'xp_hunter') {
        progress = stats.totalXP;
      } else {
        progress = stats.totalActions;
      }
      
      return {
        ...achievement,
        unlocked: progress >= achievement.threshold,
        progress: Math.min(progress, achievement.threshold)
      };
    });
  }, [stats]);

  // Show notification helper
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Trigger confetti
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Log predefined action
  const logPredefinedAction = (actionTemplate: typeof PREDEFINED_ACTIONS[0]) => {
    const existingAction = actions.find(a => a.label === actionTemplate.label);
    
    if (existingAction) {
      setActions(actions.map(a => 
        a.label === actionTemplate.label 
          ? { ...a, count: a.count + 1, timestamp: Date.now() }
          : a
      ));
      showNotification(`+${DIFFICULTY_CONFIG[actionTemplate.difficulty].xp} XP! ${actionTemplate.label} completed again!`);
    } else {
      const newAction: Action = {
        id: generateId(),
        label: actionTemplate.label,
        difficulty: actionTemplate.difficulty,
        benefit: actionTemplate.benefit,
        category: actionTemplate.category,
        count: 1,
        stars: 0,
        reflection: '',
        timestamp: Date.now()
      };
      
      setActions([newAction, ...actions]);
      showNotification(`🎉 +${DIFFICULTY_CONFIG[actionTemplate.difficulty].xp} XP! First time completing: ${actionTemplate.label}`);
    }

    // Check for milestone achievements
    if ((actions.length + 1) % 10 === 0) {
      triggerConfetti();
    }
  };

  // Log custom action
  const logCustomAction = () => {
    if (!customAction.trim()) return;

    const newAction: Action = {
      id: generateId(),
      label: customAction,
      difficulty: selectedDifficulty,
      benefit: 'Custom social action',
      category: 'Custom',
      count: 1,
      stars: 0,
      reflection: '',
      timestamp: Date.now()
    };

    setActions([newAction, ...actions]);
    showNotification(`✨ +${DIFFICULTY_CONFIG[selectedDifficulty].xp} XP! Custom action logged!`);
    setCustomAction('');
  };

  // Update action reflection
  const updateReflection = (id: string, reflection: string) => {
    setActions(actions.map(a => a.id === id ? { ...a, reflection } : a));
  };

  // Update action rating
  const updateRating = (id: string, stars: number) => {
    setActions(actions.map(a => a.id === id ? { ...a, stars } : a));
  };

  // Delete action
  const deleteAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
    showNotification('Action removed');
  };

  // Filter actions
  const filteredActions = filterDifficulty === 'all' 
    ? actions 
    : actions.filter(a => a.difficulty === filterDifficulty);

  // Get weekly chart data
  const weeklyChartData = getWeeklyData(actions);
  const maxWeeklyActions = Math.max(...weeklyChartData.map(d => d.actions), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-medium text-purple-200">Social Skills Mastery Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Action Tracker Pro
          </h1>
          
          <p className="text-purple-200 text-lg md:text-xl max-w-2xl mx-auto mb-4">
            Transform your social skills through deliberate practice. Track actions, build momentum, and unlock your potential.
          </p>

          <div className="flex items-center justify-center gap-2 text-purple-300 italic">
            <Sparkles className="w-4 h-4" />
            <p className="text-sm">{dailyQuote}</p>
            <Sparkles className="w-4 h-4" />
          </div>
        </header>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-purple-300 text-sm font-medium">Total XP</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalXP}</p>
            <p className="text-purple-300 text-xs mt-1">Experience Points</p>
          </div>

          <div className="bg-gradient-to-br from-pink-800/60 to-purple-900/60 backdrop-blur-sm p-6 rounded-2xl border border-pink-500/30 hover:border-pink-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-6 h-6 text-orange-400" />
              <span className="text-purple-300 text-sm font-medium">Streak</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.currentStreak}</p>
            <p className="text-purple-300 text-xs mt-1">Days in a row</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-800/60 to-purple-900/60 backdrop-blur-sm p-6 rounded-2xl border border-indigo-500/30 hover:border-indigo-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-purple-300 text-sm font-medium">Actions</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalActions}</p>
            <p className="text-purple-300 text-xs mt-1">Total completed</p>
          </div>

          <div className="bg-gradient-to-br from-purple-800/60 to-indigo-900/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <span className="text-purple-300 text-sm font-medium">Weekly Avg</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.weeklyAverage}</p>
            <p className="text-purple-300 text-xs mt-1">Actions per day</p>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-purple-100">Achievements</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-xl border text-center transition-all ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
                    : 'bg-purple-950/40 border-purple-700/30 opacity-60'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-xs font-semibold text-purple-100 mb-1">{achievement.title}</p>
                <p className="text-xs text-purple-300">{achievement.progress}/{achievement.threshold}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-purple-100">Weekly Activity</h2>
          </div>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyChartData.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-purple-950/50 rounded-t-lg relative overflow-hidden" style={{ height: '100%' }}>
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(day.actions / maxWeeklyActions) * 100}%` }}
                  />
                  {day.actions > 0 && (
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-white">
                      {day.actions}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-purple-200">{day.day}</p>
                  <p className="text-xs text-purple-400">{day.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Action Input */}
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-purple-100">Log Custom Action</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && logCustomAction()}
              placeholder="Describe your social action..."
              className="flex-1 px-4 py-3 bg-purple-950/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
            />
            
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-purple-950/50 text-purple-300 border border-purple-700/30 hover:border-purple-500/50'
                  }`}
                >
                  {DIFFICULTY_CONFIG[diff].icon} {DIFFICULTY_CONFIG[diff].label}
                </button>
              ))}
            </div>

            <button
              onClick={logCustomAction}
              disabled={!customAction.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 inline mr-1" /> Log Action
            </button>
          </div>
        </div>

        {/* Predefined Actions Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-purple-100">Quick Actions</h2>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 bg-purple-900/60 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {['easy', 'medium', 'hard'].map(difficulty => {
            const difficultyActions = PREDEFINED_ACTIONS.filter(a => a.difficulty === difficulty);
            if (filterDifficulty !== 'all' && filterDifficulty !== difficulty) return null;

            return (
              <div key={difficulty} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG].icon}</span>
                  <h3 className="text-lg font-semibold text-purple-200 capitalize">
                    {difficulty} Actions
                  </h3>
                  <span className="text-xs text-purple-400 ml-2">
                    +{DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG].xp} XP each
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {difficultyActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => logPredefinedAction(action)}
                      className="group relative p-4 bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-xl border border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white group-hover:text-purple-200 transition-colors">
                          {action.label}
                        </h4>
                        <Zap className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-purple-300 mb-2">{action.benefit}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-purple-800/50 rounded-full text-purple-200">
                          {action.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action History Timeline */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-100">Action History</h2>
            <span className="text-sm text-purple-400">({filteredActions.length} actions)</span>
          </div>

          {filteredActions.length === 0 ? (
            <div className="text-center py-16 bg-purple-900/20 rounded-2xl border border-purple-500/20">
              <Target className="w-16 h-16 text-purple-500/50 mx-auto mb-4" />
              <p className="text-purple-300 text-lg mb-2">No actions logged yet</p>
              <p className="text-purple-400 text-sm">Start your journey by logging your first action above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActions.map((action, idx) => (
                <div
                  key={action.id}
                  className="group bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm p-5 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{DIFFICULTY_CONFIG[action.difficulty].icon}</span>
                        <div>
                          <h3 className="font-bold text-white text-lg">
                            {action.label}
                            {action.count > 1 && (
                              <span className="ml-2 text-sm px-2 py-1 bg-purple-700/50 rounded-full">
                                ×{action.count}
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-purple-300">{action.benefit}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-purple-400 mb-3">
                        <span className="px-2 py-1 bg-purple-800/50 rounded-full">{action.category}</span>
                        <span className="px-2 py-1 bg-purple-800/50 rounded-full capitalize">{action.difficulty}</span>
                        <span>+{DIFFICULTY_CONFIG[action.difficulty].xp * action.count} XP</span>
                        <span>{new Date(action.timestamp).toLocaleDateString()}</span>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => updateRating(action.id, star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= action.stars
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-purple-700'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Reflection Input */}
                      {editingAction === action.id ? (
                        <div className="mt-3">
                          <textarea
                            value={action.reflection}
                            onChange={(e) => updateReflection(action.id, e.target.value)}
                            placeholder="How did this action go? What did you learn?"
                            className="w-full px-3 py-2 bg-purple-950/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                            rows={3}
                          />
                          <button
                            onClick={() => setEditingAction(null)}
                            className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
                          >
                            Save Reflection
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3">
                          {action.reflection ? (
                            <div 
                              onClick={() => setEditingAction(action.id)}
                              className="p-3 bg-purple-950/30 rounded-lg border border-purple-700/30 cursor-pointer hover:border-purple-600/50 transition-colors"
                            >
                              <p className="text-sm text-purple-200">{action.reflection}</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingAction(action.id)}
                              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Add reflection about this experience...
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingAction(editingAction === action.id ? null : action.id)}
                        className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
                        title="Edit reflection"
                      >
                        <Edit3 className="w-4 h-4 text-purple-400" />
                      </button>
                      <button
                        onClick={() => deleteAction(action.id)}
                        className="p-2 hover:bg-red-900/50 rounded-lg transition-colors"
                        title="Delete action"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insights & Analytics */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-purple-100">Your Progress Insights</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-950/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-pink-400" />
                <h3 className="font-semibold text-purple-100">Reflection Rate</h3>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-white">{stats.completionRate}%</p>
                <p className="text-sm text-purple-300 mb-1">of actions have reflections</p>
              </div>
              <div className="mt-2 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-purple-950/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-purple-100">Most Active Category</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {(() => {
                  if (actions.length === 0) return 'None yet';
                  const categoryCount = actions.reduce((acc, action) => {
                    acc[action.category] = (acc[action.category] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  const entries = Object.entries(categoryCount);
                  const sorted = entries.sort((a, b) => b[1] - a[1]);
                  return sorted[0]?.[0] || 'None';
                })()}
              </p>
              <p className="text-sm text-purple-300 mt-1">Your focus area</p>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="text-center py-8 border-t border-purple-500/20">
          <div className="flex items-center justify-center gap-4 text-purple-300 text-sm">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>{achievements.filter(a => a.unlocked).length} / {achievements.length} achievements unlocked</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Level {Math.floor(stats.totalXP / 100) + 1}</span>
            </div>
          </div>
        </div>

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-8xl animate-bounce">🎉</div>
          </div>
        )}

        {/* Notification Toast */}
        {notification && (
          <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-slide-up border border-purple-400/50 backdrop-blur-sm z-50">
            <p className="font-semibold">{notification}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}