import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import WorkoutLogger from "./WorkoutLogger";
import WeeklyProgressChart from "./WeeklyProgressChart";
import CalorieCalculator from "./CalorieCalculator";
import StepsCalculator from "./StepsCalculator";
import HealthResources from "./HealthResources";
import MentalWellness from "./MentalWellness";
import NutritionGuide from "./NutritionGuide";
import WellnessPrograms from "./WellnessPrograms";

const Dashboard = () => {
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [healthScore, setHealthScore] = useState(0);
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [activeComponent, setActiveComponent] = useState("progress");

  const userEmail = localStorage.getItem("userEmail");
  const username = userEmail ? userEmail.split("@")[0] : "Student";

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!userEmail) return;

    const workouts =
      JSON.parse(localStorage.getItem(`workouts_${userEmail}`)) || [];

    const moods =
      JSON.parse(localStorage.getItem(`moods_${userEmail}`)) || [];

    setWorkoutLogs(workouts);
    calculateHealthScore(workouts, moods);
  }, [userEmail]);

  /* ================= LOAD ENROLLED PROGRAMS ================= */
  useEffect(() => {
    if (!userEmail) return;

    // Load enrolled programs from localStorage (consistent with WellnessPrograms component)
    const enrolled = JSON.parse(localStorage.getItem(`wellness_${userEmail}`)) || [];
    setEnrolledPrograms(enrolled);
  }, [userEmail]);

  /* ================= HEALTH SCORE ================= */
  const calculateHealthScore = (workouts, moods) => {
    const workoutPoints = workouts.length * 10;

    const caloriesPoints =
      workouts.reduce((sum, w) => sum + (w.calories || 0), 0) / 50;

    const moodPoints = moods.length * 5;

    let score = workoutPoints + caloriesPoints + moodPoints;

    if (score > 100) score = 100;

    setHealthScore(Math.round(score));
  };

  /* ================= ADD WORKOUT ================= */
  const handleAddWorkout = (workout) => {
    const updated = [
      ...workoutLogs,
      {
        ...workout,
        duration: parseInt(workout.duration),
        calories: parseInt(workout.calories),
      },
    ];

    setWorkoutLogs(updated);

    localStorage.setItem(
      `workouts_${userEmail}`,
      JSON.stringify(updated)
    );

    const moods =
      JSON.parse(localStorage.getItem(`moods_${userEmail}`)) || [];

    calculateHealthScore(updated, moods);
  };

  /* ================= STATUS ================= */
  const getHealthStatus = () => {
    if (healthScore >= 80) return "Excellent";
    if (healthScore >= 50) return "Good";
    return "Needs Attention";
  };

  const totalCalories = workoutLogs.reduce(
    (sum, w) => sum + (w.calories || 0),
    0
  );

  const adminSuggestion = localStorage.getItem(`suggestion_${userEmail}`);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 pt-24">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white/90 backdrop-blur-lg border border-white/50 rounded-3xl p-8 shadow-2xl text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome to FitWell Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Hello, <span className="font-semibold text-blue-600">{username}</span>.
          </p>
          <p className="text-gray-500 mt-1">
            Your comprehensive health and wellness tracking platform
          </p>
        </div>

        {/* HEALTH SCORE & STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">❤️</span>
              <h3 className="text-xl font-semibold text-gray-800">Health Score</h3>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">{healthScore}/100</p>
              <p className="text-lg font-medium text-gray-600 mb-4">{getHealthStatus()}</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${healthScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Total Progress</h3>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600 mb-2">{totalCalories.toLocaleString()}</p>
              <p className="text-lg text-gray-600">Calories Burned</p>
              <p className="text-sm text-gray-500 mt-2">{workoutLogs.length} workouts logged</p>
            </div>
          </div>
        </div>

        {/* ADMIN MESSAGE */}
        {adminSuggestion && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-3xl p-6 shadow-lg">
            <div className="flex items-start gap-3">
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Admin Suggestion</h4>
                <p className="text-gray-700">{adminSuggestion}</p>
              </div>
            </div>
          </div>
        )}

        {/* MY WELLNESS PROGRAMS */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Wellness Programs</h2>

          {enrolledPrograms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">You have not enrolled in any programs yet</p>
              <p className="text-gray-400 text-sm mt-2">Visit the Wellness Programs section to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledPrograms.map((program, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{program.name}</h3>
                  <p className="text-gray-600 mb-3 leading-relaxed">{program.description}</p>
                  {program.duration && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-700">Duration:</span>
                      <span className="text-sm text-gray-600">{program.duration}</span>
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Enrolled</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACCESS BUTTONS */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Progress Chart", id: "progress", icon: "📊" },
              { label: "Workout Logger", id: "workout", icon: "🏋️" },
              { label: "Calorie Calculator", id: "calorie", icon: "🍎" },
              { label: "Steps Tracker", id: "steps", icon: "👟" },
              { label: "Health Resources", id: "resources", icon: "📚" },
              { label: "Mental Wellness", id: "wellness", icon: "🧘" },
              { label: "Nutrition Guide", id: "nutrition", icon: "🥗" },
              { label: "Wellness Programs", id: "programs", icon: "💪" },
            ].map(({ label, id, icon }) => (
              <button
                key={id}
                onClick={() => setActiveComponent(id)}
                className={`p-4 rounded-xl transition-all duration-200 transform hover:scale-105 text-center group border ${
                  activeComponent === id
                    ? "bg-gradient-to-br from-blue-400 to-indigo-500 border-blue-600 text-white"
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 text-gray-700"
                }`}
              >
                <div className="text-3xl mb-2">{icon}</div>
                <p className={`text-sm font-medium ${activeComponent === id ? "text-white" : "group-hover:text-gray-900"}`}>{label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* COMPONENT DISPLAY SECTION */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50">
          {activeComponent === "progress" && <WeeklyProgressChart workoutLogs={workoutLogs} />}
          {activeComponent === "workout" && <WorkoutLogger onAddWorkout={handleAddWorkout} />}
          {activeComponent === "calorie" && <CalorieCalculator />}
          {activeComponent === "steps" && <StepsCalculator />}
          {activeComponent === "resources" && <HealthResources />}
          {activeComponent === "wellness" && <MentalWellness />}
          {activeComponent === "nutrition" && <NutritionGuide />}
          {activeComponent === "programs" && <WellnessPrograms />}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;