import { initializeDb } from './db.js';

const sampleProjects = [
  {
    title: 'Machine Learning Basics with Python',
    description: 'Learn fundamental ML concepts by building a simple classification model',
    difficulty_level: 'Beginner'
  },
  {
    title: 'Neural Networks from Scratch',
    description: 'Implement a neural network without using any ML libraries',
    difficulty_level: 'Advanced'
  },
  {
    title: 'Data Visualization Dashboard',
    description: 'Create an interactive dashboard using Python and Plotly',
    difficulty_level: 'Intermediate'
  },
  {
    title: 'Natural Language Processing Project',
    description: 'Build a sentiment analysis model using transformers',
    difficulty_level: 'Advanced'
  }
];

async function seedDatabase() {
  try {
    const db = await initializeDb();
    
    // Check if projects already exist
    const existingProjects = await db.all('SELECT * FROM projects');
    if (existingProjects.length > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }
    
    // Insert sample projects
    for (const project of sampleProjects) {
      await db.run(
        'INSERT INTO projects (title, description, difficulty_level) VALUES (?, ?, ?)',
        [project.title, project.description, project.difficulty_level]
      );
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
