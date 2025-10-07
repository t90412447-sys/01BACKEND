import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Sparkles,  Users, MessageCircle, CheckCircle, BookOpen,  Flame } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

import { Send, Bot, User, Loader2, CheckCircle, Circle, RotateCw, Scissors, Target, Lightbulb, Trash2, Calendar, BookOpen, TrendingUp, Settings, Zap, ChevronDown, MessageSquare, Award, Flame, Star, Trophy, Clock, BarChart3, Gift, Heart, Users, Plus, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

import { DashboardContent } from 'src/layouts/dashboard';
import { _posts, _tasks, _traffic, _timeline } from 'src/_mock';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

import TodayActionCard from 'src/components/01';
import DuolingoProgressMap from 'src/components/02';
import GoalGridChatbot from 'src/components/03';
import FriendsCommunity from "src/components/04";
import { signInWithGoogle, logOut } from "../../../firebase";


// ----------------------------------------------------------------------



const LEAGUES = {
  bronze: { title: "Bronze League", gradient: "linear-gradient(to right, #cd7f32, #d1a17c)", color: "#cd7f32" },
  silver: { title: "Silver League", gradient: "linear-gradient(to right, #c0c0c0, #d9d9d9)", color: "#c0c0c0" },
  gold: { title: "Gold League", gradient: "linear-gradient(to right, #ffd700, #ffec8b)", color: "#ffd700" },
};


const TransformationSlider = () => {
  const [currentStory, setCurrentStory] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [likes, setLikes] = useState([234, 189, 312]);
  const [hasLiked, setHasLiked] = useState([false, false, false]);

  const stories = [
    {
      name: "Alex M.",
      timeline: "Week 1 → Week 12",
      avatar: "🧑",
      before: {
        emoji: "😰",
        quote: "I ate lunch alone every day",
        stats: [
          { label: "Conversations/day", value: "0" },
          { label: "Friends", value: "2" },
          { label: "Confidence", value: "2/10" },
          { label: "Social Anxiety", value: "9/10" }
        ]
      },
      after: {
        emoji: "😊",
        quote: "I host game nights with 15+ people",
        stats: [
          { label: "Conversations/day", value: "8" },
          { label: "Friends", value: "18" },
          { label: "Confidence", value: "9/10" },
          { label: "Social Anxiety", value: "2/10" }
        ]
      },
      milestone: "First time I started a conversation with a stranger",
      xp: "3,500 XP"
    },
    {
      name: "Sarah K.",
      timeline: "Week 1 → Week 8",
      avatar: "👩",
      before: {
        emoji: "😟",
        quote: "I never spoke up in meetings",
        stats: [
          { label: "Public Speaking", value: "0/10" },
          { label: "Team Projects", value: "0" },
          { label: "Confidence", value: "3/10" },
          { label: "Career Growth", value: "Stuck" }
        ]
      },
      after: {
        emoji: "🎉",
        quote: "I presented to 50 people and LOVED it",
        stats: [
          { label: "Public Speaking", value: "9/10" },
          { label: "Team Projects", value: "5" },
          { label: "Confidence", value: "9/10" },
          { label: "Career Growth", value: "Promoted" }
        ]
      },
      milestone: "Gave my first toast at a wedding",
      xp: "4,200 XP"
    },
    {
      name: "Mike D.",
      timeline: "Week 1 → Week 10",
      avatar: "🧔",
      before: {
        emoji: "😐",
        quote: "Small talk felt impossible",
        stats: [
          { label: "Dating Success", value: "0%" },
          { label: "Conversations", value: "1/week" },
          { label: "Comfort Level", value: "2/10" },
          { label: "Streak", value: "0 days" }
        ]
      },
      after: {
        emoji: "🚀",
        quote: "Got promoted AND in a relationship",
        stats: [
          { label: "Dating Success", value: "85%" },
          { label: "Conversations", value: "12/week" },
          { label: "Comfort Level", value: "10/10" },
          { label: "Streak", value: "45 days" }
        ]
      },
      milestone: "Asked my crush out and she said yes!",
      xp: "3,900 XP"
    }
  ];

  const currentStoryData = stories[currentStory];

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
    setSliderPosition(50);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
    setSliderPosition(50);
  };

  const handleLike = () => {
    if (!hasLiked[currentStory]) {
      const newLikes = [...likes];
      newLikes[currentStory]++;
      setLikes(newLikes);
      
      const newHasLiked = [...hasLiked];
      newHasLiked[currentStory] = true;
      setHasLiked(newHasLiked);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="w-full mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-100">Transformation Stories</h2>
            <p className="text-sm text-purple-300">Real people, real results</p>
          </div>
        </div>
        
        {/* Navigation Dots */}
        <div className="hidden md:flex items-center gap-2">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentStory(index);
                setSliderPosition(50);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStory 
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'w-2 bg-purple-700 hover:bg-purple-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm rounded-3xl border-2 border-purple-500/30 overflow-hidden shadow-2xl">
        
        {/* User Info Header */}
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 px-6 py-4 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
                {currentStoryData.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{currentStoryData.name}</h3>
                <p className="text-sm text-purple-200">{currentStoryData.timeline}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-950/50 rounded-full border border-purple-500/30">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-300">{currentStoryData.xp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Slider Container */}
        <div 
          className="relative h-[500px] md:h-[600px] overflow-hidden cursor-ew-resize select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={handleMouseDown}
          onTouchMove={handleTouchMove}
        >
          
          {/* BEFORE Side (Left) */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="h-full flex flex-col justify-center items-center p-8 text-center">
              <div className="mb-6">
                <div className="text-7xl md:text-8xl mb-4 animate-pulse">{currentStoryData.before.emoji}</div>
                <div className="inline-block px-4 py-2 bg-gray-700/50 rounded-full border border-gray-600 mb-4">
                  <span className="text-sm font-bold text-gray-300">BEFORE</span>
                </div>
              </div>
              
              <p className="text-xl md:text-2xl font-bold text-gray-300 mb-8 max-w-md italic">
                "{currentStoryData.before.quote}"
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {currentStoryData.before.stats.map((stat, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="text-2xl font-bold text-gray-400 mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-500 font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AFTER Side (Right) */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            <div className="h-full flex flex-col justify-center items-center p-8 text-center">
              <div className="mb-6">
                <div className="text-7xl md:text-8xl mb-4 animate-bounce">{currentStoryData.after.emoji}</div>
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/50 mb-4 shadow-lg">
                  <span className="text-sm font-bold text-white">AFTER</span>
                </div>
              </div>
              
              <p className="text-xl md:text-2xl font-bold text-white mb-8 max-w-md italic drop-shadow-lg">
                "{currentStoryData.after.quote}"
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {currentStoryData.after.stats.map((stat, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 border-white/30 shadow-xl">
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-white/90 font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-purple-500">
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Drag Instruction (shows initially) */}
          {sliderPosition === 50 && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl border-2 border-purple-500 animate-bounce">
              <span className="text-sm font-bold text-purple-900">← DRAG TO COMPARE →</span>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 px-6 py-5 border-t border-purple-500/30">
          
          {/* Key Milestone */}
          <div className="mb-4 flex items-start gap-3 bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-purple-300 mb-1">KEY MILESTONE</div>
              <p className="text-sm text-purple-100 font-medium">"{currentStoryData.milestone}"</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                  hasLiked[currentStory]
                    ? 'bg-pink-600 text-white'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                <Heart className={`w-5 h-5 ${hasLiked[currentStory] ? 'fill-current' : ''}`} />
                <span className="text-sm">{likes[currentStory]}</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-900/60 text-purple-200 rounded-xl font-bold hover:bg-purple-800/60 transition-all">
                <Share2 className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Share</span>
              </button>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevStory}
                className="w-10 h-10 bg-purple-900/60 hover:bg-purple-800/60 rounded-xl flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-purple-200" />
              </button>
              <span className="text-sm text-purple-300 font-semibold px-2">
                {currentStory + 1} / {stories.length}
              </span>
              <button
                onClick={nextStory}
                className="w-10 h-10 bg-purple-900/60 hover:bg-purple-800/60 rounded-xl flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5 text-purple-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 text-center">
        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all">
          🚀 Start YOUR Transformation
        </button>
      </div>
    </div>
  );
};

export default TransformationSlider;


const friends = [
  {
    id: 1,
    name: "Alice",
    avatar: "https://i.pravatar.cc/100?img=1",
    league: "gold",
    streak: 12,
    points: 340,
    isOnline: true,
    achievements: ["crown", "chat"],
  },
  {
    id: 2,
    name: "Bob",
    avatar: "https://i.pravatar.cc/100?img=2",
    league: "silver",
    streak: 4,
    points: 120,
    isOnline: false,
    achievements: ["award"],
  },
];



export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      {/* STYLED WRAPPER - No background */}
      <div className="min-h-screen">

	 <TransformationSlider />

	<div>
      <button
        onClick={async () => {
          const user = await signInWithGoogle();
          if (user) {
            console.log("User signed in:", user);
          }
        }}
      >
        Sign up with Google
      </button>

      <button
        onClick={async () => {
          await logOut();
          console.log("User logged out");
        }}
      >
        Logout
      </button>
    </div>
        
      {/* Welcome heading with gradient text, sparkles, and animation */}
<div className="mb-8">
  <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30 animate-pulse">
    <Sparkles className="w-5 h-5 text-purple-300 animate-spin-slow" />
    <span className="text-sm font-medium text-purple-200">Dashboard Overview</span>
  </div>

  <Typography
    variant="h3"
    className="font-extrabold mb-2 bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent animate-fadeInUp"
    sx={{
      mb: { xs: 3, md: 5 },
      fontSize: { xs: '2.25rem', md: '2.75rem' },
    }}
  >
    🚀 Level Up Your Life!
  </Typography>

  <p className="text-purple-200 text-lg md:text-xl leading-relaxed animate-fadeInUp delay-100">
    Every action counts. Track progress, dive into lessons, and crush your goals. Your journey starts here—make it epic!
  </p>
</div>



       <Box 
  sx={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
>
  <Grid 
    container 
    spacing={4} 
    justifyContent="center" 
    alignItems="center" // vertically centers items
  >
    {/* Goal Grid Chatbot */}
    <Grid item xs={12} md={8} lg={6}>
      <GoalGridChatbot />
    </Grid>

    {/* Today Action Card */}
    <Grid item xs={12} md={8} lg={6}>
      <TodayActionCard />
    </Grid>

    {/* Duolingo Progress Map */}
    <Grid item xs={12} md={8} lg={6}>
      <DuolingoProgressMap />
    </Grid>

    {/* Friends Community Section */}
    <Grid item xs={12} md={8} lg={6}>
      <FriendsCommunity friends={friends} LEAGUES={LEAGUES} />
    </Grid>
  </Grid>
</Box>

      </div>

      {/* Add custom styles for smooth transitions */}
      <style jsx>{`
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </DashboardContent>
  );
}