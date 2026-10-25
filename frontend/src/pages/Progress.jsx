import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import client from "../api/client";

export default function Progress() {
  const [data, setData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    client.get("/progress/dashboard").then((res) => setData(res.data));
  }, []);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const res = await client.post("/user/report/generate");
      setReportData(res.data.report);
    } catch (err) {
      console.error("Report generation error:", err);
    }
    setGenerating(false);
  };

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const response = await client.get("/user/report/download", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `neolearn_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Could not generate PDF. Check that reportlab is installed on backend.");
    }
    setDownloading(false);
  };

  if (!data) {
    return (
      <div className="flex min-h-screen" style={{ background: "var(--mg-bg)" }}>
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: "var(--mg-accent)", borderTopColor: "transparent" }} />
            <p className="text-sm" style={{ color: "var(--mg-ink-soft)" }}>Loading progress...</p>
          </div>
        </main>
      </div>
    );
  }

  const skillData = Object.entries(data.skill_breakdown).map(([type, stats]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    avg_score: stats.avg_score,
    count: stats.count,
  }));

  const weeklyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    lessons: data.weekly_activity[day] || 0,
  }));

  return (
    <div className="flex min-h-screen" style={{ background: "var(--mg-bg)" }}>
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 lg:px-10 py-6 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display font-extrabold text-5xl md:text-6xl" style={{ color: "var(--mg-ink)" }}>Your progress</h1>
          <p className="text-xl mt-2" style={{ color: "var(--mg-ink-soft)" }}>A full picture of how your literacy skills are developing.</p>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 p-1 bg-soft-100 dark:bg-soft-800 rounded-xl2 w-fit">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-xl2 text-base font-semibold transition-all ${
                activeTab === "dashboard"
                  ? "bg-white dark:bg-surface-dark-alt text-ink-light dark:text-ink-dark shadow-soft"
                  : "text-soft-500 dark:text-soft-400 hover:text-ink-light dark:hover:text-ink-dark"
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab("report")}
              className={`px-4 py-2 rounded-xl2 text-base font-semibold transition-all ${
                activeTab === "report"
                  ? "bg-white dark:bg-surface-dark-alt text-ink-light dark:text-ink-dark shadow-soft"
                  : "text-soft-500 dark:text-soft-400 hover:text-ink-light dark:hover:text-ink-dark"
              }`}
            >
              📋 Report
            </button>
          </div>
        </motion.div>

        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              <StatCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                label="Lessons completed"
                value={data.total_lessons_completed}
                tone="success"
              />
              <StatCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
                label="Average score"
                value={`${data.average_score}%`}
                tone="warning"
              />
              <StatCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                label="CEFR level"
                value={data.level_progress.current_level}
                sublabel={`${data.level_progress.level_index} of ${data.level_progress.total_levels}`}
                tone="primary"
              />
              <StatCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>}
                label="Day streak"
                value={data.user.streak_count}
                tone="danger"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="card p-6"
              >
                <h2 className="font-display font-bold text-lg text-ink-light dark:text-ink-dark mb-3">Score by skill</h2>
                {skillData.length === 0 ? (
                  <p className="text-sm text-soft-400">Complete a few lessons to see this chart.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={skillData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-soft-200 dark:stroke-soft-700" />
                      <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="avg_score" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h2 className="font-display font-bold text-lg text-ink-light dark:text-ink-dark mb-3">This week's activity</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-soft-200 dark:stroke-soft-700" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="lessons" fill="#14B8A6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="card p-6"
            >
              <h2 className="font-display font-bold text-lg text-ink-light dark:text-ink-dark mb-3">Pronunciation score trend</h2>
              {data.voice_trend.length === 0 ? (
                <p className="text-sm text-soft-400">Complete a speaking lesson to see your trend here.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={data.voice_trend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-soft-200 dark:stroke-soft-700" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, fill: "#EF4444" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "report" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h2 className="font-display font-bold text-ink-light dark:text-ink-dark text-lg mb-2">📋 Learning Report</h2>
            <p className="text-sm text-soft-400 mb-6">
              Generate a comprehensive PDF report with your progress, AI-powered analysis, and personalized recommendations.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={generateReport}
                disabled={generating}
                className="btn-accent flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                    Generate Report
                  </>
                )}
              </button>
              <button
                onClick={downloadPdf}
                disabled={downloading}
                className="btn-secondary flex items-center gap-2"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-soft-400 border-t-soft-600 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>

            {reportData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-r from-primary-50 dark:from-primary-500/10 to-accent-50 dark:to-accent-500/10 rounded-xl2 p-5">
                  <h3 className="font-display font-bold text-ink-light dark:text-ink-dark mb-3">📊 Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-soft-400">Lessons Completed</p>
                      <p className="font-bold text-xl text-ink-light dark:text-ink-dark">{reportData.overall_progress?.lessons_completed || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-soft-400">Completion</p>
                      <p className="font-bold text-xl text-ink-light dark:text-ink-dark">{reportData.overall_progress?.completion_percentage || 0}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-soft-400">Current Level</p>
                      <p className="font-bold text-xl text-ink-light dark:text-ink-dark">{reportData.learner_info?.current_level || "A1"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-warning-light dark:bg-warning/10 rounded-xl2 p-5">
                  <h3 className="font-display font-bold text-ink-light dark:text-ink-dark mb-3">🎯 Performance</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {["quiz_accuracy", "speaking_accuracy", "reading_accuracy", "vocabulary_score", "average_score"].map(key => (
                      <div key={key} className="text-center">
                        <p className="text-xs text-soft-400 capitalize">{key.replace("_", " ")}</p>
                        <p className="font-bold text-xl text-ink-light dark:text-ink-dark">{reportData.performance_metrics?.[key] || 0}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                {reportData.ai_remarks?.recommendations && reportData.ai_remarks.recommendations.length > 0 && (
                  <div className="bg-accent-50 dark:bg-accent-500/10 rounded-xl2 p-5">
                    <h3 className="font-display font-bold text-ink-light dark:text-ink-dark mb-2">💡 AI Recommendations</h3>
                    <ul className="space-y-2">
                      {reportData.ai_remarks.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-soft-600 dark:text-soft-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {reportData.ai_remarks?.motivational_summary && (
                  <div className="bg-gradient-to-r from-primary-50 dark:from-primary-500/10 via-accent-50 dark:via-accent-500/10 to-warning-light dark:to-warning/10 rounded-xl2 p-5 italic">
                    <p className="text-sm text-soft-600 dark:text-soft-400">"{reportData.ai_remarks.motivational_summary}"</p>
                  </div>
                )}

                <div className="flex gap-3">
                  {reportData.strong_topics?.length > 0 && (
                    <div className="flex-1 bg-success-light dark:bg-success/10 rounded-xl2 p-4">
                      <p className="text-xs font-semibold text-success mb-2 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Strengths
                      </p>
                      {reportData.strong_topics.map(t => (
                        <p key={t.topic} className="text-xs text-soft-500 dark:text-soft-400 mb-0.5">{t.topic}: {t.score}%</p>
                      ))}
                    </div>
                  )}
                  {reportData.weak_topics?.length > 0 && (
                    <div className="flex-1 bg-danger-light dark:bg-danger/10 rounded-xl2 p-4">
                      <p className="text-xs font-semibold text-danger mb-2 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        Needs Work
                      </p>
                      {reportData.weak_topics.map(t => (
                        <p key={t.topic} className="text-xs text-soft-500 dark:text-soft-400 mb-0.5">{t.topic}: {t.score}%</p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}