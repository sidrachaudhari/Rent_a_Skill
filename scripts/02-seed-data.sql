-- Seed data for Rent-a-Skill platform

-- Insert skill categories
INSERT INTO skills (name, category, description, average_price, total_providers, average_rating, is_popular) VALUES
-- Coding Skills
('Python Programming', 'Coding', 'Python development, scripting, and automation', 400, 45, 4.8, true),
('Web Development', 'Coding', 'Frontend and backend web development', 500, 38, 4.7, true),
('Mobile App Development', 'Coding', 'iOS and Android app development', 600, 22, 4.9, true),
('Data Science', 'Coding', 'Data analysis, machine learning, and AI', 550, 28, 4.8, true),
('JavaScript/React', 'Coding', 'Modern JavaScript and React development', 450, 52, 4.6, true),

-- Design Skills
('UI/UX Design', 'Design', 'User interface and experience design', 400, 35, 4.7, true),
('Graphic Design', 'Design', 'Logo, poster, and marketing material design', 300, 48, 4.5, true),
('Video Editing', 'Design', 'Video production and post-processing', 350, 25, 4.6, false),
('3D Modeling', 'Design', '3D design and animation', 500, 15, 4.8, false),

-- Writing Skills
('Content Writing', 'Writing', 'Blog posts, articles, and web content', 250, 65, 4.4, true),
('Technical Writing', 'Writing', 'Documentation and technical content', 350, 28, 4.7, false),
('Resume Writing', 'Writing', 'Professional resume and cover letter writing', 200, 42, 4.8, true),

-- Business Skills
('Digital Marketing', 'Marketing', 'SEO, social media, and online marketing', 400, 32, 4.5, false),
('Business Analysis', 'Business', 'Market research and business planning', 450, 18, 4.6, false),
('Financial Modeling', 'Finance', 'Excel modeling and financial analysis', 500, 12, 4.9, false),

-- Academic Skills
('Math Tutoring', 'Education', 'Mathematics tutoring and problem solving', 300, 38, 4.7, false),
('Research Assistance', 'Education', 'Academic research and data collection', 250, 45, 4.5, false),
('Language Translation', 'Language', 'Translation between multiple languages', 200, 28, 4.6, false);

-- Insert sample users with different profile types
INSERT INTO users (email, password_hash, name, user_type, profile_type, bio, college, graduation_year, degree, hourly_rate, is_verified, verification_type, rating, completed_tasks, total_earnings) VALUES

-- Students
('priya.student@example.com', '$2b$10$example_hash', 'Priya Sharma', 'provider', 'student', 'Computer Science student passionate about web development and AI', 'IIT Delhi', 2025, 'B.Tech Computer Science', 400, true, 'student_id', 4.9, 67, 45000),
('rahul.student@example.com', '$2b$10$example_hash', 'Rahul Kumar', 'provider', 'student', 'Design student specializing in UI/UX and graphic design', 'NID Ahmedabad', 2024, 'B.Des', 350, true, 'student_id', 4.7, 43, 28500),
('sneha.student@example.com', '$2b$10$example_hash', 'Sneha Patel', 'both', 'student', 'English Literature student with excellent writing skills', 'DU', 2025, 'BA English', 250, true, 'student_id', 4.8, 89, 35600),

-- Graduates
('amit.graduate@example.com', '$2b$10$example_hash', 'Amit Singh', 'provider', 'graduate', 'Recent CS graduate with 1 year experience in full-stack development', 'IIT Bombay', 2023, 'B.Tech Computer Science', 550, true, 'degree', 4.8, 124, 85000),
('kavya.graduate@example.com', '$2b$10$example_hash', 'Kavya Reddy', 'provider', 'graduate', 'MBA graduate specializing in digital marketing and business strategy', 'IIM Bangalore', 2022, 'MBA', 600, true, 'degree', 4.9, 78, 95000),

-- Professionals
('rajesh.pro@example.com', '$2b$10$example_hash', 'Rajesh Gupta', 'provider', 'professional', 'Senior Software Engineer with 5+ years experience in Python and ML', 'BITS Pilani', 2018, 'B.E. Computer Science', 800, true, 'professional', 4.9, 156, 180000),
('meera.pro@example.com', '$2b$10$example_hash', 'Meera Joshi', 'provider', 'professional', 'UX Designer with 4 years experience at top tech companies', 'NIT Trichy', 2019, 'B.Tech', 700, true, 'professional', 4.8, 98, 125000),

-- Seekers
('john.seeker@example.com', '$2b$10$example_hash', 'John Doe', 'seeker', 'professional', 'Startup founder looking for technical help', 'Stanford University', 2020, 'MS Computer Science', NULL, false, NULL, 0, 0, 0),
('sarah.seeker@example.com', '$2b$10$example_hash', 'Sarah Wilson', 'seeker', 'graduate', 'Marketing professional needing design assistance', 'Harvard Business School', 2021, 'MBA', NULL, false, NULL, 0, 0, 0);

-- Link users with their skills
INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience, hourly_rate, is_primary) 
SELECT 
    u.id, 
    s.id, 
    'advanced', 
    2, 
    u.hourly_rate,
    true
FROM users u, skills s 
WHERE u.email = 'priya.student@example.com' AND s.name IN ('Python Programming', 'Web Development');

INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience, hourly_rate, is_primary) 
SELECT 
    u.id, 
    s.id, 
    'expert', 
    3, 
    u.hourly_rate,
    true
FROM users u, skills s 
WHERE u.email = 'rahul.student@example.com' AND s.name IN ('UI/UX Design', 'Graphic Design');

INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience, hourly_rate, is_primary) 
SELECT 
    u.id, 
    s.id, 
    'advanced', 
    2, 
    u.hourly_rate,
    true
FROM users u, skills s 
WHERE u.email = 'sneha.student@example.com' AND s.name IN ('Content Writing', 'Resume Writing');

-- Add more user-skill relationships for graduates and professionals
INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience, hourly_rate, is_primary) 
SELECT 
    u.id, 
    s.id, 
    'expert', 
    5, 
    u.hourly_rate,
    true
FROM users u, skills s 
WHERE u.email = 'rajesh.pro@example.com' AND s.name IN ('Python Programming', 'Data Science');

INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience, hourly_rate, is_primary) 
SELECT 
    u.id, 
    s.id, 
    'expert', 
    4, 
    u.hourly_rate,
    true
FROM users u, skills s 
WHERE u.email = 'meera.pro@example.com' AND s.name IN ('UI/UX Design');
