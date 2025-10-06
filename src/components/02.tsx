import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress,
  Badge,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CheckCircle, Circle, Lock, Book as BookIcon, Zap } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface DayPlan {
  id: number;
  date?: string;
  title: string;
  status: "locked" | "unlocked" | "completed" | "current";
  tasks: string[];
  completedTasks: number;
  totalTasks: number;
  xpReward: number;
}

export default function DuolingoProgressMap() {
  const HARDCODED_UID = "8UuQdWgmDahs2iv9EuDKcBkvfl62";
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const datedCoursesRef = collection(db, `users/${HARDCODED_UID}/datedcourses`);
        const snapshot = await getDocs(datedCoursesRef);

        if (snapshot.empty) {
          setLoading(false);
          return;
        }

        const allDocs = snapshot.docs.map((d) => ({ id: d.id, data: d.data() }));
        const randomDoc = allDocs[Math.floor(Math.random() * allDocs.length)];
        const lessonsByDate = randomDoc.data.lessons_by_date || {};

        const plans: DayPlan[] = Object.entries(lessonsByDate)
          .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
          .map(([date, dayData], index) => {
            const tasksArray = (dayData.tasks || []).map((t: any) => t.task || "");
            const status: DayPlan["status"] =
              index < 2
                ? "completed"
                : index === 2
                ? "current"
                : index === 3
                ? "unlocked"
                : "locked";

            return {
              id: index + 1,
              date,
              title: dayData.title || `Day ${index + 1}: Social Skills`,
              status,
              tasks: tasksArray,
              completedTasks:
                status === "completed"
                  ? tasksArray.length
                  : status === "current"
                  ? 1
                  : 0,
              totalTasks: tasksArray.length,
              xpReward: 150 + index * 25,
            };
          });

        setDayPlans(plans);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <Card sx={{ p: 6, textAlign: "center", backgroundColor: "#1e1e2f" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box
            sx={{
              border: "4px solid #6b21a8",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              width: 50,
              height: 50,
              mb: 2,
              animation: "spin 1s linear infinite",
            }}
          />
          <Typography color="text.secondary">Loading your journey map...</Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Box sx={{ width: "100%", py: 4, px: 2 }}>
      {/* Heading */}
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: { xs: 24, md: 32 },
          color: "#fff",
        }}
      >
        Preview Your Journey Timetable
      </Typography>

      {/* Timeline */}
      <Box display="flex" flexDirection="column" gap={6}>
        {dayPlans.map((plan, index) => {
          const progressPercent = plan.totalTasks
            ? (plan.completedTasks / plan.totalTasks) * 100
            : 0;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={plan.id}
              style={{
                display: "flex",
                flexDirection: isLargeScreen
                  ? isEven
                    ? "row"
                    : "row-reverse"
                  : "column",
                alignItems: "flex-start",
                gap: 16,
              }}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Timeline Node */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                minWidth={80}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  Day {index + 1} / 5
                </Typography>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "4px solid",
                    borderColor:
                      plan.status === "completed"
                        ? "success.main"
                        : plan.status === "current"
                        ? "primary.main"
                        : plan.status === "unlocked"
                        ? "grey.500"
                        : "grey.700",
                    background:
                      plan.status === "completed"
                        ? "linear-gradient(45deg,#22c55e,#16a34a)"
                        : plan.status === "current"
                        ? "linear-gradient(45deg,#8b5cf6,#3b82f6)"
                        : "grey.800",
                    boxShadow:
                      plan.status === "current"
                        ? "0 0 12px rgba(139,92,246,0.6)"
                        : undefined,
                  }}
                >
                  {plan.status === "completed" && <CheckCircle size={28} color="white" />}
                  {plan.status === "current" && <Zap size={28} color="white" />}
                  {plan.status === "unlocked" && <Circle size={28} color="white" />}
                  {plan.status === "locked" && <Lock size={28} color="grey" />}
                </Box>

                {index < dayPlans.length - 1 && (
                  <Box
                    sx={{
                      width: 4,
                      flex: 1,
                      background: "linear-gradient(to bottom, #8b5cf6, transparent)",
                      mt: 2,
                    }}
                  />
                )}
              </Box>

              {/* Card */}
              <Card
                sx={{
                  flex: 1,
                  backgroundColor: "#fff",
                  border:
                    plan.status === "completed"
                      ? "1px solid #22c55e"
                      : plan.status === "current"
                      ? "1px solid #8b5cf6"
                      : "1px solid #6b7280",
                  "&:hover": {
                    transform: "scale(1.03)",
                    transition: "0.2s",
                    boxShadow:
                      plan.status === "current"
                        ? "0 0 12px rgba(139,92,246,0.6)"
                        : "0 0 10px rgba(0,0,0,0.1)",
                  },
                  px: 2,
                  py: 1,
                }}
              >
                <CardHeader
                  title={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" gap={2} alignItems="center">
                        <BookIcon
                          size={24}
                          color={
                            plan.status === "completed"
                              ? "#22c55e"
                              : plan.status === "current"
                              ? "#8b5cf6"
                              : plan.status === "unlocked"
                              ? "#9ca3af"
                              : "#6b7280"
                          }
                        />
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", color: "#000", fontSize: 18 }}
                          >
                            {plan.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {plan.completedTasks}/{plan.totalTasks} tasks • {plan.xpReward} XP
                          </Typography>
                        </Box>
                      </Box>
                      <Badge
                        badgeContent={`${Math.round(progressPercent)}%`}
                        color={plan.status === "completed" ? "success" : "secondary"}
                      />
                    </Box>
                  }
                />
                <CardContent>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {plan.tasks.map((task, taskIndex) => (
                      <Box
                        key={taskIndex}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: "transparent",
                          "&:hover": { backgroundColor: "rgba(107,114,128,0.1)" },
                        }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                              taskIndex < plan.completedTasks ? "success.main" : "grey.600",
                          }}
                        >
                          {taskIndex < plan.completedTasks ? (
                            <CheckCircle size={12} color="white" />
                          ) : (
                            <Circle size={12} color="grey" />
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: taskIndex < plan.completedTasks ? "line-through" : "none",
                            color: plan.status === "locked" ? "grey.500" : "inherit",
                          }}
                        >
                          {task}
                        </Typography>
                      </Box>
                    ))}

                    <Box mt={1}>
                      <LinearProgress
                        variant="determinate"
                        value={progressPercent}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: "grey.300",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              plan.status === "completed"
                                ? "#22c55e"
                                : plan.status === "current"
                                ? "#8b5cf6"
                                : "grey.500",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
}
