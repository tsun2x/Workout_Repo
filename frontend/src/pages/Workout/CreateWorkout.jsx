import { useState } from "react";
import { createWorkout } from "../../services/workoutService";

export default function CreateWorkout() {
  const [form, setForm] = useState({
    name: "",
    equipment: "",
    muscle: "",
    bmi: "",
    weight: "",
    height: "",
    age: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createWorkout(form);
    setMessage(res.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 shadow-md rounded-xl w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Create Workout</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(form).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key.toUpperCase()}
              value={form[key]}
              onChange={handleChange}
              className="w-full mb-3 border p-2 rounded"
            />
          ))}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Save Workout
          </button>
        </form>
        {message && <p className="text-center mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}
