import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Award,
  Target,
  Zap,
  Star,
  MessageCircle,
  Users,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Trophy,
  Flame,
  Calendar,
  BarChart3,
  Activity,
  ArrowUpRight,
} from "lucide-react";

// ============================================================================
// MOCK DATA
// ============================================================================
const MOCK_CURRENT_TRAITS = [
  { trait: "Conversation", current: 45, future: 85, icon: MessageCircle, color: "#a855f7" },
  { trait: "Listening", current: 60, future: 90, icon: Heart, color: "#c084fc" },
  { trait: "Confidence", current: 35, future: 80, icon: Zap, color: "#d946ef" },
  { trait: "Networking", current: 40, future: 75, icon: Users, color: "#9333ea" },
  { trait: "Empathy", current: 70, future: 95, icon: Sparkles, color: "#e879f9" },
];

const MOCK_SKILLS = [
  {
    name: "Conversation Initiation",
    level: 45,
    xp: 2250,
    maxXp: 5000,
    color: "#a855f7",
    trend: [30, 32, 35, 38, 40, 45],
  },
  {
    name: "Listening & Empathy",
    level: 70,
    xp: 3500,
    maxXp: 5000,
    color: "#c084fc",
    trend: [55, 58, 62, 65, 68, 70],
  },
  {
    name: "Confidence & Assertiveness",
    level: 35,
    xp: 1750,
    maxXp: 5000,
    color: "#d946ef",
    trend: [20, 23, 26, 29, 32, 35],
  },
  {
    name: "Networking",
    level: 40,
    xp: 2000,
    maxXp: 5000,
    color: "#9333ea",
    trend: [25, 28, 32, 35, 38, 40],
  },
];

const MOCK_ACTIONS = [
  {
    id: 1,
    action: "Complimented a friend",
    skill: "Empathy",
    date: "2025-09-28",
    xp: 50,
    difficulty: "Easy",
  },
  {
    id: 2,
    action: "Started conversation with stranger",
    skill: "Conversation",
    date: "2025-09-27",
    xp: 100,
    difficulty: "Hard",
  },
  {
    id: 3,
    action: "Active listening in group",
    skill: "Listening",
    date: "2025-09-26",
    xp: 75,
    difficulty: "Medium",
  },
  {
    id: 4,
    action: "Shared personal story",
    skill: "Confidence",
    date: "2025-09-25",
    xp: 80,
    difficulty: "Medium",
  },
  {
    id: 5,
    action: "Connected two friends",
    skill: "Networking",
    date: "2025-09-24",
    xp: 90,
    difficulty: "Hard",
  },
  {
    id: 6,
    action: "Gave constructive feedback",
    skill: "Confidence",
    date: "2025-09-23",
    xp: 70,
    difficulty: "Medium",
  },
];

const MOCK_FREQUENCY_DATA = [
  { action: "Compliments", count: 12 },
  { action: "Conversations", count: 8 },
  { action: "Listening", count: 15 },
  { action: "Networking", count: 5 },
  { action: "Confidence", count: 7 },
];

const ARCHETYPES = {
  observer: {
    name: "Observer",
    icon: "👁️",
    color: "#a855f7",
    traits: ["Thoughtful", "Analytical", "Cautious"],
  },
  connector: {
    name: "Connector",
    icon: "🤝",
    color: "#c084fc",
    traits: ["Social", "Engaging", "Empathetic"],
  },
  supporter: {
    name: "Supporter",
    icon: "💚",
    color: "#9333ea",
    traits: ["Caring", "Loyal", "Encouraging"],
  },
  influencer: {
    name: "Influencer",
    icon: "⭐",
    color: "#d946ef",
    traits: ["Charismatic", "Confident", "Inspiring"],
  },
};

const MILESTONES = [
  { id: 1, name: "First Compliment", completed: true, date: "Sept 1" },
  { id: 2, name: "Group Activity", completed: true, date: "Sept 10" },
  { id: 3, name: "5 Conversations", completed: true, date: "Sept 15" },
  { id: 4, name: "Networking Event", completed: false, date: "Upcoming" },
  { id: 5, name: "Public Speaking", completed: false, date: "Upcoming" },
];

