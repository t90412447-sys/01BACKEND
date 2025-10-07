import { useState, useEffect } from 'react';
import { Users, Trophy, Target, MessageCircle, Bell, Search, Filter, TrendingUp, Award, Flame, Crown, Star, Zap, Calendar, Clock, Share2, BarChart3, Gift, Heart, ThumbsUp, Send, X, Plus, ChevronRight, Moon, Sun, Sparkles, CheckCircle, Edit3, Trash2 } from 'lucide-react';

// CONSTANTS
const LEAGUES = {
  BRONZE: { name: 'Bronze', color: '#cd7f32', gradient: 'linear-gradient(135deg, #cd7f32 0%, #d4a574 100%)', min: 0 },
  SILVER: { name: 'Silver', color: '#c0c0c0', gradient: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)', min: 500 },
  GOLD: { name: 'Gold', color: '#ffd700', gradient: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)', min: 1000 },
  PLATINUM: { name: 'Platinum', color: '#e5e4e2', gradient: 'linear-gradient(135deg, #e5e4e2 0%, #f5f5f5 100%)', min: 2000 },
  DIAMOND: { name: 'Diamond', color: '#b9f2ff', gradient: 'linear-gradient(135deg, #b9f2ff 0%, #d4f1ff 100%)', min: 5000 },
};

const MOOD_OPTIONS = [
  { emoji: '🚀', label: 'Motivated', color: '#9333ea' },
  { emoji: '🎯', label: 'Focused', color: '#7c3aed' },
  { emoji: '💪', label: 'Strong', color: '#8b5cf6' },
  { emoji: '🧠', label: 'Learning', color: '#a78bfa' },
  { emoji: '😊', label: 'Happy', color: '#c084fc' },
  { emoji: '🔥', label: 'On Fire', color: '#d946ef' },
];

const MOTIVATIONAL_QUOTES = [
  "Every conversation is a chance to grow.",
  "Small actions create powerful momentum.",
  "You're building skills that last a lifetime.",
  "Consistency beats perfection every time.",
];

// MOCK DATA
const mockFriends = [
  {
    id: 1,
    name: 'Alice Martinez',
    username: '@alice_learns',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'Crushing my goals today!',
    mood: '🚀',
    bio: 'Learning enthusiast | Coffee addict',
    streak: 5,
    XP: 120,
    tasksCompleted: 15,
    lessonsCompleted: 4,
    level: 3,
    rank: 12,
    league: 'GOLD',
    coins: 450,
    achievements: ['Week Warrior', 'Speed Learner', 'Early Bird', 'Streak Master'],
    isOnline: true,
    combo: 3,
    weeklyXP: 890,
    totalXP: 12500,
    crowns: 12,
    studyTime: 45,
    completionRate: 92,
  },
  {
    id: 2,
    name: 'Bob Chen',
    username: '@bob_codes',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'Deep in learning mode',
    mood: '🧠',
    bio: 'Night owl | Python enthusiast',
    streak: 3,
    XP: 90,
    tasksCompleted: 10,
    lessonsCompleted: 7,
    level: 2,
    rank: 24,
    league: 'SILVER',
    coins: 220,
    achievements: ['Consistent Learner', 'Night Owl'],
    isOnline: false,
    combo: 1,
    weeklyXP: 430,
    totalXP: 8900,
    crowns: 5,
    studyTime: 32,
    completionRate: 78,
  },
  {
    id: 3,
    name: 'Charlie Davis',
    username: '@charlie_ace',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'On an unstoppable streak!',
    mood: '🔥',
    bio: 'Streak master | Achievement hunter',
    streak: 7,
    XP: 150,
    tasksCompleted: 20,
    lessonsCompleted: 10,
    level: 4,
    rank: 5,
    league: 'GOLD',
    coins: 680,
    achievements: ['Streak Master', '100 Tasks Club', 'Legend', 'Champion'],
    isOnline: true,
    combo: 7,
    weeklyXP: 1120,
    totalXP: 18900,
    crowns: 28,
    studyTime: 67,
    completionRate: 95,
  },
];

