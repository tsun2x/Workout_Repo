import React, { useState } from "react";
import "../style/workout.css";
import { fetchExercises, searchExercises, filterExercises, getByMuscle, getByBodyPart, getByEquipment } from "../API/workouts";

const exercises = [
  {
    id: 1,
    name: "Push Ups",
    sets: 3,
    reps: 12,
    image: "/exercises/pushup.jpg"
  },
  {
    id: 2,
    name: "Squats",
    sets: 4,
    reps: 15,
    image: "/exercises/squat.jpg"
  },
  {
    id: 3,
    name: "Plank",
    sets: 3,
    reps: 45, // seconds? but still “reps only” in UI
    image: "/exercises/plank.jpg"
  }
];

const WorkoutPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState("");
  const [equipment, setEquipment] = useState("");
  const [bodyPart, setBodyPart] = useState("");

  const exercise = exercises[currentIndex];

  const handleNext = () => {
    setHistory(prev => [...prev, exercise]);
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDone = () => {
    setHistory(prev => [...prev, exercise]);
    alert("Workout Completed!");
  };

  const loadInitial = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchExercises({ limit: 12 });
      setResults(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      setError("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadInitial();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      let data;
      if (query) {
        data = await searchExercises(query, { limit: 12 });
      } else if (muscle) {
        data = await getByMuscle(muscle, { limit: 12 });
      } else if (bodyPart) {
        data = await getByBodyPart(bodyPart, { limit: 12 });
      } else if (equipment) {
        data = await getByEquipment(equipment, { limit: 12 });
      } else {
        data = await fetchExercises({ limit: 12 });
      }
      setResults(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <div className="workout-wrapper">
      <div style={{ width: "100%", marginBottom: 24 }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
          <input value={muscle} onChange={(e) => setMuscle(e.target.value)} placeholder="Muscle (e.g., abs)" />
          <input value={bodyPart} onChange={(e) => setBodyPart(e.target.value)} placeholder="Body Part (e.g., chest)" />
          <input value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="Equipment (e.g., dumbbell)" />
          <button type="submit">Apply</button>
          <button type="button" onClick={() => { setQuery(""); setMuscle(""); setBodyPart(""); setEquipment(""); loadInitial(); }}>Reset</button>
        </form>
        <div style={{ marginTop: 12 }}>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}
          {!loading && !error && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
              {results.map((ex) => (
                <div key={ex.exerciseId || ex.id || ex.name} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{ex.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{Array.isArray(ex.targetMuscles) ? ex.targetMuscles.join(', ') : ''}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
     
      <div className="workout-left">
        <img src={exercise.image} alt="exercise" className="exercise-img" />
      </div>

      {/* Exercise Info */}
      <div className="workout-center">
        <h1>{exercise.name}</h1>
        <p className="sub">Stay focused — you’ve got this!</p>

        <div className="exercise-info-card">
          <h2>Sets: {exercise.sets}</h2>
          <h2>Reps: {exercise.reps}</h2>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">
            {currentIndex + 1} / {exercises.length} Exercises
          </p>
        </div>

        {/* Buttons */}
        <div className="workout-btns">
          <button className="skip-btn" onClick={handleSkip}>Skip</button>
          {currentIndex === exercises.length - 1 ? (
            <button className="finish-btn" onClick={handleDone}>Finish</button>
          ) : (
            <button className="next-btn" onClick={handleNext}>Next</button>
          )}
        </div>
      </div>

      {/* Completed Exercises */}
      <div className="workout-right">
        <h3 className="history-title">Completed</h3>

        <div className="history-list">
          {history.length === 0 && (
            <p className="no-history">No exercises completed yet.</p>
          )}

          {history.map((h, i) => (
            <div className="history-item" key={i}>
              <span className="dot"></span>
              <p>{h.name} — {h.sets} x {h.reps}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;


