import React, { useState } from "react";
import "./WorkoutLogger.css";

const WorkoutLogger = ({ onAddWorkout }) => {
  const [workout, setWorkout] = useState({
    name: "",
    duration: "",
    calories: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (workout.name && workout.duration && workout.calories && workout.date) {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        alert("Unable to save workout: user email not found.");
        return;
      }

      const existing =
        JSON.parse(localStorage.getItem(`workouts_${userEmail}`) || "[]") || [];

      const updatedWorkouts = [...existing, workout];

      localStorage.setItem(
        `workouts_${userEmail}`,
        JSON.stringify(updatedWorkouts)
      );

      if (typeof onAddWorkout === "function") {
        onAddWorkout(workout);
      }

      // RESET FORM
      setWorkout({ name: "", duration: "", calories: "", date: "" });

      alert("Workout saved!");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="workout-logger">
      <h3>Enter Workout Details</h3>

      <form onSubmit={handleSubmit} className="workout-form">

        <div style={{ display: "flex", gap: "10px" }}>
          <div>
            <label>Workout Name:</label>
            <input
              type="text"
              name="name"
              value={workout.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Duration:</label>
            <input
              type="number"
              name="duration"
              value={workout.duration}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <div>
            <label>Calories:</label>
            <input
              type="number"
              name="calories"
              value={workout.calories}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={workout.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>
          Log Workout
        </button>
      </form>
    </div>
  );
};

export default WorkoutLogger;