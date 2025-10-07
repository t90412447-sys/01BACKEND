import { useState, useEffect, useMemo } from "react";
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import {
  Trophy, Flame, Sparkles, RefreshCw, Check, ChevronLeft, ChevronRight,
  Zap, Target, Award, Clock, TrendingUp, Lock, CheckCircle2,
  AlertCircle, Lightbulb, RotateCcw, Play, Pause, Heart, MessageCircle,
  Calendar, X
} from "lucide-react";
import Confetti from "react-confetti";

// Firebase imports - Make sure to install: npm install firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, collection, query, limit, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// ============ FIREBASE CONFIG ============
// REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ============ HELPER FUNCTIONS ============

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'from-green-500 to-emerald-500';
    case 'medium': return 'from-yellow-500 to-orange-500';
    case 'hard': return 'from-red-500 to-pink-500';
    default: return 'from-purple-500 to-pink-500';
  }
};

const getDifficultyXPMultiplier = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 1;
    case 'medium': return 1.5;
    case 'hard': return 2;
    default: return 1;
  }
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const determineDifficulty = (taskText) => {
  const lowerTask = taskText.toLowerCase();
  if (lowerTask.includes('review') || lowerTask.includes('reflect') || lowerTask.includes('schedule') || lowerTask.includes('take a few minutes')) {
    return 'easy';
  } else if (lowerTask.includes('practice') || lowerTask.includes('connect') || lowerTask.includes('reach out') || lowerTask.includes('write')) {
    return 'medium';
  } else {
    return 'hard';
  }
};

