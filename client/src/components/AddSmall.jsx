import React, { useState } from "react";
import api from "../api";

export default function AddSmall({ setWorkouts, refreshDaily, fetchWeekly }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [duration, setDuration] = useState(30);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [notes, setNotes] = useState("");

  // Function to get today's date in IST (YYYY-MM-DD)
  const getISTDate = () => {
    return new Date(Date.now() + 5.5 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
  };

  const submit = async (e) => {
    e?.preventDefault();

    const todayIST = getISTDate(); // auto IST date

    try {
      const r = await api.post("/addWorkout", {
        name,
        category,
        duration,
        sets,
        reps,
        notes,
        date: todayIST, // ⬅️ Auto date here
      });

      setWorkouts((prev) => [r.data.workout, ...prev]);

      // Reset fields
      setName("");
      setCategory("General");
      setDuration(30);
      setSets(3);
      setReps(12);
      setNotes("");

      // Refresh dashboard
      await refreshDaily();
      await fetchWeekly();

      alert("Workout added!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add workout");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Workout name"
        className="w-full p-2 border rounded"
        required
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="w-full p-2 border rounded"
      />

      <div className="flex gap-2">
        Sets:<input
          type="number"
          value={sets}
          onChange={(e) => setSets(Number(e.target.value))}
          placeholder="Sets"
          className="w-1/2 p-2 border rounded"
        />
        Reps:<input
          type="number"
          value={reps}
          onChange={(e) => setReps(Number(e.target.value))}
          placeholder="Reps"
          className="w-1/2 p-2 border rounded"
        />
      </div>

      Duration :<input
        type="number"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        className="w-full p-2 border rounded"
        placeholder="Duration (min)"
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Notes"
      ></textarea>

      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Add Workout
      </button>
    </form>
  );
}
