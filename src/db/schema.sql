-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    difficulty_level TEXT CHECK(difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Projects table (for tracking assignments and progress)
CREATE TABLE IF NOT EXISTS user_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    project_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('Pending', 'Accepted', 'In Progress', 'Completed')) DEFAULT 'Pending',
    progress_percentage INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    started_at DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Project Milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    points INTEGER DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- User Milestone Progress table
CREATE TABLE IF NOT EXISTS user_milestone_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_project_id INTEGER NOT NULL,
    milestone_id INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    FOREIGN KEY (user_project_id) REFERENCES user_projects(id),
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id)
);