const mockLearningGroups = [
  {
    id: 1,
    name: 'JavaScript Masters',
    description: 'Learn JS together, one challenge at a time!',
    members: 234,
    activeNow: 12,
    icon: '💻',
    category: 'Programming',
    posts: [
      {
        id: 1,
        user: mockFriends[0],
        content: 'Just completed my first React app! It took me 3 days but I learned so much about hooks and state management.',
        timestamp: '2 hours ago',
        reactions: { fire: 12, heart: 15 },
        comments: 5,
      },
    ],
  },
  {
    id: 2,
    name: 'Spanish Amigos',
    description: 'Practice español with native speakers!',
    members: 567,
    activeNow: 34,
    icon: '🇪🇸',
    category: 'Languages',
    posts: [],
  },
  {
    id: 3,
    name: 'Math Wizards',
    description: 'Solving problems, building confidence!',
    members: 189,
    activeNow: 8,
    icon: '🔢',
    category: 'Mathematics',
    posts: [],
  },
];

const mockChallenges = [
  {
    id: 1,
    title: 'Complete 5 tasks',
    description: 'Finish any 5 tasks before the day ends',
    progress: 3,
    target: 5,
    reward: 100,
    rewardType: 'XP',
    timeLeft: '18h 32m',
    type: 'DAILY',
    difficulty: 'EASY',
    icon: '✅',
    participants: 1247,
  },
  {
    id: 2,
    title: 'Study for 30 minutes',
    description: 'Spend at least 30 minutes learning today',
    progress: 15,
    target: 30,
    reward: 50,
    rewardType: 'XP',
    timeLeft: '18h 32m',
    type: 'DAILY',
    difficulty: 'EASY',
    icon: '📚',
    participants: 2341,
  },
  {
    id: 3,
    title: 'Weekly Champion',
    description: 'Earn 1000 XP this week',
    progress: 650,
    target: 1000,
    reward: 500,
    rewardType: 'COINS',
    timeLeft: '3d 12h',
    type: 'WEEKLY',
    difficulty: 'HARD',
    icon: '👑',
    participants: 567,
  },
];

const mockNotifications = [
  { id: 1, type: 'achievement', message: 'You earned the "Week Warrior" badge!', time: '5m ago', icon: '🏆', read: false },
  { id: 2, type: 'friend', message: 'Alice Martinez started following you', time: '1h ago', icon: '👥', read: false },
  { id: 3, type: 'challenge', message: 'New challenge available: "Master Class"', time: '2h ago', icon: '🎯', read: true },
];

const mockActivities = [
  { id: 1, user: 'Alice', action: 'completed', target: 'React Basics', time: '5 min ago', icon: '✅', color: '#8b5cf6' },
  { id: 2, user: 'Bob', action: 'achieved', target: 'Night Owl badge', time: '15 min ago', icon: '🏆', color: '#a855f7' },
  { id: 3, user: 'Charlie', action: 'joined', target: 'Math Wizards', time: '30 min ago', icon: '👥', color: '#c084fc' },
];

const getWeeklyData = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.map((day, idx) => ({
    day,
    actions: Math.floor(Math.random() * 10) + 2,
  }));
};

// Particle Background
const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.5 + 0.2,
    color: i % 3 === 0 ? 'rgba(168, 85, 247, 0.5)' : i % 3 === 1 ? 'rgba(192, 132, 252, 0.4)' : 'rgba(147, 51, 234, 0.45)',
  }));

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: p.color,
            animation: `float ${p.duration}s infinite ease-in-out ${p.delay}s`,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

