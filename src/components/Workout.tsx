import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Dumbbell, Trash2 } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  type: 'strength' | 'cardio';
}

interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
  notes: string;
  duration: number;
}

const Workout: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 1,
    reps: 1,
    weight: 0,
    duration: 0,
    type: 'strength' as 'strength' | 'cardio',
  });
  const [currentExercises, setCurrentExercises] = useState<Exercise[]>([]);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState(0);

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    setWorkouts(savedWorkouts);
  }, []);

  const saveWorkouts = (updatedWorkouts: Workout[]) => {
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    setWorkouts(updatedWorkouts);
  };

  const addExercise = () => {
    if (!newExercise.name) return;

    const exercise: Exercise = {
      id: Date.now().toString(),
      ...newExercise,
    };

    setCurrentExercises([...currentExercises, exercise]);
    setNewExercise({
      name: '',
      sets: 1,
      reps: 1,
      weight: 0,
      duration: 0,
      type: 'strength',
    });
  };

  const removeExercise = (id: string) => {
    setCurrentExercises(currentExercises.filter(ex => ex.id !== id));
  };

  const saveWorkout = () => {
    if (currentExercises.length === 0) return;

    const workout: Workout = {
      id: Date.now().toString(),
      date: selectedDate,
      exercises: currentExercises,
      notes: workoutNotes,
      duration: workoutDuration,
    };

    const existingWorkoutIndex = workouts.findIndex(w => w.date === selectedDate);
    let updatedWorkouts;

    if (existingWorkoutIndex >= 0) {
      updatedWorkouts = [...workouts];
      updatedWorkouts[existingWorkoutIndex] = workout;
    } else {
      updatedWorkouts = [...workouts, workout];
    }

    saveWorkouts(updatedWorkouts);
    setCurrentExercises([]);
    setWorkoutNotes('');
    setWorkoutDuration(0);
    setShowAddForm(false);
  };

  const deleteWorkout = (id: string) => {
    const updatedWorkouts = workouts.filter(workout => workout.id !== id);
    saveWorkouts(updatedWorkouts);
  };

  const getTodaysWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    return workouts.find(workout => workout.date === today);
  };

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= oneWeekAgo;
    });

    const totalExercises = weeklyWorkouts.reduce((sum, workout) => sum + workout.exercises.length, 0);
    const totalDuration = weeklyWorkouts.reduce((sum, workout) => sum + workout.duration, 0);

    return {
      workouts: weeklyWorkouts.length,
      exercises: totalExercises,
      duration: totalDuration,
    };
  };

  const todaysWorkout = getTodaysWorkout();
  const weeklyStats = getWeeklyStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workout Tracker</h1>
          <p className="text-gray-600">Plan and track your fitness journey</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Workout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.workouts}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Workouts completed</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exercises</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.exercises}</p>
            </div>
            <Dumbbell className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">This week</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.duration}m</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Minutes trained</p>
        </div>
      </div>

      {todaysWorkout && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Workout</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysWorkout.exercises.map(exercise => (
              <div key={exercise.id} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                <div className="text-sm text-gray-600 mt-1">
                  {exercise.type === 'strength' ? (
                    <p>{exercise.sets} sets × {exercise.reps} reps {exercise.weight ? `@ ${exercise.weight}kg` : ''}</p>
                  ) : (
                    <p>{exercise.duration} minutes</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {todaysWorkout.notes && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">{todaysWorkout.notes}</p>
            </div>
          )}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Workout</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Add Exercise</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                <input
                  type="text"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Push-ups, Squats, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newExercise.type}
                  onChange={(e) => setNewExercise({ ...newExercise, type: e.target.value as 'strength' | 'cardio' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                </select>
              </div>
              {newExercise.type === 'strength' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sets</label>
                    <input
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
                    <input
                      type="number"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise({ ...newExercise, weight: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newExercise.duration}
                    onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              )}
            </div>
            <button
              onClick={addExercise}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Exercise
            </button>
          </div>

          {currentExercises.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Current Exercises</h4>
              <div className="space-y-2">
                {currentExercises.map(exercise => (
                  <div key={exercise.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {exercise.type === 'strength' ? (
                          `${exercise.sets} sets × ${exercise.reps} reps ${exercise.weight ? `@ ${exercise.weight}kg` : ''}`
                        ) : (
                          `${exercise.duration} minutes`
                        )}
                      </span>
                    </div>
                    <button
                      onClick={() => removeExercise(exercise.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Duration (minutes)</label>
              <input
                type="number"
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How did it go?"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={saveWorkout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Workout
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Workout History</h3>
        {workouts
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map(workout => (
            <div key={workout.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">
                      {new Date(workout.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-sm text-gray-500">• {workout.duration} minutes</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {workout.exercises.map(exercise => (
                      <div key={exercise.id} className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                        <div className="text-sm text-gray-600">
                          {exercise.type === 'strength' ? (
                            <p>{exercise.sets} sets × {exercise.reps} reps {exercise.weight ? `@ ${exercise.weight}kg` : ''}</p>
                          ) : (
                            <p>{exercise.duration} minutes</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {workout.notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">{workout.notes}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteWorkout(workout.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Workout;