const CHALLENGES = [
  {
    title: "Start 3 conversations with strangers",
    xp: 300,
    streak: 2,
    badge: "🗣️",
  },
  { title: "Give 5 genuine compliments", xp: 150, streak: 1, badge: "💬" },
  {
    title: "Attend a networking event",
    xp: 500,
    streak: 0,
    badge: "🎯",
  },
  {
    title: "Practice active listening for 1 week",
    xp: 400,
    streak: 3,
    badge: "👂",
  },
];

const TIMELINE_EVENTS = [
  {
    id: 1,
    stage: "Starting Out",
    description: "You began by complimenting friends",
    icon: "💬",
    color: "#a855f7",
  },
  {
    id: 2,
    stage: "Building Confidence",
    description: "Joined a group activity and met new people",
    icon: "🎉",
    color: "#c084fc",
  },
  {
    id: 3,
    stage: "Taking Initiative",
    description: "Now confident initiating conversations",
    icon: "🚀",
    color: "#d946ef",
  },
  {
    id: 4,
    stage: "Next Level",
    description: "Ready for networking events and challenges",
    icon: "⭐",
    color: "#e879f9",
  },
];

// ============================================================================
// PARTICLE BACKGROUND
// ============================================================================
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
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
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
    </>
  );
};

// ============================================================================
// CIRCULAR PROGRESS COMPONENT
// ============================================================================
const CircularProgress = ({ value, color, size = 112, strokeWidth = 8, children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.5s ease-out'
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// STYLED COMPONENTS
// ============================================================================
const GlassCard = ({ children }) => (
  <div style={{
    background: 'rgba(139, 92, 246, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '2rem',
    padding: '2rem',
    boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3)',
    transition: 'all 0.3s ease',
  }}>
    {children}
  </div>
);

const BubbleProgress = ({ trait }) => {
  const Icon = trait.icon;
  const growth = trait.future - trait.current;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ position: 'relative' }}>
        <CircularProgress value={trait.current} color={trait.color} size={112} strokeWidth={8}>
          <Icon style={{ width: 32, height: 32, color: trait.color }} />
        </CircularProgress>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>{trait.trait}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: trait.color, margin: '0.25rem 0' }}>
          {trait.current}%
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
          <ArrowUpRight style={{ width: 16, height: 16, color: '#a855f7' }} />
          <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: '600' }}>+{growth}%</span>
        </div>
      </div>
    </div>
  );
};

const FutureBubbleProgress = ({ trait }) => {
  const Icon = trait.icon;
  const growth = trait.future - trait.current;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ position: 'relative' }}>
        <CircularProgress value={trait.future} color={trait.color} size={112} strokeWidth={8}>
          <Icon style={{ width: 32, height: 32, color: trait.color }} />
        </CircularProgress>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>{trait.trait}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: trait.color, margin: '0.25rem 0' }}>
          {trait.future}%
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
          <Sparkles style={{ width: 16, height: 16, color: '#d946ef' }} />
          <span style={{ fontSize: '0.75rem', color: '#d946ef', fontWeight: '600' }}>+{growth}%</span>
        </div>
      </div>
    </div>
  );
};

