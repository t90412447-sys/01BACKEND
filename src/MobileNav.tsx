// src/components/BottomNav.tsx
import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Timeline, CalendarMonth, People, Checklist, SmartToy } from "@mui/icons-material";

const tabs = [
  { label: "Progress", icon: <Timeline fontSize="large" /> },
  { label: "Schedule", icon: <CalendarMonth fontSize="large" /> },
  { label: "Community", icon: <People fontSize="large" /> },
  { label: "Actions", icon: <Checklist fontSize="large" /> },
  { label: "AI Agent", icon: <SmartToy fontSize="large" /> },
];

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "70px",
        borderRadius: 0, // full rectangular
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.9)", // light glassy
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        zIndex: 1300,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{
          bgcolor: "transparent",
          "& .Mui-selected": {
            color: "#4f46e5", // active tab highlight
          },
          "& .MuiBottomNavigationAction-root": {
            color: "#1f1f1f", // default dark text
            fontSize: 14,
            minWidth: "70px",
          },
          "& .MuiBottomNavigationAction-label": {
            fontWeight: 600,
            fontSize: "0.85rem",
          },
        }}
      >
        {tabs.map((tab) => (
          <BottomNavigationAction
            key={tab.label}
            label={tab.label}
            icon={tab.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