// Floating Action Button
const FloatingActionButton = ({ onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const actions = [
    { icon: <Plus size={20} />, label: 'Create Post', color: '#8b5cf6' },
    { icon: <Users size={20} />, label: 'Find Friends', color: '#a855f7' },
    { icon: <MessageCircle size={20} />, label: 'New Message', color: '#c084fc' },
    { icon: <Trophy size={20} />, label: 'Achievements', color: '#d946ef' },
  ];

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 999 }}>
      {isOpen && (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
          {actions.map((action, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: `slideInRight 0.3s ease-out ${idx * 0.1}s both`,
              }}
            >
              <span style={{
                background: 'rgba(255, 255, 255, 0.98)',
                padding: '10px 18px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#1a1a1a',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              }}>
                {action.label}
              </span>
              <button
                onClick={onClick}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: action.color,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: `0 6px 20px ${action.color}80`,
                  transition: 'transform 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(147, 51, 234, 0.5)',
          transition: 'transform 0.4s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      >
        <Plus size={36} />
      </button>
    </div>
  );
};

export default function CommunityHub() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [sortOption, setSortOption] = useState('rank');
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [dailyQuote, setDailyQuote] = useState('');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [learningGroups, setLearningGroups] = useState(mockLearningGroups);

  useEffect(() => {
    const quoteIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
    setDailyQuote(MOTIVATIONAL_QUOTES[quoteIndex]);
  }, []);

  const filteredFriends = mockFriends
    .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'rank') return a.rank - b.rank;
      if (sortOption === 'xp') return b.weeklyXP - a.weeklyXP;
      if (sortOption === 'streak') return b.streak - a.streak;
      return 0;
    });

  const unreadCount = notifications.filter(n => !n.read).length;
  const weeklyData = getWeeklyData();
  const maxWeeklyActions = Math.max(...weeklyData.map(d => d.actions), 1);

  const handleReaction = (groupId, postId, reactionType) => {
    setLearningGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          posts: group.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                reactions: {
                  ...post.reactions,
                  [reactionType]: (post.reactions[reactionType] || 0) + 1,
                },
              };
            }
            return post;
          }),
        };
      }
      return group;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white p-4 md:p-8 relative">
      <ParticleBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-medium text-purple-200">Social Skills Mastery Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Purple Learning Hub
          </h1>
          
          <p className="text-purple-200 text-lg md:text-xl max-w-2xl mx-auto mb-4">
            Transform your skills through community, track progress, and unlock your potential
          </p>

          <div className="flex items-center justify-center gap-2 text-purple-300 italic">
            <Sparkles className="w-4 h-4" />
            <p className="text-sm">{dailyQuote}</p>
            <Sparkles className="w-4 h-4" />
          </div>
        </header>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-purple-300 text-sm font-medium">Total XP</span>
            </div>
            <p className="text-3xl font-bold text-white">12,500</p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 font-bold">+15%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-800/60 to-purple-900/60 backdrop-blur-sm p-6 rounded-2xl border border-pink-500/30 hover:border-pink-400/50 transition-all hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-6 h-6 text-orange-400" />
              <span className="text-purple-300 text-sm font-medium">Streak</span>
            </div>
            <p className="text-3xl font-bold text-white">5</p>
            <p className="text-purple-300 text-xs mt-2">Days in a row</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-800/60 to-purple-900/60 backdrop-blur-sm p-6 rounded-2xl border border-indigo-500/30 hover:border-indigo-400/50 transition-all hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-purple-300 text-sm font-medium">Actions</span>
            </div>
            <p className="text-3xl font-bold text-white">156</p>
            <p className="text-purple-300 text-xs mt-2">Total completed</p>
          </div>

          <div className="bg-gradient-to-br from-purple-800/60 to-indigo-900/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-purple-300 text-sm font-medium">Friends</span>
            </div>
            <p className="text-3xl font-bold text-white">42</p>
            <p className="text-purple-300 text-xs mt-2">Connections</p>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-purple-100">Weekly Activity</h2>
          </div>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((day, idx) => (
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 mb-8">
          <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {mockActivities.map(activity => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 bg-purple-950/30 rounded-xl border border-purple-700/30 hover:border-purple-500/50 transition-all cursor-pointer hover:translate-x-2"
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: activity.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: `0 4px 12px ${activity.color}40`,
                }}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-purple-100 font-semibold">
                    <strong>{activity.user}</strong> {activity.action} <strong>{activity.target}</strong>
                  </p>
                  <span className="text-xs text-purple-400">{activity.time}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="Search friends, groups, challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-12 py-4 bg-purple-900/40 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all"
              />
            </div>
            
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-6 py-4 bg-purple-900/40 border-2 border-purple-500/30 rounded-2xl text-white font-semibold cursor-pointer focus:outline-none focus:border-purple-400"
            >
              <option value="rank">Sort by Rank</option>
              <option value="xp">Sort by XP</option>
              <option value="streak">Sort by Streak</option>
            </select>

            <button
              onClick={() => setShowMoodSelector(!showMoodSelector)}
              className="px-6 py-4 bg-purple-900/40 border-2 border-purple-500/30 rounded-2xl text-white font-semibold hover:border-purple-400 transition-all flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Mood
            </button>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative px-6 py-4 bg-purple-900/40 border-2 border-purple-500/30 rounded-2xl text-white font-semibold hover:border-purple-400 transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {showMoodSelector && (
            <div className="mt-4 p-6 bg-purple-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/30">
              <h4 className="text-lg font-bold mb-4 text-purple-100">Set Your Mood</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {MOOD_OPTIONS.map((mood, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMood(mood);
                      setShowMoodSelector(false);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all hover:-translate-y-1 ${
                      selectedMood?.label === mood.label 
                        ? 'border-purple-400 bg-purple-800/50' 
                        : 'border-purple-700/30 bg-purple-950/30'
                    }`}
                  >
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <div className="text-sm font-bold text-purple-200">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showNotifications && (
            <div className="mt-4 p-6 bg-purple-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 max-h-96 overflow-y-auto">
              <h4 className="text-lg font-bold mb-4 text-purple-100">Notifications</h4>
              <div className="space-y-2">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl transition-all cursor-pointer ${
                      notif.read ? 'bg-purple-950/20' : 'bg-purple-800/30'
                    } hover:bg-purple-800/50`}
                    onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? {...n, read: true} : n))}
                  >
                    <div className="flex gap-3">
                      <div className="text-2xl">{notif.icon}</div>
                      <div className="flex-1">
                        <p className={`text-sm ${notif.read ? 'text-purple-300' : 'text-purple-100 font-semibold'}`}>
                          {notif.message}
                        </p>
                        <span className="text-xs text-purple-400">{notif.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {[
            { icon: <Users size={20} />, label: 'Friends', count: mockFriends.length },
            { icon: <Target size={20} />, label: 'Challenges', count: mockChallenges.length },
            { icon: <Trophy size={20} />, label: 'Leaderboard', count: null },
            { icon: <MessageCircle size={20} />, label: 'Groups', count: learningGroups.length },
          ].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTab(idx)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedTab === idx
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-purple-900/40 text-purple-300 border border-purple-700/30 hover:border-purple-500/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  selectedTab === idx ? 'bg-white/20' : 'bg-purple-800/50'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Friends Tab */}
        {selectedTab === 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                Your Learning Squad
              </h2>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2">
                <Plus size={20} />
                Add Friends
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFriends.map(friend => (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-500/50"
                >
                  {/* Friend Card Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-20 h-20 rounded-full border-4 border-purple-500/50"
                      />
                      {friend.isOnline && (
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-purple-900 animate-pulse" />
                      )}
                      <div className="absolute -top-2 -left-2 text-3xl">{friend.mood}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-white">{friend.name}</h3>
                      <p className="text-sm text-purple-300">{friend.username}</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                        friend.league === 'GOLD' ? 'bg-yellow-500/20 text-yellow-400' :
                        friend.league === 'SILVER' ? 'bg-gray-400/20 text-gray-300' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {LEAGUES[friend.league].name}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-purple-200 mb-4 italic">"{friend.status}"</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4 p-4 bg-purple-950/40 rounded-xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{friend.XP}</div>
                      <div className="text-xs text-purple-300">Weekly XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400 flex items-center justify-center gap-1">
                        <Flame size={20} />
                        {friend.streak}
                      </div>
                      <div className="text-xs text-purple-300">Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-400 flex items-center justify-center gap-1">
                        <Crown size={20} />
                        {friend.crowns}
                      </div>
                      <div className="text-xs text-purple-300">Crowns</div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="mb-4">
                    <div className="text-xs font-bold text-purple-300 mb-2 flex items-center gap-2">
                      <Award size={14} />
                      Achievements
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {friend.achievements.slice(0, 3).map((achievement, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold">
                          🏅 {achievement}
                        </span>
                      ))}
                      {friend.achievements.length > 3 && (
                        <span className="text-xs px-3 py-1 bg-purple-800/50 rounded-full text-purple-300">
                          +{friend.achievements.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                      <MessageCircle size={16} />
                      Message
                    </button>
                    <button className="flex-1 px-4 py-3 bg-purple-800/50 border-2 border-purple-500/50 rounded-xl font-bold hover:bg-purple-700/50 transition-all flex items-center justify-center gap-2">
                      <Trophy size={16} />
                      Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {selectedTab === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent flex items-center gap-3">
              <Target size={36} />
              Active Challenges
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockChallenges.map(challenge => {
                const progress = (challenge.progress / challenge.target) * 100;
                const isComplete = challenge.progress >= challenge.target;
                
                return (
                  <div
                    key={challenge.id}
                    className={`bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm p-6 rounded-2xl border-2 transition-all hover:-translate-y-2 ${
                      isComplete ? 'border-green-500/50 shadow-lg shadow-green-500/20' : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-5xl">{challenge.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl text-white">{challenge.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            challenge.type === 'DAILY' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {challenge.type}
                          </span>
                        </div>
                        <p className="text-sm text-purple-300 mb-3">{challenge.description}</p>
                        
                        <div className="flex gap-2 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            challenge.difficulty === 'EASY' ? 'bg-green-500/20 text-green-400' :
                            challenge.difficulty === 'HARD' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {challenge.difficulty}
                          </span>
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold flex items-center gap-1">
                            <Zap size={14} />
                            +{challenge.reward} {challenge.rewardType}
                          </span>
                          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold flex items-center gap-1">
                            <Clock size={14} />
                            {challenge.timeLeft}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-purple-300 font-semibold">Progress</span>
                        <span className="text-purple-200 font-bold">{challenge.progress}/{challenge.target} ({Math.round(progress)}%)</span>
                      </div>
                      <div className="h-4 bg-purple-950/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isComplete 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                              : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-950/30 rounded-xl">
                      <span className="text-xs text-purple-300 flex items-center gap-1">
                        <Users size={14} />
                        {challenge.participants.toLocaleString()} participants
                      </span>
                      {isComplete && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                          ✓ COMPLETED
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {selectedTab === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent flex items-center gap-3">
              <Trophy size={36} />
              Weekly Leaderboard
            </h2>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
              {[...mockFriends].sort((a, b) => b.weeklyXP - a.weeklyXP).slice(0, 3).map((friend, index) => {
                const order = [1, 0, 2];
                const heights = ['180px', '220px', '160px'];
                const medals = ['🥈', '🥇', '🥉'];
                const gradients = [
                  'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)',
                  'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                  'linear-gradient(135deg, #cd7f32 0%, #d4a574 100%)',
                ];

                return (
                  <div
                    key={friend.id}
                    style={{ order: order[index] }}
                    className="flex flex-col items-center"
                  >
                    <div className="mb-4 relative">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className={`rounded-full border-4 ${
                          index === 0 ? 'w-24 h-24 border-yellow-400' : 'w-20 h-20 border-gray-400'
                        }`}
                      />
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-4xl">
                        {medals[index]}
                      </div>
                    </div>

                    <div
                      style={{
                        height: heights[index],
                        background: gradients[index],
                      }}
                      className="w-full rounded-t-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                      <div className="relative z-10 text-center">
                        <h3 className="font-bold text-white text-lg mb-1">{friend.name}</h3>
                        <p className="text-sm text-white/90 mb-3">{friend.username}</p>
                        <div className="bg-white/30 rounded-xl px-4 py-2 mb-2">
                          <div className="text-2xl font-bold text-white">{friend.weeklyXP}</div>
                          <div className="text-xs text-white/90 font-semibold">Weekly XP</div>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <div className="bg-white/20 rounded-lg px-2 py-1">
                            <div className="text-sm font-bold text-white">{friend.streak}</div>
                            <div className="text-xs text-white/80">Streak</div>
                          </div>
                          <div className="bg-white/20 rounded-lg px-2 py-1">
                            <div className="text-sm font-bold text-white">{friend.crowns}</div>
                            <div className="text-xs text-white/80">Crowns</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Rankings */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30">
              <h3 className="text-xl font-bold mb-4 text-purple-100 flex items-center gap-2">
                <BarChart3 size={24} />
                Full Rankings
              </h3>
              
              <div className="space-y-3">
                {[...mockFriends].sort((a, b) => b.weeklyXP - a.weeklyXP).map((friend, index) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-4 p-4 bg-purple-950/30 rounded-xl border border-purple-700/30 hover:border-purple-500/50 transition-all cursor-pointer hover:translate-x-2"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                      'bg-purple-800/50 text-purple-300'
                    }`}>
                      #{index + 1}
                    </div>
                    
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-14 h-14 rounded-full border-2 border-purple-500/50"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{friend.name}</h3>
                      <p className="text-sm text-purple-300">{friend.username}</p>
                    </div>
                    
                    <div className="text-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-400">{friend.weeklyXP}</div>
                      <div className="text-xs text-yellow-300">XP</div>
                    </div>

                    <div className="flex gap-2">
                      <span className="px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-bold flex items-center gap-1">
                        <Flame size={14} />
                        {friend.streak}
                      </span>
                      <span className={`px-3 py-2 rounded-lg text-sm font-bold ${
                        friend.league === 'GOLD' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-400/20 text-gray-300'
                      }`}>
                        {LEAGUES[friend.league].name}
                      </span>
                    </div>

                    <ChevronRight className="w-5 h-5 text-purple-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {selectedTab === 3 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent flex items-center gap-3">
                <MessageCircle size={36} />
                Learning Communities
              </h2>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2">
                <Plus size={20} />
                Create Group
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningGroups.map(group => (
                <div
                  key={group.id}
                  className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all overflow-hidden hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer"
                >
                  {/* Group Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 text-9xl opacity-10">{group.icon}</div>
                    <div className="relative z-10">
                      <div className="text-6xl mb-3">{group.icon}</div>
                      <h3 className="font-bold text-2xl text-white mb-2">{group.name}</h3>
                      <p className="text-sm text-purple-100">{group.description}</p>
                    </div>
                  </div>
                  
                  {/* Group Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-purple-300 flex items-center gap-2">
                        <Users size={16} />
                        {group.members} members
                      </span>
                      <span className="text-sm text-green-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        {group.activeNow} online
                      </span>
                    </div>
                    
                    <span className="inline-block px-3 py-1 bg-purple-800/50 rounded-full text-xs text-purple-200 font-semibold mb-4">
                      {group.category}
                    </span>

                    {/* Recent Posts */}
                    {group.posts.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-purple-300 mb-2 flex items-center gap-2">
                          <MessageCircle size={14} />
                          Recent Posts
                        </h4>
                        {group.posts.slice(0, 1).map(post => (
                          <div key={post.id} className="p-3 bg-purple-950/30 rounded-xl border border-purple-700/30">
                            <div className="flex gap-2 mb-2">
                              <img src={post.user.avatar} alt={post.user.name} className="w-8 h-8 rounded-full" />
                              <div className="flex-1">
                                <h5 className="text-sm font-bold text-white">{post.user.name}</h5>
                                <span className="text-xs text-purple-400">{post.timestamp}</span>
                              </div>
                            </div>
                            <p className="text-sm text-purple-200 mb-2">{post.content.substring(0, 80)}...</p>
                            <div className="flex gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReaction(group.id, post.id, 'fire');
                                }}
                                className="text-xs flex items-center gap-1 text-purple-300 hover:text-orange-400 transition-colors"
                              >
                                🔥 {post.reactions.fire}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReaction(group.id, post.id, 'heart');
                                }}
                                className="text-xs flex items-center gap-1 text-purple-300 hover:text-pink-400 transition-colors"
                              >
                                ❤️ {post.reactions.heart}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPostModal(true);
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                      >
                        <Send size={16} />
                        Post
                      </button>
                      <button className="flex-1 px-4 py-3 bg-purple-800/50 border-2 border-purple-500/50 rounded-xl font-bold hover:bg-purple-700/50 transition-all flex items-center justify-center gap-2">
                        <ChevronRight size={16} />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div
          onClick={() => setShowPostModal(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full p-8 border-2 border-purple-500/50 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                Create New Post
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your learning journey, achievements, or thoughts..."
              className="w-full min-h-[200px] p-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 mb-4 resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setNewPost('');
                  setShowPostModal(false);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!newPost.trim()}
              >
                <Send size={20} />
                Publish Post
              </button>
              <button
                onClick={() => {
                  setNewPost('');
                  setShowPostModal(false);
                }}
                className="px-6 py-3 bg-purple-800/50 border-2 border-purple-500/50 rounded-xl font-bold hover:bg-purple-700/50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Friend Profile Modal */}
      {selectedFriend && (
        <div
          onClick={() => setSelectedFriend(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full border-2 border-purple-500/50 shadow-2xl my-8"
          >
            <button
              onClick={() => setSelectedFriend(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center z-10"
            >
              <X size={24} />
            </button>

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-12 text-center relative overflow-hidden">
              <div className="absolute -top-20 -right-20 text-[200px] opacity-10">{selectedFriend.mood}</div>
              
              <div className="relative z-10">
                <div className="relative inline-block mb-4">
                  <img
                    src={selectedFriend.avatar}
                    alt={selectedFriend.name}
                    className="w-32 h-32 rounded-full border-4 border-white"
                  />
                  {selectedFriend.isOnline && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white animate-pulse" />
                  )}
                  <div className="absolute -top-4 -left-4 text-5xl">{selectedFriend.mood}</div>
                </div>

                <h2 className="text-4xl font-bold text-white mb-2">{selectedFriend.name}</h2>
		<p className="text-purple-200 text-lg mb-2">{selectedFriend.username}</p>
                <p className="text-purple-100 italic mt-2">"{selectedFriend.bio}"</p>
                
                <div 
                  className="inline-block mt-4 px-6 py-2 rounded-full text-sm font-bold text-white"
                  style={{ background: LEAGUES[selectedFriend.league].gradient }}
                >
                  {LEAGUES[selectedFriend.league].name} League
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-purple-950/40 p-4 rounded-xl text-center border border-purple-700/30">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{selectedFriend.totalXP}</div>
                  <div className="text-xs text-purple-300">Total XP</div>
                </div>
                <div className="bg-purple-950/40 p-4 rounded-xl text-center border border-purple-700/30">
                  <div className="text-3xl font-bold text-orange-400 mb-1 flex items-center justify-center gap-1">
                    <Flame size={24} />
                    {selectedFriend.streak}
                  </div>
                  <div className="text-xs text-purple-300">Day Streak</div>
                </div>
                <div className="bg-purple-950/40 p-4 rounded-xl text-center border border-purple-700/30">
                  <div className="text-3xl font-bold text-pink-400 mb-1 flex items-center justify-center gap-1">
                    <Crown size={24} />
                    {selectedFriend.crowns}
                  </div>
                  <div className="text-xs text-purple-300">Crowns</div>
                </div>
                <div className="bg-purple-950/40 p-4 rounded-xl text-center border border-purple-700/30">
                  <div className="text-3xl font-bold text-green-400 mb-1">#{selectedFriend.rank}</div>
                  <div className="text-xs text-purple-300">Global Rank</div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-6 rounded-xl border border-purple-500/30">
                  <h3 className="text-lg font-bold text-purple-100 mb-4 flex items-center gap-2">
                    <BarChart3 size={20} />
                    Performance
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-purple-300">Tasks Completed</span>
                        <span className="text-white font-bold">{selectedFriend.tasksCompleted}</span>
                      </div>
                      <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${(selectedFriend.tasksCompleted / 25) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-purple-300">Lessons Completed</span>
                        <span className="text-white font-bold">{selectedFriend.lessonsCompleted}</span>
                      </div>
                      <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                          style={{ width: `${(selectedFriend.lessonsCompleted / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-purple-300">Completion Rate</span>
                        <span className="text-white font-bold">{selectedFriend.completionRate}%</span>
                      </div>
                      <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: `${selectedFriend.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-6 rounded-xl border border-purple-500/30">
                  <h3 className="text-lg font-bold text-purple-100 mb-4 flex items-center gap-2">
                    <Clock size={20} />
                    Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-purple-950/30 rounded-lg">
                      <span className="text-purple-300 text-sm">Study Time (Today)</span>
                      <span className="text-white font-bold text-lg">{selectedFriend.studyTime} min</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-950/30 rounded-lg">
                      <span className="text-purple-300 text-sm">Weekly XP</span>
                      <span className="text-yellow-400 font-bold text-lg">{selectedFriend.weeklyXP}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-950/30 rounded-lg">
                      <span className="text-purple-300 text-sm">Current Combo</span>
                      <span className="text-orange-400 font-bold text-lg flex items-center gap-1">
                        <Zap size={18} />
                        {selectedFriend.combo}x
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-950/30 rounded-lg">
                      <span className="text-purple-300 text-sm">Level</span>
                      <span className="text-purple-400 font-bold text-lg">Level {selectedFriend.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-6 rounded-xl border border-purple-500/30 mb-8">
                <h3 className="text-lg font-bold text-purple-100 mb-4 flex items-center gap-2">
                  <Award size={20} />
                  Achievements ({selectedFriend.achievements.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedFriend.achievements.map((achievement, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-gradient-to-br from-purple-800/40 to-pink-800/40 rounded-xl border border-purple-500/30 text-center hover:scale-105 transition-transform cursor-pointer"
                    >
                      <div className="text-3xl mb-2">🏅</div>
                      <div className="text-xs font-bold text-purple-100">{achievement}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-6 rounded-xl border border-purple-500/30 mb-8">
                <h3 className="text-lg font-bold text-purple-100 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[
                    { action: 'Completed React Basics', time: '2 hours ago', icon: '✅', color: '#8b5cf6' },
                    { action: 'Earned Week Warrior badge', time: '1 day ago', icon: '🏆', color: '#a855f7' },
                    { action: 'Reached 5-day streak', time: '2 days ago', icon: '🔥', color: '#f97316' },
                    { action: 'Joined JavaScript Masters', time: '3 days ago', icon: '👥', color: '#c084fc' },
                  ].map((activity, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-4 p-3 bg-purple-950/30 rounded-lg border border-purple-700/20 hover:border-purple-500/40 transition-all"
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ background: activity.color }}
                      >
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-purple-100 font-semibold">{activity.action}</p>
                        <span className="text-xs text-purple-400">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="flex-1 min-w-[200px] px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 text-white">
                  <MessageCircle size={20} />
                  Send Message
                </button>
                <button className="flex-1 min-w-[200px] px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 text-white">
                  <Trophy size={20} />
                  Send Challenge
                </button>
                <button className="px-6 py-4 bg-purple-800/50 border-2 border-purple-500/50 rounded-xl font-bold hover:bg-purple-700/50 transition-all flex items-center justify-center gap-2 text-white">
                  <Share2 size={20} />
                  Share Profile
                </button>
                <button className="px-6 py-4 bg-red-500/20 border-2 border-red-500/50 rounded-xl font-bold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 text-red-400">
                  <X size={20} />
                  Unfriend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setShowPostModal(true)} />

      {/* Add CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}