const SkillBubbleBar = ({ skill }) => {
  const percentage = (skill.xp / skill.maxXp) * 100;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#fff' }}>{skill.name}</span>
        <span style={{ fontSize: '0.75rem', color: '#c084fc' }}>
          {skill.xp} / {skill.maxXp} XP
        </span>
      </div>
      <div style={{ position: 'relative', height: '1.25rem', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`,
            boxShadow: `0 0 15px ${skill.color}`,
            borderRadius: '9999px',
            transition: 'width 1.5s ease-out',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ color: skill.color, fontWeight: 'bold' }}>
          Level {skill.level}
        </span>
        <span style={{ color: '#c084fc', fontWeight: '600' }}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

const MiniTrendChart = ({ data, color }) => {
  const chartData = data.map((value, index) => ({
    name: index,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          fill={`url(#gradient-${color})`}
          animationDuration={1200}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const Confetti = () => {
  const particles = Array.from({ length: 40 });
  return (
    <>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg) scale(0); }
          100% { transform: translateY(100vh) rotate(720deg) scale(1); }
        }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
        {particles.map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: ['#a855f7', '#c084fc', '#d946ef', '#9333ea', '#e879f9'][Math.floor(Math.random() * 5)],
              left: `${Math.random() * 100}%`,
              animation: `fall ${Math.random() * 2 + 2}s linear ${Math.random() * 0.5}s forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
};

const StatBubble = ({ icon: Icon, value, label, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(139, 92, 246, 0.2)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1.5rem',
        padding: '1rem',
        border: '2px solid rgba(168, 85, 247, 0.4)',
        minWidth: '100px',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `${color}20`,
          border: `2px solid ${color}`,
        }}
      >
        <Icon style={{ width: 24, height: 24, color }} />
      </div>
      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color }}>
        {value}
      </span>
      <span style={{ fontSize: '0.75rem', color: '#c084fc', textAlign: 'center' }}>{label}</span>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ProfileView() {
  const [currentArchetype, setCurrentArchetype] = useState("observer");
  const [futureArchetype] = useState("connector");
  const [reflectionMood, setReflectionMood] = useState(null);
  const [reflectionText, setReflectionText] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const totalXp = MOCK_SKILLS.reduce((sum, skill) => sum + skill.xp, 0);
  const currentStreak = 12;
  const totalActions = MOCK_ACTIONS.length;

  const handleChallengeComplete = (index) => {
    if (!completedChallenges.includes(index)) {
      setCompletedChallenges([...completedChallenges, index]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #581c87, #6b21a8, #4c1d95)', color: '#fff', overflowX: 'hidden', paddingBottom: '2rem', position: 'relative' }}>
      <ParticleBackground />
      {showConfetti && <Confetti />}

      {/* Header */}
      <header style={{
        borderBottom: '2px solid rgba(168, 85, 247, 0.3)',
        background: 'rgba(88, 28, 135, 0.6)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        borderRadius: '0 0 1.5rem 1.5rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', padding: '0.5rem 1rem', background: 'rgba(107, 33, 168, 0.4)', backdropFilter: 'blur(4px)', borderRadius: '9999px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <Sparkles style={{ width: 16, height: 16, color: '#c084fc' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#e9d5ff' }}>Social Skills Mastery Platform</span>
            </div>
            
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #e9d5ff, #f0abfc, #e9d5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              marginBottom: '0.5rem',
            }}>
              Social Growth Journey
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#c084fc', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
              Track your transformation and unlock your potential
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <StatBubble icon={Flame} value={currentStreak} label="Streak" color="#d946ef" />
            <StatBubble icon={Zap} value={totalXp.toLocaleString()} label="XP" color="#a855f7" />
            <StatBubble icon={Trophy} value={totalActions} label="Actions" color="#c084fc" />
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 10 }}>
        {/* SECTION 1: CURRENT VS FUTURE SELF */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Current Self */}
          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Users style={{ width: 24, height: 24 }} />
                    Current Self
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                    Where you are today
                  </p>
                </div>
                <div style={{ fontSize: '3rem' }}>
                  {ARCHETYPES[currentArchetype].icon}
                </div>
              </div>

              <div style={{ background: 'rgba(168, 85, 247, 0.15)', borderRadius: '1.5rem', padding: '1rem', border: '2px solid rgba(168, 85, 247, 0.4)' }}>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: '#e9d5ff' }}>
                  <strong style={{ color: '#c084fc' }}>Personality:</strong>{" "}
                  You're consistent but shy in new groups. You prefer one-on-one conversations and excel at listening.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {ARCHETYPES[currentArchetype].traits.map((trait) => (
                    <span
                      key={trait}
                      style={{
                        padding: '0.375rem 0.75rem',
                        background: 'rgba(168, 85, 247, 0.3)',
                        color: '#e9d5ff',
                        fontSize: '0.75rem',
                        borderRadius: '9999px',
                        border: '2px solid rgba(168, 85, 247, 0.5)',
                        fontWeight: '600',
                      }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem 0', color: '#e9d5ff' }}>
                  <TrendingUp style={{ width: 20, height: 20, color: '#c084fc' }} />
                  Your Skills Today
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1.5rem' }}>
                  {MOCK_CURRENT_TRAITS.map((trait, idx) => (
                    <BubbleProgress key={idx} trait={trait} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ background: 'rgba(192, 132, 252, 0.15)', borderRadius: '1rem', padding: '1rem', border: '2px solid rgba(192, 132, 252, 0.4)' }}>
                  <Award style={{ width: 24, height: 24, color: '#c084fc', marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: '#e9d5ff', margin: 0 }}>Strongest</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#c084fc', marginTop: '0.25rem', margin: '0.25rem 0' }}>
                    Listening
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#c084fc', margin: 0 }}>70%</p>
                </div>
                <div style={{ background: 'rgba(217, 70, 239, 0.15)', borderRadius: '1rem', padding: '1rem', border: '2px solid rgba(217, 70, 239, 0.4)' }}>
                  <Target style={{ width: 24, height: 24, color: '#d946ef', marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: '#e9d5ff', margin: 0 }}>Focus Area</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#d946ef', marginTop: '0.25rem', margin: '0.25rem 0' }}>
                    Confidence
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#d946ef', margin: 0 }}>35%</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Future Self */}
          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e879f9', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Sparkles style={{ width: 24, height: 24 }} />
                    Future Self
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                    Your transformation
                  </p>
                </div>
                <div style={{ fontSize: '3rem' }}>
                  {ARCHETYPES[futureArchetype].icon}
                </div>
              </div>

              <div style={{ background: 'rgba(232, 121, 249, 0.15)', borderRadius: '1.5rem', padding: '1rem', border: '2px solid rgba(232, 121, 249, 0.4)' }}>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: '#e9d5ff' }}>
                  <strong style={{ color: '#e879f9' }}>Projection:</strong> Based on your streak and XP, you're becoming a natural connector. You'll confidently start conversations and build meaningful relationships.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {ARCHETYPES[futureArchetype].traits.map((trait) => (
                    <span
                      key={trait}
                      style={{
                        padding: '0.375rem 0.75rem',
                        background: 'rgba(232, 121, 249, 0.3)',
                        color: '#fae8ff',
                        fontSize: '0.75rem',
                        borderRadius: '9999px',
                        border: '2px solid rgba(232, 121, 249, 0.5)',
                        fontWeight: '600',
                      }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem 0', color: '#e9d5ff' }}>
                  <ArrowRight style={{ width: 20, height: 20, color: '#e879f9' }} />
                  Projected Growth
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1.5rem' }}>
                  {MOCK_CURRENT_TRAITS.map((trait, idx) => (
                    <FutureBubbleProgress key={idx} trait={trait} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#e9d5ff', margin: 0 }}>
                  Suggested New Habits
                </p>
                {[
                  "Start 1 conversation daily with someone new",
                  "Practice assertiveness in groups",
                  "Join a social hobby or club",
                ].map((habit, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      background: 'rgba(232, 121, 249, 0.15)',
                      padding: '0.75rem',
                      borderRadius: '1rem',
                      border: '2px solid rgba(232, 121, 249, 0.4)',
                      color: '#e9d5ff',
                    }}
                  >
                    <CheckCircle style={{ width: 16, height: 16, color: '#e879f9', marginTop: '0.125rem', flexShrink: 0 }} />
                    <span>{habit}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* SECTION 2: SOCIAL TRAIT PROGRESSION */}
        <section>
          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d946ef', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Activity style={{ width: 24, height: 24 }} />
                  Skill Progression
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                  Track your XP and levels
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {MOCK_SKILLS.map((skill, idx) => (
                  <div
                    key={skill.name}
                    style={{
                      background: 'rgba(139, 92, 246, 0.15)',
                      borderRadius: '1.5rem',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      border: '2px solid rgba(168, 85, 247, 0.3)',
                      transition: 'border-color 0.3s, transform 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.6)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <SkillBubbleBar skill={skill} />
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#c084fc', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                        Weekly Progress
                      </p>
                      <MiniTrendChart data={skill.trend} color={skill.color} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* SECTION 3: GROWTH TRAJECTORY */}
        <section>
          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <TrendingUp style={{ width: 24, height: 24 }} />
                  Growth Milestones
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                  From Beginner to Advanced
                </p>
              </div>

              <div style={{ position: 'relative', padding: '1.5rem 0' }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '8px',
                  background: 'linear-gradient(90deg, #a855f7, #c084fc, #d946ef)',
                  borderRadius: '9999px',
                  transform: 'translateY(-50%)',
                }} />
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  {MILESTONES.map((milestone) => (
                    <div
                      key={milestone.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        zIndex: 10,
                        flex: '1 1 auto',
                        minWidth: '120px',
                      }}
                    >
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '4px solid',
                          borderColor: milestone.completed ? '#c084fc' : 'rgba(168, 85, 247, 0.3)',
                          background: milestone.completed ? '#c084fc' : 'rgba(139, 92, 246, 0.2)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          boxShadow: milestone.completed ? '0 0 20px rgba(192, 132, 252, 0.5)' : 'none',
                        }}
                      >
                        {milestone.completed ? (
                          <CheckCircle style={{ width: 32, height: 32, color: '#581c87' }} />
                        ) : (
                          <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(192, 132, 252, 0.5)' }} />
                        )}
                      </div>
                      <div style={{
                        textAlign: 'center',
                        background: 'rgba(139, 92, 246, 0.2)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '1rem',
                        border: '2px solid rgba(168, 85, 247, 0.3)',
                        minWidth: '100px',
                      }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 'bold', margin: 0, color: '#e9d5ff' }}>
                          {milestone.name}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: '#c084fc', margin: 0 }}>
                          {milestone.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', background: 'rgba(168, 85, 247, 0.15)', padding: '1.5rem', borderRadius: '1.5rem', border: '2px solid rgba(168, 85, 247, 0.4)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌱</div>
                  <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#c084fc', margin: 0 }}>Beginner</p>
                  <p style={{ fontSize: '0.75rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>0-2000 XP</p>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(192, 132, 252, 0.2)', padding: '1.5rem', borderRadius: '1.5rem', border: '2px solid rgba(192, 132, 252, 0.5)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚀</div>
                  <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#e879f9', margin: 0 }}>Intermediate</p>
                  <p style={{ fontSize: '0.75rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                    2000-5000 XP
                  </p>
                  <div style={{ marginTop: '0.5rem', padding: '0.375rem 0.75rem', background: 'rgba(232, 121, 249, 0.3)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', color: '#fae8ff' }}>
                    YOU ARE HERE
                  </div>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(139, 92, 246, 0.15)', padding: '1.5rem', borderRadius: '1.5rem', border: '2px solid rgba(168, 85, 247, 0.3)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏆</div>
                  <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#e9d5ff', margin: 0 }}>Advanced</p>
                  <p style={{ fontSize: '0.75rem', color: '#c084fc', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>5000+ XP</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* SECTION 4: ACTION ANALYSIS */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <BarChart3 style={{ width: 20, height: 20 }} />
                  Action Frequency
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                  Most impactful this month
                </p>
              </div>

              <div style={{ height: '256px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_FREQUENCY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.2)" />
                    <XAxis
                      dataKey="action"
                      tick={{ fill: '#c084fc', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fill: '#c084fc', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(88, 28, 135, 0.9)',
                        border: '2px solid rgba(168, 85, 247, 0.5)',
                        borderRadius: '1rem',
                        fontSize: '12px',
                        color: '#e9d5ff',
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#a855f7"
                      radius={[15, 15, 0, 0]}
                      animationDuration={1200}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '1rem', borderRadius: '1rem', border: '2px solid rgba(168, 85, 247, 0.4)' }}>
                <p style={{ fontSize: '0.875rem', margin: 0, color: '#e9d5ff' }}>
                  <strong style={{ color: '#c084fc' }}>Insight:</strong> You complimented friends{" "}
                  <span style={{ color: '#e879f9', fontWeight: 'bold' }}>12 times</span> this month - incredible empathy!
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Calendar style={{ width: 20, height: 20 }} />
                  Recent Actions
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                  Latest social wins
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {MOCK_ACTIONS.map((action) => (
                  <div
                    key={action.id}
                    style={{
                      background: 'rgba(139, 92, 246, 0.15)',
                      padding: '0.75rem',
                      borderRadius: '1rem',
                      border: '2px solid rgba(168, 85, 247, 0.3)',
                      transition: 'border-color 0.3s, transform 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.6)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0, color: '#e9d5ff' }}>
                          {action.action}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', color: '#c084fc' }}>
                            {action.date}
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', background: 'rgba(168, 85, 247, 0.3)', color: '#e879f9', borderRadius: '9999px' }}>
                            {action.skill}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Zap style={{ width: 12, height: 12, color: '#a855f7' }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#a855f7' }}>
                            +{action.xp}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            fontWeight: '600',
                            background: action.difficulty === "Hard" ? 'rgba(217, 70, 239, 0.3)' : action.difficulty === "Medium" ? 'rgba(168, 85, 247, 0.3)' : 'rgba(192, 132, 252, 0.3)',
                            color: action.difficulty === "Hard" ? '#f0abfc' : action.difficulty === "Medium" ? '#e879f9' : '#e9d5ff',
                          }}
                        >
                          {action.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* SECTION 5: SOCIAL ARCHETYPE */}
        <section>
          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d946ef', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Star style={{ width: 24, height: 24 }} />
                  Your Archetype
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                  Evolving social personality
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>
                    {ARCHETYPES[currentArchetype].icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#c084fc', margin: 0 }}>
                    {ARCHETYPES[currentArchetype].name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                    Current Type
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <ArrowRight style={{ width: 32, height: 32, color: '#e879f9' }} />
                  <div style={{ fontSize: '0.75rem', color: '#c084fc' }}>
                    Evolving
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>
                    {ARCHETYPES[futureArchetype].icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#e879f9', margin: 0 }}>
                    {ARCHETYPES[futureArchetype].name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                    Future Type
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(217, 70, 239, 0.15)', padding: '1.5rem', borderRadius: '1.5rem', border: '2px solid rgba(217, 70, 239, 0.4)' }}>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: '#e9d5ff' }}>
                  <strong style={{ color: '#d946ef' }}>Evolution Path:</strong> As an Observer, you're thoughtful and analytical. You're transforming into a Connector - someone who brings people together naturally!
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
                {Object.entries(ARCHETYPES).map(([key, archetype]) => (
                  <div
                    key={key}
                    onClick={() => setCurrentArchetype(key)}
                    style={{
                      padding: '1rem',
                      borderRadius: '1rem',
                      border: '2px solid',
                      borderColor: currentArchetype === key ? '#d946ef' : 'rgba(168, 85, 247, 0.3)',
                      background: currentArchetype === key ? 'rgba(217, 70, 239, 0.2)' : 'rgba(139, 92, 246, 0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      transform: currentArchetype === key ? 'scale(1.05)' : 'scale(1)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{archetype.icon}</div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 'bold', margin: 0, color: currentArchetype === key ? '#fae8ff' : '#e9d5ff' }}>{archetype.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* SECTION 6: CHALLENGES */}
        <section>
          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Target style={{ width: 24, height: 24 }} />
                  Active Challenges
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                  Complete to level up faster
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {CHALLENGES.map((challenge, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '1.5rem',
                      border: '2px solid',
                      borderColor: completedChallenges.includes(idx) ? '#c084fc' : 'rgba(168, 85, 247, 0.3)',
                      background: completedChallenges.includes(idx) ? 'rgba(192, 132, 252, 0.2)' : 'rgba(139, 92, 246, 0.15)',
                      transition: 'all 0.3s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '2.5rem' }}>{challenge.badge}</div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Zap style={{ width: 16, height: 16, color: '#a855f7' }} />
                          <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#a855f7' }}>
                            +{challenge.xp}
                          </span>
                        </div>
                        {challenge.streak > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                            <Flame style={{ width: 12, height: 12, color: '#d946ef' }} />
                            <span style={{ fontSize: '0.75rem', color: '#d946ef', fontWeight: '600' }}>
                              {challenge.streak} days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', margin: '0 0 0.75rem 0', color: '#e9d5ff' }}>
                      {challenge.title}
                    </p>
                    <button
                      onClick={() => handleChallengeComplete(idx)}
                      disabled={completedChallenges.includes(idx)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '1rem',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        transition: 'all 0.3s',
                        cursor: completedChallenges.includes(idx) ? 'default' : 'pointer',
                        background: completedChallenges.includes(idx) ? 'rgba(192, 132, 252, 0.3)' : 'linear-gradient(90deg, #a855f7, #c084fc)',
                        color: '#fff',
                        border: 'none',
                      }}
                    >
                      {completedChallenges.includes(idx) ? "✓ Completed" : "Mark Complete"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* SECTION 7: TIMELINE */}
        <section>
          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Sparkles style={{ width: 24, height: 24 }} />
                  Your Story
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                  The narrative of your transformation
                </p>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '2rem',
                  top: 0,
                  bottom: 0,
                  width: '6px',
                  background: 'linear-gradient(180deg, #a855f7, #c084fc, #d946ef)',
                  borderRadius: '9999px',
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '5rem' }}>
                  {TIMELINE_EVENTS.map((event) => (
                    <div
                      key={event.id}
                      style={{ position: 'relative' }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: '-3.75rem',
                          top: '0.5rem',
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          border: '4px solid rgba(88, 28, 135, 0.8)',
                          background: event.color,
                          boxShadow: `0 0 20px ${event.color}80`,
                        }}
                      >
                        {event.icon}
                      </div>
                      <div
                        style={{
                          background: 'rgba(139, 92, 246, 0.15)',
                          padding: '1rem',
                          borderRadius: '1rem',
                          border: '2px solid rgba(168, 85, 247, 0.3)',
                          transition: 'all 0.3s',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            marginBottom: '0.5rem',
                            color: event.color,
                            margin: '0 0 0.5rem 0',
                          }}
                        >
                          {event.stage}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#e9d5ff', margin: 0 }}>
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* SECTION 8: BENCHMARKS */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <GlassCard>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '3rem' }}>📊</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#c084fc', margin: 0 }}>vs. Average</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#c084fc' }}>+28%</div>
              <p style={{ fontSize: '0.75rem', color: '#e9d5ff', margin: 0 }}>
                Ahead of most learners
              </p>
              <div style={{ height: '12px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div
                  style={{
                    height: '100%',
                    width: '78%',
                    background: 'linear-gradient(90deg, #c084fc, #a855f7)',
                    borderRadius: '9999px',
                    transition: 'width 1s ease-out 0.5s',
                  }}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '3rem' }}>📈</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#a855f7', margin: 0 }}>
                vs. Last Month
              </h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#a855f7' }}>+45%</div>
              <p style={{ fontSize: '0.75rem', color: '#e9d5ff', margin: 0 }}>
                Growth accelerating
              </p>
              <div style={{ height: '12px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    background: 'linear-gradient(90deg, #a855f7, #d946ef)',
                    borderRadius: '9999px',
                    transition: 'width 1s ease-out 0.7s',
                  }}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '3rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#d946ef', margin: 0 }}>Percentile</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d946ef' }}>Top 15%</div>
              <p style={{ fontSize: '0.75rem', color: '#e9d5ff', margin: 0 }}>
                Among all users
              </p>
              <div style={{ height: '12px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div
                  style={{
                    height: '100%',
                    width: '85%',
                    background: 'linear-gradient(90deg, #d946ef, #c084fc)',
                    borderRadius: '9999px',
                    transition: 'width 1s ease-out 0.9s',
                  }}
                />
              </div>
            </div>
          </GlassCard>
        </section>

        {/* SECTION 9: REFLECTION */}
        <section>
          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e879f9', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Heart style={{ width: 24, height: 24 }} />
                  Weekly Reflection
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#e9d5ff', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                  How do you feel about your progress?
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  { mood: "amazing", emoji: "🤩", label: "Amazing!", color: "#c084fc" },
                  { mood: "good", emoji: "😊", label: "Good", color: "#a855f7" },
                  { mood: "okay", emoji: "😐", label: "Okay", color: "#9333ea" },
                  { mood: "struggling", emoji: "😔", label: "Struggling", color: "#d946ef" },
                ].map(({ mood, emoji, label, color }) => {
                  const [isHovered, setIsHovered] = useState(false);
                  
                  return (
                    <button
                      key={mood}
                      onClick={() => setReflectionMood(mood)}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem',
                        borderRadius: '1.5rem',
                        border: '2px solid',
                        borderColor: reflectionMood === mood ? '#e879f9' : (isHovered && reflectionMood !== mood ? 'rgba(232, 121, 249, 0.5)' : 'rgba(168, 85, 247, 0.3)'),
                        background: reflectionMood === mood ? 'rgba(232, 121, 249, 0.2)' : 'rgba(139, 92, 246, 0.15)',
                        minWidth: '90px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        transform: reflectionMood === mood ? 'scale(1.05)' : (isHovered ? 'scale(1.1)' : 'scale(1)'),
                      }}
                    >
                      <div style={{ fontSize: '2.5rem' }}>{emoji}</div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#e9d5ff' }}>{label}</span>
                    </button>
                  );
                })}
              </div>

              {reflectionMood && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Tell us more about your experience... (optional)"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(168, 85, 247, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      background: 'rgba(139, 92, 246, 0.15)',
                      border: '2px solid rgba(168, 85, 247, 0.3)',
                      borderRadius: '1.5rem',
                      padding: '1rem',
                      fontSize: '0.875rem',
                      resize: 'none',
                      outline: 'none',
                      color: '#fff',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s',
                    }}
                  />
                  <button
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'linear-gradient(90deg, #a855f7, #c084fc)',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      borderRadius: '1.5rem',
                      boxShadow: '0 4px 20px rgba(168, 85, 247, 0.5)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                  >
                    Submit Reflection
                  </button>
                </div>
              )}

              {reflectionMood && (
                <div
                  style={{
                    background: 'rgba(168, 85, 247, 0.15)',
                    padding: '1rem',
                    borderRadius: '1.5rem',
                    border: '2px solid rgba(168, 85, 247, 0.4)',
                  }}
                >
                  <p style={{ fontSize: '0.875rem', margin: 0, color: '#e9d5ff' }}>
                    <strong style={{ color: '#c084fc' }}>
                      Based on your reflection:
                    </strong>{" "}
                    {reflectionMood === "amazing"
                      ? "You're on fire! Keep this momentum!"
                      : reflectionMood === "good"
                        ? "Great progress! Try one harder challenge."
                        : reflectionMood === "okay"
                          ? "Steady progress is still progress. Keep going!"
                          : "It's okay to have tough weeks. Let's adjust your goals."}
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </section>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '2px solid rgba(168, 85, 247, 0.3)',
        background: 'rgba(88, 28, 135, 0.6)',
        backdropFilter: 'blur(10px)',
        marginTop: '3rem',
        borderRadius: '1.5rem 1.5rem 0 0',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#c084fc', margin: 0 }}>
            Keep growing, keep connecting. Your future self will thank you.
          </p>
        </div>
      </footer>
    </div>
  );
}