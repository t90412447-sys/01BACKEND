import { useState } from 'react';

// CONSTANTS
const PROGRESS_LIMITS = {
  MAX_XP: 200,
  MAX_TASKS: 20,
  MAX_LESSONS: 10,
  COMBO_THRESHOLD: 2,
  MIN_STREAK_FOR_FIRE: 3,
};

const LEAGUES = {
  BRONZE: { name: 'Bronze', color: '#cd7f32', min: 0 },
  SILVER: { name: 'Silver', color: '#c0c0c0', min: 500 },
  GOLD: { name: 'Gold', color: '#ffd700', min: 1000 },
  PLATINUM: { name: 'Platinum', color: '#e5e4e2', min: 2000 },
  DIAMOND: { name: 'Diamond', color: '#b9f2ff', min: 5000 },
};

// MOCK DATA
const mockFriends = [
  {
    id: 1,
    name: 'Alice',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: '🎯 Crushing my goals today!',
    bio: 'Learning enthusiast | Coffee addict ☕',
    streak: 5,
    XP: 120,
    tasksCompleted: 15,
    lessonsCompleted: 4,
    level: 3,
    rank: 12,
    league: 'GOLD',
    coins: 450,
    achievements: ['Week Warrior', 'Speed Learner', 'Early Bird'],
    isOnline: true,
    lastActive: 'Active now',
    combo: 3,
    weeklyXP: 890,
    totalXP: 12500,
    crowns: 12,
    mutualFriends: 8,
  },
  {
    id: 2,
    name: 'Bob',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: '📚 Deep in learning mode',
    bio: 'Night owl 🦉 | Coding ninja',
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
    lastActive: '2 hours ago',
    combo: 1,
    weeklyXP: 430,
    totalXP: 8900,
    crowns: 5,
    mutualFriends: 5,
  },
  {
    id: 3,
    name: 'Charlie',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: '🔥 On an unstoppable streak!',
    bio: 'Streak master | Early riser 🌅',
    streak: 7,
    XP: 150,
    tasksCompleted: 20,
    lessonsCompleted: 10,
    level: 4,
    rank: 5,
    league: 'GOLD',
    coins: 680,
    achievements: ['Streak Master', '100 Tasks Club', 'Legend'],
    isOnline: true,
    lastActive: 'Active now',
    combo: 7,
    weeklyXP: 1120,
    totalXP: 18900,
    crowns: 28,
    mutualFriends: 12,
  },
];

const mockLearningGroups = [
  {
    id: 1,
    name: 'JavaScript Masters',
    description: 'Learn JS together, one challenge at a time!',
    members: 234,
    icon: '💻',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    category: 'Programming',
    posts: [
      {
        id: 1,
        user: mockFriends[0],
        content: 'Just completed my first React app! 🎉',
        timestamp: '2 hours ago',
        reactions: { fire: 12, clap: 8, heart: 15 },
        comments: 5,
      },
      {
        id: 2,
        user: mockFriends[2],
        content: 'Hit 100 day streak learning JavaScript!',
        timestamp: '5 hours ago',
        reactions: { fire: 25, clap: 18, heart: 20 },
        comments: 12,
      },
    ],
  },
  {
    id: 2,
    name: 'Spanish Amigos',
    description: 'Practice español with native speakers!',
    members: 567,
    icon: '🇪🇸',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    category: 'Languages',
    posts: [
      {
        id: 3,
        user: mockFriends[1],
        content: '¡Hola! Finally understood the subjunctive mood 📚',
        timestamp: '1 hour ago',
        reactions: { fire: 8, clap: 6, heart: 10 },
        comments: 3,
      },
    ],
  },
  {
    id: 3,
    name: 'Math Wizards',
    description: 'Solving problems, building confidence!',
    members: 189,
    icon: '🔢',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
  },
];