export default function TodayActionCard() {
  const [dayTasks, setDayTasks] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [openRegenDialog, setOpenRegenDialog] = useState(false);
  const [regenInstructions, setRegenInstructions] = useState("");
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [expandedTaskNote, setExpandedTaskNote] = useState(null);
  const [taskNotes, setTaskNotes] = useState({});
  
  // Firestore specific state
  const [loading, setLoading] = useState(true);
  const [firestoreDocId, setFirestoreDocId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  // ============ AUTH LISTENER ============
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setError("Please log in to view your tasks");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ============ FETCH FROM FIRESTORE ============
  useEffect(() => {
    if (!userId) return;

    const fetchTasksFromFirestore = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query to get the first document in datedcourses collection
        const datedCoursesRef = collection(db, `users/${userId}/datedcourses`);
        const q = query(datedCoursesRef, limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("No courses found. Please create a course first.");
          setLoading(false);
          return;
        }

        // Get the first document
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        setFirestoreDocId(docSnap.id);

        if (!data.lessons_by_date) {
          setError("No lessons found in this course.");
          setLoading(false);
          return;
        }

        // Transform Firestore data to component format
        const transformedTasks = transformFirestoreData(data.lessons_by_date);
        setDayTasks(transformedTasks);

        // Set current day index to today or the last available day
        const today = new Date().toISOString().split("T")[0];
        const todayIndex = transformedTasks.findIndex(day => day.date === today);
        
        if (todayIndex >= 0) {
          setCurrentDayIndex(todayIndex);
        } else {
          // Find the last unlocked day
          const lastUnlockedIndex = transformedTasks.reduce((lastIdx, day, idx) => 
            day.unlocked ? idx : lastIdx, 0
          );
          setCurrentDayIndex(lastUnlockedIndex);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(`Error loading tasks: ${err.message}`);
        setLoading(false);
      }
    };

    fetchTasksFromFirestore();
  }, [userId]);

  // ============ TRANSFORM FIRESTORE DATA ============
  const transformFirestoreData = (lessonsByDate) => {
    const sortedDates = Object.keys(lessonsByDate).sort();
    
    return sortedDates.map((date, index) => {
      const lesson = lessonsByDate[date];
      
      // Check if previous day is completed to determine unlock status
      const isUnlocked = index === 0 || (index > 0 && 
        lessonsByDate[sortedDates[index - 1]].tasks.every(t => t.done)
      );
      
      return {
        id: `day${index + 1}`,
        date: date,
        title: lesson.title || "Daily Challenge",
        dayNumber: index + 1,
        unlocked: isUnlocked,
        motivationalQuote: lesson.quote || lesson.motivation || "",
        summary: lesson.summary || "",
        xpPerTask: 20,
        tasks: lesson.tasks.map(task => ({
          task: task.task,
          done: task.done || false,
          difficulty: task.difficulty || determineDifficulty(task.task),
          timeSpent: task.timeSpent || 0,
          notes: task.notes || ''
        }))
      };
    });
  };

  // ============ UPDATE FIRESTORE ============
  const updateFirestore = async (updatedLessonsByDate) => {
    if (!userId || !firestoreDocId) return;

    try {
      const docRef = doc(db, `users/${userId}/datedcourses`, firestoreDocId);
      await updateDoc(docRef, {
        lessons_by_date: updatedLessonsByDate
      });
    } catch (err) {
      console.error("Error updating Firestore:", err);
      throw err;
    }
  };

  // Timer effect with cleanup
  useEffect(() => {
    let interval;
    if (activeTimer !== null) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  // Calculate stats with proper memoization
  const stats = useMemo(() => {
    let totalXP = 0;
    let totalDaysCompleted = 0;
    let totalTimeSpent = 0;
    let currentStreak = 0;
    let taskCount = 0;

    const sortedDays = [...dayTasks].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const today = new Date().setHours(0, 0, 0, 0);

    // Calculate streak properly
    for (let i = sortedDays.length - 1; i >= 0; i--) {
      const day = sortedDays[i];
      const dayDate = new Date(day.date).setHours(0, 0, 0, 0);
      
      if (dayDate > today) continue;
      
      const completedTasks = day.tasks.filter((t) => t.done).length;
      const totalTasks = day.tasks.length;
      const isDayComplete = completedTasks === totalTasks && totalTasks > 0;
      
      const expectedDate = today - (currentStreak * 86400000);
      
      if (dayDate === expectedDate && isDayComplete) {
        currentStreak++;
      } else if (currentStreak > 0) {
        break;
      }
    }

    // Calculate total stats
    for (const day of sortedDays) {
      const completedTasks = day.tasks.filter((t) => t.done).length;
      const totalTasks = day.tasks.length;
      
      if (completedTasks === totalTasks && totalTasks > 0) {
        totalDaysCompleted++;
      }

      day.tasks.forEach((task) => {
        if (task.done) {
          const xp = day.xpPerTask * getDifficultyXPMultiplier(task.difficulty);
          totalXP += xp;
          taskCount++;
          if (task.timeSpent) totalTimeSpent += task.timeSpent;
        }
      });
    }

    return {
      totalXP,
      totalDaysCompleted,
      currentStreak,
      averageTaskTime: taskCount > 0 ? Math.round(totalTimeSpent / taskCount) : 0,
      totalTimeSpent,
    };
  }, [dayTasks]);

  const handleDayChange = (index) => {
    if (index < 0 || index >= dayTasks.length) return;
    const targetDay = dayTasks[index];
    if (!targetDay.unlocked) return;
    
    // Save current timer before switching
    if (activeTimer !== null) {
      setDayTasks((prev) =>
        prev.map((day, idx) => {
          if (idx !== currentDayIndex) return day;
          const newTasks = [...day.tasks];
          newTasks[activeTimer] = {
            ...newTasks[activeTimer],
            timeSpent: (newTasks[activeTimer].timeSpent || 0) + timerSeconds,
          };
          return { ...day, tasks: newTasks };
        })
      );
      setActiveTimer(null);
      setTimerSeconds(0);
    }
    
    setCurrentDayIndex(index);
  };

  const handleTaskToggle = async (dayDate, taskIndex) => {
    if (!userId || !firestoreDocId) return;

    const currentDay = dayTasks.find((d) => d.date === dayDate);
    if (!currentDay) return;

    const task = currentDay.tasks[taskIndex];
    const wasCompleted = task.done;
    const currentCompletedCount = currentDay.tasks.filter((t) => t.done).length;
    const newDoneStatus = !wasCompleted;

    // Calculate time to save if timer is active
    let timeToSave = task.timeSpent || 0;
    if (activeTimer === taskIndex && newDoneStatus) {
      timeToSave += timerSeconds;
    }

    // Update local state first for immediate feedback
    setDayTasks((prev) =>
      prev.map((day) => {
        if (day.date !== dayDate) return day;
        const newTasks = [...day.tasks];
        newTasks[taskIndex] = { 
          ...newTasks[taskIndex], 
          done: newDoneStatus,
          timeSpent: newDoneStatus && activeTimer === taskIndex ? timeToSave : newTasks[taskIndex].timeSpent
        };
        return { ...day, tasks: newTasks };
      })
    );

    // Stop timer if active
    if (activeTimer === taskIndex) {
      setActiveTimer(null);
      setTimerSeconds(0);
    }

    // Update Firestore
    try {
      const docRef = doc(db, `users/${userId}/datedcourses`, firestoreDocId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedLessons = { ...data.lessons_by_date };
        
        updatedLessons[dayDate].tasks[taskIndex].done = newDoneStatus;
        if (newDoneStatus && activeTimer === taskIndex) {
          updatedLessons[dayDate].tasks[taskIndex].timeSpent = timeToSave;
        }

        await updateFirestore(updatedLessons);

        // Check if all tasks completed
        if (newDoneStatus && currentCompletedCount + 1 === currentDay.tasks.length) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
          
          // Unlock next day
          const currentIdx = dayTasks.findIndex(d => d.date === dayDate);
          const nextDayIndex = currentIdx + 1;
          if (nextDayIndex < dayTasks.length) {
            setDayTasks(prev => prev.map((day, idx) => 
              idx === nextDayIndex ? { ...day, unlocked: true } : day
            ));
          }
        }
      }
    } catch (err) {
      console.error("Error updating task:", err);
      // Revert on error
      setDayTasks((prev) =>
        prev.map((day) => {
          if (day.date !== dayDate) return day;
          const newTasks = [...day.tasks];
          newTasks[taskIndex] = { 
            ...newTasks[taskIndex], 
            done: wasCompleted,
          };
          return { ...day, tasks: newTasks };
        })
      );
    }
  };

  const handleStartTimer = async (taskIndex) => {
    if (activeTimer === taskIndex) {
      // Pause timer and save time
      const timeToSave = timerSeconds;
      
      setDayTasks((prev) =>
        prev.map((day, idx) => {
          if (idx !== currentDayIndex) return day;
          const newTasks = [...day.tasks];
          newTasks[taskIndex] = {
            ...newTasks[taskIndex],
            timeSpent: (newTasks[taskIndex].timeSpent || 0) + timeToSave,
          };
          return { ...day, tasks: newTasks };
        })
      );

      // Update Firestore
      try {
        const docRef = doc(db, `users/${userId}/datedcourses`, firestoreDocId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const updatedLessons = { ...data.lessons_by_date };
          const currentDay = dayTasks[currentDayIndex];
          
          updatedLessons[currentDay.date].tasks[taskIndex].timeSpent = 
            (updatedLessons[currentDay.date].tasks[taskIndex].timeSpent || 0) + timeToSave;

          await updateFirestore(updatedLessons);
        }
      } catch (err) {
        console.error("Error saving timer:", err);
      }

      setActiveTimer(null);
      setTimerSeconds(0);
    } else {
      // Stop any other timer first
      if (activeTimer !== null) {
        const prevTimeToSave = timerSeconds;
        
        setDayTasks((prev) =>
          prev.map((day, idx) => {
            if (idx !== currentDayIndex) return day;
            const newTasks = [...day.tasks];
            newTasks[activeTimer] = {
              ...newTasks[activeTimer],
              timeSpent: (newTasks[activeTimer].timeSpent || 0) + prevTimeToSave,
            };
            return { ...day, tasks: newTasks };
          })
        );
      }
      
      // Start new timer
      setActiveTimer(taskIndex);
      setTimerSeconds(dayTasks[currentDayIndex].tasks[taskIndex].timeSpent || 0);
    }
  };

  const handleResetDay = async () => {
    if (!userId || !firestoreDocId) return;
    
    const currentDay = dayTasks[currentDayIndex];
    if (!confirm(`Reset all tasks for "${currentDay.title}"?`)) return;

    setDayTasks((prev) =>
      prev.map((day, idx) => {
        if (idx !== currentDayIndex) return day;
        return {
          ...day,
          tasks: day.tasks.map((t) => ({ ...t, done: false, timeSpent: 0, notes: '' })),
        };
      })
    );
    
    setActiveTimer(null);
    setTimerSeconds(0);
    setTaskNotes({});

    // Update Firestore
    try {
      const docRef = doc(db, `users/${userId}/datedcourses`, firestoreDocId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedLessons = { ...data.lessons_by_date };
        
        updatedLessons[currentDay.date].tasks = updatedLessons[currentDay.date].tasks.map(t => ({
          ...t,
          done: false,
          timeSpent: 0,
          notes: ''
        }));

        await updateFirestore(updatedLessons);
      }
    } catch (err) {
      console.error("Error resetting day:", err);
    }
  };

  const handleRegenerateTasks = () => {
    alert("AI Regeneration coming soon! This will use AI to create personalized tasks based on your instructions.");
    setOpenRegenDialog(false);
    setRegenInstructions("");
  };

  const handleAddNote = async (taskIndex) => {
    if (!userId || !firestoreDocId) return;

    const note = taskNotes[taskIndex] || '';
    const currentDay = dayTasks[currentDayIndex];

    setDayTasks((prev) =>
      prev.map((day, idx) => {
        if (idx !== currentDayIndex) return day;
        const newTasks = [...day.tasks];
        newTasks[taskIndex] = { ...newTasks[taskIndex], notes: note };
        return { ...day, tasks: newTasks };
      })
    );

    // Update Firestore
    try {
      const docRef = doc(db, `users/${userId}/datedcourses`, firestoreDocId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedLessons = { ...data.lessons_by_date };
        updatedLessons[currentDay.date].tasks[taskIndex].notes = note;

        await updateFirestore(updatedLessons);
      }
    } catch (err) {
      console.error("Error updating note:", err);
    }

    setExpandedTaskNote(null);
    setTaskNotes(prev => {
      const newNotes = {...prev};
      delete newNotes[taskIndex];
      return newNotes;
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="bg-red-900/30 border-2 border-red-500/50 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  // No tasks state
  if (dayTasks.length === 0) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="bg-purple-900/30 border-2 border-purple-500/50 rounded-2xl p-8 max-w-md text-center">
          <Lightbulb className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Tasks Found</h2>
          <p className="text-purple-200">Create your first course to get started!</p>
        </div>
      </div>
    );
  }

  const currentDay = dayTasks[currentDayIndex];
  const completedTasks = currentDay.tasks.filter((t) => t.done).length;
  const totalTasks = currentDay.tasks.length;
  const totalXpEarned = currentDay.tasks.reduce((sum, task) => {
    if (task.done) {
      return sum + (currentDay.xpPerTask * getDifficultyXPMultiplier(task.difficulty));
    }
    return sum;
  }, 0);
  const progressPercent = (completedTasks / totalTasks) * 100;
  const isAllCompleted = completedTasks === totalTasks;
  const canAccessDay = currentDay.unlocked;
  const date = new Date(currentDay.date).toLocaleDateString("en-US", { 
    weekday: "long", 
    month: "long", 
    day: "numeric" 
  });

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600/40 to-pink-600/40 backdrop-blur-md rounded-full border-2 border-purple-400/50 shadow-2xl shadow-purple-500/30"
          >
            <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-yellow-300 animate-pulse" />
            <span className="text-sm md:text-lg font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Your Learning Squad
            </span>
            <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-pink-300 animate-pulse" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3"
          >
            <Users className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Your Today's Tasks
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-base md:text-lg text-purple-300 max-w-2xl mx-auto mb-6 md:mb-8 px-4"
          >
            Check off your daily tasks and keep making progress!
          </motion.p>
        </motion.div>

        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20">
          
          {/* Header Section */}
          <div className="bg-gradient-to-br from-purple-800/60 to-pink-900/60 backdrop-blur-sm p-4 sm:p-6 border-b border-purple-500/30">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {canAccessDay ? (
                      <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 flex-shrink-0" />
                    ) : (
                      <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 flex-shrink-0" />
                    )}
                    <h3 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-white">
                      {currentDay.title}
                    </h3>
                  </div>
                  <span className="px-2 py-1 sm:px-3 sm:py-1 bg-purple-900/50 rounded-full text-purple-200 text-sm sm:text-sm font-medium w-fit">
                    Day {currentDay.dayNumber}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <div className="flex items-center gap-2 text-purple-200">
                    <Target className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm sm:text-sm font-medium">{date}</p>
                  </div>
                  
                  {stats.currentStreak > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-lg w-fit">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-sm sm:text-sm font-bold text-orange-300">
                        {stats.currentStreak} day streak
                      </span>
                    </div>
                  )}
                </div>

                {currentDay.motivationalQuote && (
                  <div className="flex items-start gap-2 mt-3 text-purple-300 italic">
                    <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-sm leading-relaxed">{currentDay.motivationalQuote}</p>
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-2 justify-between sm:justify-start">
                <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg shadow-yellow-500/30">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white font-bold text-base sm:text-lg">+{totalXpEarned} XP</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-purple-200 text-xs sm:text-sm font-medium">
                    {completedTasks}/{totalTasks} Tasks
                  </p>
                  <button
                    onClick={() => setShowStatsModal(true)}
                    className="flex items-center gap-1 px-2 py-1 bg-purple-900/50 border border-purple-500/30 rounded-lg text-purple-200 text-xs hover:bg-purple-800/50 transition-all"
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span className="hidden sm:inline">Stats</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 sm:h-3 bg-purple-950/50">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-r-lg transition-all duration-500 shadow-lg shadow-purple-500/50"
              style={{ width: `${progressPercent}%` }}
            />
            {progressPercent > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-lg">
                  {Math.round(progressPercent)}%
                </span>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6">
            {/* Summary */}
            {currentDay.summary && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-purple-950/30 border border-purple-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">{currentDay.summary}</p>
                </div>
              </div>
            )}

            {/* Day Navigation */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
              <button
                onClick={() => handleDayChange(currentDayIndex - 1)}
                disabled={currentDayIndex === 0}
                className="flex items-center justify-center gap-2 min-w-[44px] h-11 sm:h-10 px-2 sm:px-4 bg-purple-900/50 border border-purple-500/30 rounded-xl text-white font-semibold hover:bg-purple-800/50 hover:border-purple-400/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex gap-2 sm:gap-3 overflow-x-auto flex-1 max-w-none px-2 scrollbar-hide">
                {dayTasks.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDayChange(idx)}
                    disabled={!day.unlocked}
                    className={`relative flex-shrink-0 transition-all ${
                      idx === currentDayIndex
                        ? "w-11 h-11 sm:w-10 sm:h-10"
                        : "w-8 h-8 sm:w-6 sm:h-6"
                    }`}
                  >
                    {idx === currentDayIndex ? (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{day.dayNumber}</span>
                      </div>
                    ) : (
                      <div className={`w-full h-full rounded-full transition-all ${
                        day.unlocked
                          ? "bg-purple-500/50 hover:bg-purple-400/70 hover:scale-150 cursor-pointer"
                          : "bg-purple-900/30 cursor-not-allowed"
                      }`}>
                        {!day.unlocked && (
                          <Lock className="w-3 h-3 sm:w-2 sm:h-2 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleDayChange(currentDayIndex + 1)}
                disabled={currentDayIndex === dayTasks.length - 1 || !dayTasks[currentDayIndex + 1]?.unlocked}
                className="flex items-center justify-center gap-2 min-w-[44px] h-11 sm:h-10 px-2 sm:px-4 bg-purple-900/50 border border-purple-500/30 rounded-xl text-white font-semibold hover:bg-purple-800/50 hover:border-purple-400/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Locked Day Message */}
            {!canAccessDay && (
              <div className="mb-6 p-6 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-center">
                <Lock className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-white mb-2">Day Locked</h4>
                <p className="text-purple-300 text-sm">
                  Complete all tasks from previous days to unlock this challenge!
                </p>
              </div>
            )}

            {/* Tasks */}
            {canAccessDay && (
              <div className="space-y-3 mb-6">
                {currentDay.tasks.map((taskObj, index) => {
                  const isTimerActive = activeTimer === index;
                  const taskTime = taskObj.timeSpent || 0;
                  const displayTime = isTimerActive ? timerSeconds : taskTime;

                  return (
                    <div
                      key={index}
                      className={`group p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                        taskObj.done
                          ? "bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/50 shadow-lg shadow-green-500/20"
                          : "bg-purple-900/30 border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-800/30"
                      } hover:scale-[1.01] hover:shadow-xl`}
                    >
                      {/* Task Header */}
                      <div className="flex items-start gap-3 mb-2">
                        <button
                          onClick={() => handleTaskToggle(currentDay.date, index)}
                          className={`min-w-[32px] w-8 h-8 sm:min-w-[36px] sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                            taskObj.done
                              ? "bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/50"
                              : "bg-purple-900/50 border-2 border-purple-500/50 hover:border-purple-400"
                          }`}
                        >
                          {taskObj.done && <Check className="w-5 h-5 text-white" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold text-white text-sm sm:text-base transition-all break-words ${
                              taskObj.done ? "line-through opacity-60" : ""
                            }`}
                          >
                            {taskObj.task}
                          </p>
                        </div>
                      </div>

                      {/* Task Meta Info */}
                      <div className="flex flex-wrap items-center gap-2 ml-11 sm:ml-12 mb-2">
                        {taskObj.difficulty && (
                          <span className={`px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getDifficultyColor(taskObj.difficulty)}`}>
                            {taskObj.difficulty}
                          </span>
                        )}
                        
                        <div className="flex items-center gap-2 px-2 py-1 bg-purple-800/50 rounded-lg">
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {Math.round(currentDay.xpPerTask * getDifficultyXPMultiplier(taskObj.difficulty))} XP
                          </span>
                        </div>

                        {displayTime > 0 && (
                          <div className="flex items-center gap-1 text-purple-300 text-xs sm:text-sm">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatTime(displayTime)}</span>
                          </div>
                        )}
                      </div>

                      {/* Task Notes Display */}
                      {taskObj.notes && (
                        <div className="ml-11 sm:ml-12 mt-2 p-2 bg-purple-950/30 rounded-lg border border-purple-700/30">
                          <p className="text-purple-200 text-xs sm:text-sm">{taskObj.notes}</p>
                        </div>
                      )}

                      {/* Add Note Section */}
                      {expandedTaskNote === index && (
                        <div className="ml-11 sm:ml-12 mt-2">
                          <textarea
                            value={taskNotes[index] || taskObj.notes || ''}
                            onChange={(e) => setTaskNotes({ ...taskNotes, [index]: e.target.value })}
                            placeholder="Add reflection, learnings, or notes..."
                            className="w-full px-3 py-2 bg-purple-950/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none text-xs sm:text-sm"
                            rows={2}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleAddNote(index)}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-medium transition-colors text-white"
                            >
                              Save Note
                            </button>
                            <button
                              onClick={() => {
                                setExpandedTaskNote(null);
                                setTaskNotes(prev => {
                                  const newNotes = {...prev};
                                  delete newNotes[index];
                                  return newNotes;
                                });
                              }}
                              className="px-3 py-1.5 bg-purple-900/50 hover:bg-purple-800/50 rounded-lg text-xs font-medium transition-colors text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Task Actions */}
                      <div className="flex gap-2 ml-11 sm:ml-12 mt-2">
                        {!taskObj.done && (
                          <button
                            onClick={() => handleStartTimer(index)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-medium ${
                              isTimerActive
                                ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                                : "bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
                            }`}
                            title={isTimerActive ? "Pause timer" : "Start timer"}
                          >
                            {isTimerActive ? (
                              <>
                                <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Start</span>
                              </>
                            )}
                          </button>
                        )}
                        
                        <button
                          onClick={() => setExpandedTaskNote(expandedTaskNote === index ? null : index)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-900/50 text-purple-400 hover:bg-purple-800/50 rounded-lg transition-all text-xs sm:text-sm font-medium"
                          title="Add note"
                        >
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Note</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions */}
            {canAccessDay && (
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setOpenRegenDialog(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  AI Regenerate
                </button>

                <button
                  onClick={handleResetDay}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-900/50 border border-purple-500/30 rounded-xl font-bold text-white hover:bg-purple-800/50 hover:border-purple-400/50 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset Day
                </button>

                {isAllCompleted && (
                  <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-white shadow-lg shadow-yellow-500/30 animate-pulse">
                    <Award className="w-5 h-5" />
                    🎉 Day Complete!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Modal */}
        {showStatsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowStatsModal(false)}>
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-500/30 rounded-2xl p-4 sm:p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Your Progress</h3>
                </div>
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-purple-950/30 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    <span className="text-purple-300 text-xs sm:text-sm">Total XP</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalXP}</p>
                </div>

                <div className="p-3 sm:p-4 bg-purple-950/30 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    <span className="text-purple-300 text-xs sm:text-sm">Days Complete</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalDaysCompleted}</p>
                </div>

                <div className="p-3 sm:p-4 bg-purple-950/30 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                    <span className="text-purple-300 text-xs sm:text-sm">Current Streak</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stats.currentStreak}</p>
                </div>

                <div className="p-3 sm:p-4 bg-purple-950/30 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <span className="text-purple-300 text-xs sm:text-sm">Avg Task Time</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{formatTime(stats.averageTaskTime)}</p>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl border border-purple-500/20 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <h4 className="text-base sm:text-lg font-bold text-white">Daily Progress</h4>
                </div>
                <div className="space-y-2">
                  {dayTasks.map((day, idx) => {
                    const completed = day.tasks.filter(t => t.done).length;
                    const total = day.tasks.length;
                    const percent = (completed / total) * 100;
                    
                    return (
                      <div key={idx} className="flex items-center gap-2 sm:gap-3">
                        <span className="text-purple-300 text-xs sm:text-sm font-medium w-12 sm:w-16">Day {day.dayNumber}</span>
                        <div className="flex-1 h-5 sm:h-6 bg-purple-950/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${percent}%` }}
                          >
                            {percent > 20 && (
                              <span className="text-xs font-bold text-white">{completed}/{total}</span>
                            )}
                          </div>
                        </div>
                        {day.unlocked ? (
                          percent === 100 ? (
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                          )
                        ) : (
                          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-purple-950/30 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                  <span className="text-purple-300 text-xs sm:text-sm font-semibold">Keep Going!</span>
                </div>
                <p className="text-white text-xs sm:text-sm leading-relaxed">
                  You're building incredible social skills. Every small action compounds into lasting confidence. 
                  {stats.currentStreak > 0 && ` Your ${stats.currentStreak}-day streak shows real commitment!`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Regeneration Dialog */}
        {openRegenDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setOpenRegenDialog(false)}>
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-500/30 rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                <h3 className="text-xl sm:text-2xl font-bold text-white">Regenerate Tasks with AI</h3>
              </div>
              
              <p className="text-purple-200 text-xs sm:text-sm mb-4 leading-relaxed">
                Give instructions to customize your tasks (e.g., "Make them easier", "Add more detail", "Focus on public speaking")
              </p>
              
              <textarea
                value={regenInstructions}
                onChange={(e) => setRegenInstructions(e.target.value)}
                placeholder="e.g., Make these tasks more specific and actionable"
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-purple-950/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none mb-4 text-xs sm:text-sm"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => setOpenRegenDialog(false)}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-purple-900/50 border border-purple-500/30 rounded-xl text-white font-semibold hover:bg-purple-800/50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegenerateTasks}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}