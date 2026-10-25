import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import LessonPlayer from "./pages/LessonPlayer";
import Progress from "./pages/Progress";
import Achievements from "./pages/Achievements";
import PronunciationPage from "./pages/PronunciationPage";
import LearningPath from "./pages/LearningPath";
import ProtectedRoute from "./components/ProtectedRoute";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<AnimatedPage><Landing /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />

        <Route path="/onboarding" element={<ProtectedRoute><AnimatedPage><Onboarding /></AnimatedPage></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><AnimatedPage><Dashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/learning-path" element={<ProtectedRoute><AnimatedPage><LearningPath /></AnimatedPage></ProtectedRoute>} />
        <Route path="/lesson/:lessonId" element={<ProtectedRoute><AnimatedPage><LessonPlayer /></AnimatedPage></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><AnimatedPage><Progress /></AnimatedPage></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><AnimatedPage><Achievements /></AnimatedPage></ProtectedRoute>} />
        <Route path="/pronunciation" element={<ProtectedRoute><AnimatedPage><PronunciationPage /></AnimatedPage></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}