// MAIN APP
export default function CommunityHub() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [learningGroups, setLearningGroups] = useState(mockLearningGroups);

  const filteredFriends = mockFriends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleCreatePost = () => {
    if (!newPost.trim() || !selectedGroup) return;
    
    const newPostObj = {
      id: Date.now(),
      user: mockFriends[0],
      content: newPost,
      timestamp: 'Just now',
      reactions: { fire: 0, clap: 0, heart: 0 },
      comments: 0,
    };

    setLearningGroups(prev => prev.map(group => {
      if (group.id === selectedGroup) {
        return {
          ...group,
          posts: [newPostObj, ...group.posts],
        };
      }
      return group;
    }));

    setNewPost('');
    setShowPostModal(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #f8f7ff 0%, #fff 50%, #faf8ff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <h1 style={{ 
            color: '#fff', 
            fontSize: 'clamp(24px, 5vw, 36px)', 
            fontWeight: 900,
            margin: 0,
          }}>
            🎓 Learning Hub
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              transition: 'all 0.3s ease',
            }}
            onClick={() => setShowNotifications(!showNotifications)}>
              🔔
            </button>
            <button style={{
              background: '#58cc02',
              border: 'none',
              borderRadius: '24px',
              padding: '12px 24px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(88, 204, 2, 0.4)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
              ⚡ Premium
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '32px' }}>
          <input
            type="text"
            placeholder="🔍 Search friends or groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 24px',
              fontSize: '16px',
              border: '4px solid #e0d7ff',
              borderRadius: '32px',
              background: '#fff',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 6px 24px rgba(102, 126, 234, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0d7ff';
              e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }}
          />
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '32px',
          overflowX: 'auto',
          padding: '4px',
        }}>
          {['👥 Friends', '🎯 Challenges', '🏆 Leaderboard', '👨‍👩‍👧‍👦 Groups'].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTab(idx)}
              style={{
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: 700,
                border: 'none',
                borderRadius: '24px',
                background: selectedTab === idx 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#fff',
                color: selectedTab === idx ? '#fff' : '#667eea',
                cursor: 'pointer',
                boxShadow: selectedTab === idx 
                  ? '0 6px 20px rgba(102, 126, 234, 0.4)'
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                border: selectedTab === idx ? 'none' : '3px solid #e0d7ff',
              }}
              onMouseOver={(e) => {
                if (selectedTab !== idx) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedTab !== idx) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Friends Tab */}
        {selectedTab === 0 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '24px',
          }}>
            {filteredFriends.map(friend => (
              <div
                key={friend.id}
                style={{
                  background: '#fff',
                  borderRadius: '32px',
                  padding: '24px',
                  border: `5px solid ${LEAGUES[friend.league].color}`,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                }}
              >
                {friend.isOnline && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#58cc02',
                    border: '3px solid #fff',
                    animation: 'pulse 2s infinite',
                  }} />
                )}

                {friend.combo >= PROGRESS_LIMITS.COMBO_THRESHOLD && (
                  <div style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 800,
                    fontSize: '14px',
                    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
                  }}>
                    🔥 {friend.combo}x COMBO!
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: `5px solid ${LEAGUES[friend.league].color}`,
                        boxShadow: `0 4px 16px ${LEAGUES[friend.league].color}50`,
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '-8px',
                      right: '-8px',
                      background: LEAGUES[friend.league].color,
                      color: '#000',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '16px',
                      border: '4px solid #fff',
                    }}>
                      {friend.level}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '20px', 
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {friend.name}
                    </h3>
                    <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                      {friend.status}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}>
                        🔥 {friend.streak}
                      </span>
                      <span style={{
                        background: LEAGUES[friend.league].color,
                        color: '#000',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}>
                        #{friend.rank}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px',
                  marginBottom: '20px',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {friend.XP}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>XP</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #58cc02 0%, #7cdd3e 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {friend.tasksCompleted}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Tasks</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #1cb0f6 0%, #4dd0ff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {friend.lessonsCompleted}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Lessons</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #58cc02 0%, #7cdd3e 100%)',
                    border: 'none',
                    borderRadius: '24px',
                    padding: '12px',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(88, 204, 2, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                    💬 Message
                  </button>
                  <button style={{
                    flex: 1,
                    background: '#fff',
                    border: '3px solid #ffd700',
                    borderRadius: '24px',
                    padding: '12px',
                    color: '#ffd700',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#ffd700';
                    e.target.style.color = '#000';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.color = '#ffd700';
                  }}>
                    🏆 Challenge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Challenges Tab */}
        {selectedTab === 1 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
            gap: '24px',
          }}>
            {mockChallenges.map(challenge => {
              const progress = (challenge.progress / challenge.target) * 100;
              const isComplete = challenge.progress >= challenge.target;
              const difficultyColors = {
                EASY: '#58cc02',
                MEDIUM: '#ff9800',
                HARD: '#ff4b4b',
              };

              return (
                <div
                  key={challenge.id}
                  style={{
                    background: '#fff',
                    borderRadius: '32px',
                    padding: '28px',
                    border: isComplete ? '5px solid #58cc02' : '5px solid #e0d7ff',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '48px' }}>{challenge.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: '20px', 
                          fontWeight: 900,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                          {challenge.title}
                        </h3>
                        <span style={{
                          background: challenge.type === 'DAILY' 
                            ? 'linear-gradient(135deg, #1cb0f6 0%, #4dd0ff 100%)'
                            : 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                          color: '#fff',
                          padding: '6px 14px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: 800,
                        }}>
                          {challenge.type}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>
                        {challenge.description}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                          color: '#000',
                          padding: '6px 14px',
                          borderRadius: '16px',
                          fontSize: '13px',
                          fontWeight: 800,
                        }}>
                          ⚡ {challenge.reward} {challenge.rewardType}
                        </span>
                        <span style={{
                          background: `${difficultyColors[challenge.difficulty]}30`,
                          color: difficultyColors[challenge.difficulty],
                          padding: '6px 14px',
                          borderRadius: '16px',
                          fontSize: '13px',
                          fontWeight: 800,
                        }}>
                          {challenge.difficulty}
                        </span>
                        <span style={{
                          background: '#ffebee',
                          color: '#ff4b4b',
                          padding: '6px 14px',
                          borderRadius: '16px',
                          fontSize: '13px',
                          fontWeight: 800,
                        }}>
                          ⏰ {challenge.timeLeft}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#888', fontWeight: 600 }}>Progress</span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#667eea' }}>
                        {challenge.progress}/{challenge.target}
                      </span>
                    </div>
                    <div style={{
                      height: '16px',
                      borderRadius: '16px',
                      background: '#e0d7ff',
                      overflow: 'hidden',
                      position: 'relative',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: isComplete 
                          ? 'linear-gradient(90deg, #58cc02 0%, #7cdd3e 100%)'
                          : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        transition: 'width 0.5s ease',
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Leaderboard Tab */}
        {selectedTab === 2 && (
          <div>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 900,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              🏆 Weekly Leaderboard
            </h2>

            {[...mockFriends].sort((a, b) => b.weeklyXP - a.weeklyXP).map((friend, index) => {
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;
              const isTopThree = index < 3;

              return (
                <div
                  key={friend.id}
                  style={{
                    background: isTopThree 
                      ? 'linear-gradient(135deg, #fff9e6 0%, #fff 100%)'
                      : '#fff',
                    borderRadius: '28px',
                    padding: '24px',
                    border: isTopThree 
                      ? `5px solid ${LEAGUES[friend.league].color}`
                      : '4px solid #e0d7ff',
                    boxShadow: isTopThree
                      ? '0 8px 32px rgba(255, 215, 0, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.08)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.boxShadow = isTopThree
                      ? '0 12px 40px rgba(255, 215, 0, 0.4)'
                      : '0 8px 24px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = isTopThree
                      ? '0 8px 32px rgba(255, 215, 0, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={{ 
                    fontSize: '36px', 
                    fontWeight: 900,
                    minWidth: '60px',
                    textAlign: 'center',
                    color: isTopThree ? '#ffd700' : '#888',
                  }}>
                    {medal || `#${index + 1}`}
                  </div>
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      border: `4px solid ${LEAGUES[friend.league].color}`,
                      boxShadow: `0 4px 12px ${LEAGUES[friend.league].color}50`,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '20px', 
                      fontWeight: 900,
                      color: '#1a1a1a',
                    }}>
                      {friend.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        background: LEAGUES[friend.league].color,
                        color: '#000',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 800,
                      }}>
                        {friend.league}
                      </span>
                      <span style={{
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 800,
                      }}>
                        🔥 {friend.streak} days
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #58cc02 0%, #7cdd3e 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {friend.weeklyXP}
                    </div>
                    <div style={{ fontSize: '13px', color: '#888', fontWeight: 600 }}>
                      XP this week
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Learning Groups Tab */}
        {selectedTab === 3 && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <h2 style={{ 
                fontSize: '32px', 
                fontWeight: 900,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
              }}>
                👨‍👩‍👧‍👦 Learning Groups
              </h2>
              <button
                onClick={() => {
                  setSelectedGroup(null);
                  setShowPostModal(false);
                }}
                style={{
                  background: 'linear-gradient(135deg, #58cc02 0%, #7cdd3e 100%)',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '14px 28px',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(88, 204, 2, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                ➕ Create Group
              </button>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
              gap: '24px',
            }}>
              {learningGroups.map(group => (
                <div
                  key={group.id}
                  style={{
                    background: '#fff',
                    borderRadius: '32px',
                    padding: '24px',
                    border: '5px solid #e0d7ff',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedGroup(group.id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: group.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    marginBottom: '16px',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                  }}>
                    {group.icon}
                  </div>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '22px', 
                    fontWeight: 900,
                    color: '#1a1a1a',
                  }}>
                    {group.name}
                  </h3>
                  <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}>
                    {group.description}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '16px',
                      fontSize: '13px',
                      fontWeight: 800,
                    }}>
                      👥 {group.members} members
                    </span>
                    <span style={{
                      background: '#e0d7ff',
                      color: '#667eea',
                      padding: '6px 14px',
                      borderRadius: '16px',
                      fontSize: '13px',
                      fontWeight: 800,
                    }}>
                      {group.category}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGroup(group.id);
                    }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '12px',
                      color: '#fff',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    View Group
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Group Detail Modal */}
      {selectedGroup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}
        onClick={() => setSelectedGroup(null)}>
          <div style={{
            background: '#fff',
            borderRadius: '32px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '32px',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedGroup(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e0d7ff';
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#f5f5f5';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              ✕
            </button>

            {learningGroups.find(g => g.id === selectedGroup) && (
              <>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: learningGroups.find(g => g.id === selectedGroup).color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  marginBottom: '20px',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                }}>
                  {learningGroups.find(g => g.id === selectedGroup).icon}
                </div>

                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: 900,
                  margin: '0 0 12px 0',
                  color: '#1a1a1a',
                }}>
                  {learningGroups.find(g => g.id === selectedGroup).name}
                </h2>

                <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
                  {learningGroups.find(g => g.id === selectedGroup).description}
                </p>

                <button
                  onClick={() => setShowPostModal(true)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #58cc02 0%, #7cdd3e 100%)',
                    border: 'none',
                    borderRadius: '24px',
                    padding: '16px',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginBottom: '32px',
                    boxShadow: '0 4px 16px rgba(88, 204, 2, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  📝 Share Your Achievement
                </button>

                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 800,
                  marginBottom: '20px',
                  color: '#1a1a1a',
                }}>
                  Recent Posts
                </h3>

                {learningGroups.find(g => g.id === selectedGroup).posts.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#888',
                  }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
                    <p style={{ fontSize: '18px', fontWeight: 600 }}>
                      No posts yet. Be the first to share!
                    </p>
                  </div>
                ) : (
                  learningGroups.find(g => g.id === selectedGroup).posts.map(post => (
                    <div
                      key={post.id}
                      style={{
                        background: '#f8f7ff',
                        borderRadius: '24px',
                        padding: '20px',
                        marginBottom: '16px',
                        border: '3px solid #e0d7ff',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <img
                          src={post.user.avatar}
                          alt={post.user.name}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            border: `3px solid ${LEAGUES[post.user.league].color}`,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: 800, 
                            fontSize: '16px',
                            color: '#1a1a1a',
                            marginBottom: '4px',
                          }}>
                            {post.user.name}
                          </div>
                          <div style={{ fontSize: '13px', color: '#888' }}>
                            {post.timestamp}
                          </div>
                        </div>
                      </div>

                      <p style={{ 
                        fontSize: '16px', 
                        color: '#333',
                        marginBottom: '16px',
                        lineHeight: '1.5',
                      }}>
                        {post.content}
                      </p>

                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleReaction(selectedGroup, post.id, 'fire')}
                          style={{
                            background: '#fff',
                            border: '3px solid #ff6b6b',
                            borderRadius: '20px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#ff6b6b';
                            e.target.style.color = '#fff';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = '#fff';
                            e.target.style.color = '#000';
                          }}
                        >
                          🔥 {post.reactions.fire}
                        </button>
                        <button
                          onClick={() => handleReaction(selectedGroup, post.id, 'clap')}
                          style={{
                            background: '#fff',
                            border: '3px solid #ffd700',
                            borderRadius: '20px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#ffd700';
                            e.target.style.color = '#000';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = '#fff';
                            e.target.style.color = '#000';
                          }}
                        >
                          👏 {post.reactions.clap}
                        </button>
                        <button
                          onClick={() => handleReaction(selectedGroup, post.id, 'heart')}
                          style={{
                            background: '#fff',
                            border: '3px solid #ff4b4b',
                            borderRadius: '20px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#ff4b4b';
                            e.target.style.color = '#fff';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = '#fff';
                            e.target.style.color = '#000';
                          }}
                        >
                          ❤️ {post.reactions.heart}
                        </button>
                        <button
                          style={{
                            background: '#fff',
                            border: '3px solid #667eea',
                            borderRadius: '20px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#667eea';
                            e.target.style.color = '#fff';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = '#fff';
                            e.target.style.color = '#000';
                          }}
                        >
                          💬 {post.comments}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showPostModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '20px',
        }}
        onClick={() => setShowPostModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '32px',
            maxWidth: '600px',
            width: '100%',
            padding: '32px',
          }}
          onClick={(e) => e.stopPropagation()}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 900,
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Share Your Achievement 🎉
            </h2>

            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What did you accomplish today?"
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '16px',
                fontSize: '16px',
                border: '4px solid #e0d7ff',
                borderRadius: '20px',
                marginBottom: '20px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0d7ff'}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCreatePost}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #58cc02 0%, #7cdd3e 100%)',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '16px',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(88, 204, 2, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                📤 Post
              </button>
              <button
                onClick={() => setShowPostModal(false)}
                style={{
                  flex: 1,
                  background: '#f5f5f5',
                  border: '3px solid #e0d7ff',
                  borderRadius: '24px',
                  padding: '16px',
                  color: '#667eea',
                  fontWeight: 800,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.target.style.background = '#e0d7ff'}
                onMouseOut={(e) => e.target.style.background = '#f5f5f5'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}