// src/sections/profile/view/BadgeGallery.tsx
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Lottie from "lottie-react";

// Example badge animations (replace with your own JSONs)
import starBadge from "src/animations/badges/star.json";
import fireBadge from "src/animations/badges/fire.json";
import sparklesBadge from "src/animations/badges/sparkles.json";

const badges = [
  { name: "Social Starter", animation: starBadge, description: "Completed first social action" },
  { name: "Confidence Builder", animation: fireBadge, description: "Completed 10 social actions" },
  { name: "Connector", animation: sparklesBadge, description: "Connected 5 new people" },
  { name: "Leader", animation: fireBadge, description: "Led a group activity" },
  { name: "Networker", animation: starBadge, description: "Attended 3 networking events" },
];

export default function BadgeGallery() {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", mt: 4 }}>
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.2, type: "spring", stiffness: 120 }}
        >
          <Card
            sx={{
              width: 160,
              height: 200,
              borderRadius: 4,
              bgcolor: "#1E1E2F",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 30px rgba(0,0,0,0.5)",
              },
            }}
          >
            <Box sx={{ width: 80, height: 80 }}>
              <Lottie animationData={badge.animation} loop={true} />
            </Box>
            <CardContent sx={{ textAlign: "center", pt: 1 }}>
              <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: "bold" }}>
                {badge.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                {badge.description}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
}
