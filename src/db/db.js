import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

// Initialize database connection
async function openDb() {
    if (db) return db;
    
    db = await open({
        filename: './ionots.db',
        driver: sqlite3.Database
    });
    
    return db;
}

// Initialize database with schema
async function initializeDb() {
    try {
        const db = await openDb();
        const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf-8');
        
        // Split the schema into individual statements
        const statements = schema
            .split(';')
            .map(statement => statement.trim())
            .filter(statement => statement.length > 0);
        
        // Execute each statement
        for (const statement of statements) {
            await db.exec(statement + ';');
        }
        
        console.log('Database initialized successfully');
        return db;
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// Project-related functions
async function getProjects() {
    const db = await openDb();
    try {
        await initializeDb(); // Ensure database is initialized
        return db.all('SELECT * FROM projects ORDER BY created_at DESC');
    } catch (error) {
        console.error('Error getting projects:', error);
        return [];
    }
}

async function getProjectById(id) {
    const db = await openDb();
    try {
        await initializeDb(); // Ensure database is initialized
        return db.get('SELECT * FROM projects WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error getting project:', error);
        return null;
    }
}

// User project functions
async function assignProject(userId, projectId) {
    const db = await openDb();
    try {
        await initializeDb(); // Ensure database is initialized
        return db.run(
            'INSERT INTO user_projects (user_id, project_id, status, started_at) VALUES (?, ?, ?, datetime("now"))',
            [userId, projectId, 'Accepted']
        );
    } catch (error) {
        console.error('Error assigning project:', error);
        throw error;
    }
}

async function updateProjectStatus(userProjectId, status, progress) {
    const db = await openDb();
    try {
        await initializeDb(); // Ensure database is initialized
        const completedAt = status === 'Completed' ? 'datetime("now")' : null;
        return db.run(
            'UPDATE user_projects SET status = ?, progress_percentage = ?, completed_at = ? WHERE id = ?',
            [status, progress, completedAt, userProjectId]
        );
    } catch (error) {
        console.error('Error updating project status:', error);
        throw error;
    }
}

async function getUserProjects(userId) {
    const db = await openDb();
    try {
        await initializeDb(); // Ensure database is initialized
        return db.all(`
            SELECT up.*, p.title, p.description, p.difficulty_level
            FROM user_projects up
            JOIN projects p ON up.project_id = p.id
            WHERE up.user_id = ?
            ORDER BY up.started_at DESC
        `, [userId]);
    } catch (error) {
        console.error('Error getting user projects:', error);
        return [];
    }
}

// Milestone functions
async function getMilestones(projectId) {
    const db = await openDb();
    try {
        await initializeDb(); // Ensure database is initialized
        return db.all('SELECT * FROM project_milestones WHERE project_id = ? ORDER BY order_index', [projectId]);
    } catch (error) {
        console.error('Error getting milestones:', error);
        return [];
    }
}

async function updateMilestoneProgress(userProjectId, milestoneId, completed) {
    const db = await openDb();
    try {
        await initializeDb(); // Ensure database is initialized
        const completedAt = completed ? 'datetime("now")' : null;
        return db.run(
            'INSERT OR REPLACE INTO user_milestone_progress (user_project_id, milestone_id, completed, completed_at) VALUES (?, ?, ?, ?)',
            [userProjectId, milestoneId, completed, completedAt]
        );
    } catch (error) {
        console.error('Error updating milestone progress:', error);
        throw error;
    }
}

export {
    initializeDb,
    getProjects,
    getProjectById,
    assignProject,
    updateProjectStatus,
    getUserProjects,
    getMilestones,
    updateMilestoneProgress,
};
