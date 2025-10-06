import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  LinearProgress,
  Badge,
  Chip,
  Fade,
  Grow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  Check as CheckIcon,
  Edit as EditIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  AutoAwesome as SparklesIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc, collection, query, limit, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Confetti from "react-confetti";

interface DayTask {
  id: string;
  date: string;
  title: string;
  tasks: Array<{ task: string; done: boolean }>;
  summary?: string;
  xpPerTask: number;
}

const API_BASE = "https://agent-f8uq.onrender.com";

const MOCK_DAY_TASKS: DayTask[] = [
  {
    id: "mock1",
    date: new Date().toISOString().split("T")[0],
    title: "Start Your Journey",
    tasks: [
      { task: "Reflect on your goal", done: false },
      { task: "Write 3 key actions", done: false },
      { task: "Plan your day", done: false },
    ],
    xpPerTask: 10,
  },
];

export default function TodayActionCard() {
  const [dayTasks, setDayTasks] = useState<DayTask[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [openRegenDialog, setOpenRegenDialog] = useState(false);
  const [regenInstructions, setRegenInstructions] = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const [datedCourseDocId, setDatedCourseDocId] = useState<string | null>(null);

  // Fetch all lessons from Firestore
  const fetchLessons = async (user: User) => {
    try {
      const datedCoursesRef = collection(db, "users", user.uid, "datedcourses");
      const q = query(datedCoursesRef, limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setDayTasks(MOCK_DAY_TASKS);
        return;
      }

      const docSnap = querySnapshot.docs[0];
      setDatedCourseDocId(docSnap.id);
      const docData = docSnap.data();
      const lessonsByDate = docData.lessons_by_date || {};

      const tasksArray: DayTask[] = Object.entries(lessonsByDate)
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .map(([date, dayData]: [string, any]) => ({
          id: date,
          date,
          title: dayData.title || `Day ${date}`,
          tasks: dayData.tasks || [],
          summary: dayData.summary,
          xpPerTask: 10,
        }));

      if (tasksArray.length === 0) {
        setDayTasks(MOCK_DAY_TASKS);
      } else {
        setDayTasks(tasksArray);
        // Auto-select today's date
        const today = new Date().toISOString().split("T")[0];
        const todayIndex = tasksArray.findIndex((t) => t.date === today);
        if (todayIndex !== -1) setCurrentDayIndex(todayIndex);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setDayTasks(MOCK_DAY_TASKS);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setCurrentUser(user);
      if (!user) {
        setDayTasks(MOCK_DAY_TASKS);
        setTasksLoading(false);
        return;
      }

      setTasksLoading(true);
      await fetchLessons(user);
      setTasksLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDayChange = (index: number) => {
    if (index < 0 || index >= dayTasks.length) return;
    setCurrentDayIndex(index);
  };

  const handleTaskToggle = async (dayDate: string, taskIndex: number) => {
    if (!currentUser || !datedCourseDocId) return;

    const currentDay = dayTasks.find((d) => d.date === dayDate);
    if (!currentDay) return;

    const wasCompleted = currentDay.tasks[taskIndex].done;

    // Optimistic update
    setDayTasks((prev) =>
      prev.map((day) => {
        if (day.date !== dayDate) return day;
        const newTasks = [...day.tasks];
        newTasks[taskIndex] = { ...newTasks[taskIndex], done: !newTasks[taskIndex].done };
        return { ...day, tasks: newTasks };
      })
    );

    const completedTasks = currentDay.tasks.filter((t) => t.done).length;
    if (!wasCompleted && completedTasks + 1 === currentDay.tasks.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    // Persist to Firestore
    try {
      const docRef = doc(db, "users", currentUser.uid, "datedcourses", datedCourseDocId);
      const updatedTask = { ...currentDay.tasks[taskIndex], done: !currentDay.tasks[taskIndex].done };
      await updateDoc(docRef, {
        [`lessons_by_date.${dayDate}.tasks.${taskIndex}`]: updatedTask,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert optimistic update on error
      setDayTasks((prev) =>
        prev.map((day) => {
          if (day.date !== dayDate) return day;
          const newTasks = [...day.tasks];
          newTasks[taskIndex] = { ...newTasks[taskIndex], done: wasCompleted };
          return { ...day, tasks: newTasks };
        })
      );
    }
  };

  const handleRegenerateTasks = async () => {
    if (!currentUser) return;
    setRegenerating(true);

    try {
      const currentDay = dayTasks[currentDayIndex];
      const response = await fetch(
        `${API_BASE}/generate_tasks?user_id=${currentUser.uid}&date=${currentDay.date}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            difficulty_instructions: regenInstructions || "Make these tasks more actionable and specific",
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        await fetchLessons(currentUser);
        setOpenRegenDialog(false);
        setRegenInstructions("");
      } else {
        alert("Failed to regenerate tasks. Please try again.");
      }
    } catch (error) {
      console.error("Error regenerating tasks:", error);
      alert("Error regenerating tasks. Please check your connection.");
    } finally {
      setRegenerating(false);
    }
  };

  if (tasksLoading) {
    return (
      <Box
        minHeight={300}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: 6,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  const currentDay = dayTasks[currentDayIndex];
  const completedTasks = currentDay.tasks.filter((t) => t.done).length;
  const totalTasks = currentDay.tasks.length;
  const totalXpEarned = completedTasks * currentDay.xpPerTask;
  const progressPercent = (completedTasks / totalTasks) * 100;
  const isAllCompleted = completedTasks === totalTasks;

  return (
    <Box mb={4} position="relative" maxWidth="100%" px={{ xs: 2, md: 0 }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      <Fade in timeout={600}>
        <Card
          sx={{
            borderRadius: 6,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(30px)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 80px rgba(155, 93, 229, 0.2)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.4), 0 0 100px rgba(155, 93, 229, 0.3)",
            },
          }}
        >
          {/* Glassmorphic Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))",
              backdropFilter: "blur(20px)",
              color: "white",
              p: 3,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(155, 93, 229, 0.3), rgba(0, 187, 249, 0.3))",
                zIndex: -1,
              },
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <TrophyIcon sx={{ fontSize: 28, color: "#FFD700" }} />
                  <Typography variant="h4" fontWeight={900} sx={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
                    {currentDay.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500 }}>
                  📅 {new Date(currentDay.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </Typography>
              </Box>

              <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                <Chip
                  icon={<FireIcon />}
                  label={`+${totalXpEarned} XP`}
                  sx={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    px: 2,
                    py: 2.5,
                    boxShadow: "0 4px 20px rgba(255, 215, 0, 0.4)",
                  }}
                />
                <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
                  {completedTasks}/{totalTasks} Tasks Complete
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Animated Progress Bar */}
          <Box sx={{ position: "relative" }}>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 12,
                background: "rgba(255, 255, 255, 0.2)",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #9b5de5, #00bbf9, #00f5d4)",
                  borderRadius: 10,
                  boxShadow: "0 0 20px rgba(0, 245, 212, 0.5)",
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                },
              }}
            />
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Day Navigation */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Button
                startIcon={<ChevronLeftIcon />}
                variant="outlined"
                onClick={() => handleDayChange(currentDayIndex - 1)}
                disabled={currentDayIndex === 0}
                sx={{
                  borderRadius: 3,
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  color: "white",
                  fontWeight: 700,
                  px: 2,
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:disabled": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                Previous
              </Button>

              <Box display="flex" gap={1}>
                {dayTasks.map((_, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: idx === currentDayIndex ? "white" : "rgba(255, 255, 255, 0.3)",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      boxShadow: idx === currentDayIndex ? "0 0 15px rgba(255, 255, 255, 0.8)" : "none",
                      "&:hover": {
                        transform: "scale(1.3)",
                      },
                    }}
                    onClick={() => handleDayChange(idx)}
                  />
                ))}
              </Box>

              <Button
                endIcon={<ChevronRightIcon />}
                variant="outlined"
                onClick={() => handleDayChange(currentDayIndex + 1)}
                disabled={currentDayIndex === dayTasks.length - 1}
                sx={{
                  borderRadius: 3,
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  color: "white",
                  fontWeight: 700,
                  px: 2,
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:disabled": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                Next
              </Button>
            </Box>

            {/* Tasks */}
            <Box display="flex" flexDirection="column" gap={2} mb={3}>
              {currentDay.tasks.map((taskObj, index) => (
                <Grow key={index} in timeout={300 + index * 100}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      background: taskObj.done
                        ? "linear-gradient(135deg, rgba(0, 245, 212, 0.2), rgba(0, 187, 249, 0.2))"
                        : "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(20px)",
                      border: taskObj.done ? "2px solid rgba(0, 245, 212, 0.5)" : "2px solid rgba(255, 255, 255, 0.3)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: taskObj.done
                        ? "0 8px 30px rgba(0, 245, 212, 0.3)"
                        : "0 4px 15px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        transform: "translateX(8px) scale(1.02)",
                        boxShadow: taskObj.done
                          ? "0 12px 40px rgba(0, 245, 212, 0.4)"
                          : "0 8px 25px rgba(255, 255, 255, 0.2)",
                      },
                      "&:active": {
                        transform: "translateX(8px) scale(0.98)",
                      },
                    }}
                    onClick={() => handleTaskToggle(currentDay.date, index)}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: taskObj.done
                            ? "linear-gradient(135deg, #00f5d4, #00bbf9)"
                            : "rgba(255, 255, 255, 0.2)",
                          border: taskObj.done ? "none" : "2px solid rgba(255, 255, 255, 0.5)",
                          transition: "all 0.3s",
                          boxShadow: taskObj.done ? "0 0 20px rgba(0, 245, 212, 0.6)" : "none",
                        }}
                      >
                        {taskObj.done && <CheckIcon sx={{ color: "white", fontSize: 20 }} />}
                      </Box>
                      <Typography
                        sx={{
                          textDecoration: taskObj.done ? "line-through" : "none",
                          color: "white",
                          fontWeight: 600,
                          fontSize: { xs: "0.95rem", sm: "1.05rem" },
                          opacity: taskObj.done ? 0.7 : 1,
                        }}
                      >
                        {taskObj.task}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${currentDay.xpPerTask} XP`}
                      size="small"
                      sx={{
                        background: taskObj.done
                          ? "linear-gradient(135deg, #00f5d4, #00bbf9)"
                          : "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 700,
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  </Box>
                </Grow>
              ))}
            </Box>

            {/* Actions */}
            <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
              <Button
                startIcon={<SparklesIcon />}
                variant="contained"
                onClick={() => setOpenRegenDialog(true)}
                disabled={!currentUser}
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #9b5de5, #00bbf9)",
                  color: "white",
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  boxShadow: "0 8px 30px rgba(155, 93, 229, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #8b4dd5, #0099d9)",
                    boxShadow: "0 12px 40px rgba(155, 93, 229, 0.6)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                AI Regenerate
              </Button>

              {isAllCompleted && (
                <Chip
                  icon={<TrophyIcon />}
                  label="🎉 Day Complete!"
                  sx={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    color: "white",
                    fontWeight: 800,
                    px: 2,
                    py: 2.5,
                    fontSize: "1rem",
                    boxShadow: "0 8px 30px rgba(255, 215, 0, 0.5)",
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.05)" },
                    },
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* AI Regeneration Dialog */}
      <Dialog
        open={openRegenDialog}
        onClose={() => setOpenRegenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(30, 30, 50, 0.95)",
            backdropFilter: "blur(30px)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
          <SparklesIcon sx={{ mr: 1, verticalAlign: "middle", color: "#FFD700" }} />
          Regenerate Tasks with AI
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2} sx={{ opacity: 0.8 }}>
            Give instructions to customize your tasks (e.g., "Make them easier", "Add more detail", "Focus on time management")
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="e.g., Make these tasks more specific and actionable"
            value={regenInstructions}
            onChange={(e) => setRegenInstructions(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.1)",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#9b5de5" },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenRegenDialog(false)}
            sx={{ color: "white", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRegenerateTasks}
            disabled={regenerating}
            startIcon={regenerating ? <CircularProgress size={16} /> : <RefreshIcon />}
            sx={{
              background: "linear-gradient(135deg, #9b5de5, #00bbf9)",
              color: "white",
              fontWeight: 700,
              px: 3,
              borderRadius: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #8b4dd5, #0099d9)",
              },
            }}
          >
            {regenerating ? "Regenerating..." : "Regenerate"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}