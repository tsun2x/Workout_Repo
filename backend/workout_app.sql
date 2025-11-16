-- Create database
CREATE DATABASE IF NOT EXISTS workout_app;
USE workout_app;

-- =========================================
-- 1. USERS TABLE (for authentication)
-- =========================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample users
INSERT INTO users (username, email, password, age, gender, height_cm, weight_kg)
VALUES 
('markozu', 'mark@example.com', 'hashed_password_here', 21, 'Male', 175.00, 68.00),
('admin', 'admin@example.com', 'hashed_password_here', 25, 'Male', 180.00, 75.00);

-- =========================================
-- 2. CATEGORIES TABLE (e.g., Cardio, Strength)
-- =========================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Sample categories
INSERT INTO categories (name, description) VALUES
('Cardio', 'Exercises that increase heart rate and endurance'),
('Strength', 'Resistance-based training for muscle building'),
('Flexibility', 'Stretching and mobility exercises');

-- =========================================
-- 3. WORKOUTS TABLE (predefined exercises)
-- =========================================
CREATE TABLE workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    equipment VARCHAR(100),
    muscle_group VARCHAR(100),
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced'),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Sample workouts
INSERT INTO workouts (category_id, name, description, equipment, muscle_group, difficulty) VALUES
(1, 'Running', 'Treadmill or outdoor running for stamina', 'Treadmill', 'Legs', 'Beginner'),
(2, 'Bench Press', 'Chest press using a barbell', 'Barbell', 'Chest', 'Intermediate'),
(3, 'Deadlift', 'Lifting barbell from ground to hips', 'Barbell', 'Back', 'Advanced'),
(2, 'Squats', 'Lower body exercise focusing on quads and glutes', 'Barbell', 'Legs', 'Intermediate'),
(3, 'Yoga Stretch', 'Full body stretching routine', 'Mat', 'Full Body', 'Beginner');

-- =========================================
-- 4. WORKOUT PLANS (custom user plans)
-- =========================================
CREATE TABLE workout_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    goal VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample workout plans
INSERT INTO workout_plans (user_id, title, goal) VALUES
(1, 'Summer Shred', 'Lose fat and increase endurance'),
(1, 'Mass Gain', 'Build lean muscle mass');

-- =========================================
-- 5. PLAN_WORKOUTS (link between workout plans and exercises)
-- =========================================
CREATE TABLE plan_workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    workout_id INT NOT NULL,
    day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
    sets INT,
    reps INT,
    FOREIGN KEY (plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Sample plan_workouts
INSERT INTO plan_workouts (plan_id, workout_id, day_of_week, sets, reps) VALUES
(1, 1, 'Monday', 1, 20),
(1, 2, 'Wednesday', 3, 10),
(2, 3, 'Friday', 4, 8);

-- =========================================
-- 6. PROGRESS TRACKING
-- =========================================
CREATE TABLE progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    date DATE NOT NULL,
    weight_kg DECIMAL(5,2),
    calories_burned INT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE
);

-- Sample progress data
INSERT INTO progress (user_id, plan_id, date, weight_kg, calories_burned, notes)
VALUES
(1, 1, '2025-10-20', 67.5, 400, 'Good session today!'),
(1, 1, '2025-10-21', 67.2, 450, 'Improved endurance.');

-- =========================================
-- 7. BMI CALCULATION (auto or manual)
-- =========================================
CREATE TABLE bmi_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    height_cm DECIMAL(5,2) NOT NULL,
    weight_kg DECIMAL(5,2) NOT NULL,
    bmi_value DECIMAL(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample BMI
INSERT INTO bmi_records (user_id, height_cm, weight_kg, bmi_value)
VALUES
(1, 175.00, 68.00, 22.2);
