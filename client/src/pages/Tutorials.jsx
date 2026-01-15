import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";


export default function Tutorials() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/exercises");
        setExercises(res.data.exercises);
      } catch (err) {
        console.error("Failed to fetch exercises:", err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Tutorials</h2>

        {/* Exercise Tutorials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <a
              key={exercise._id}
              href={exercise.video_url}
              target="_blank"
              rel="noreferrer"
              className="block hover:scale-105 transform transition duration-200"
            >
              <div className="card border rounded-lg shadow-sm hover:shadow-md p-3">
                <img
                  src={exercise.image_url}
                  alt={exercise.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h4 className="mt-2 font-semibold text-lg">{exercise.name}</h4>
                <p className="text-sm text-gray-600">
                  {exercise.category} • {exercise.equipment}
                </p>
                <p className="text-sm text-gray-500 mt-2">{exercise.tips}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
