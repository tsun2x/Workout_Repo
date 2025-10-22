const API_URL = "http://localhost/System_integ/backend/workout/";

const WorkoutService = {
  async createWorkout(data) {
    const res = await fetch(`${API_URL}create_workout.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async getExercises() {
    const res = await fetch("https://exercisedb.p.rapidapi.com/exercises", {
      headers: {
        "X-RapidAPI-Key": "5d1f422f6dmshfc7a8942509f58cp1a890cjsna57b2b4737e8",
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    });
    return await res.json();
  },
};

export default WorkoutService;
