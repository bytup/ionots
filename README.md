# Ionots - Data Science & AI Learning Platform

A project-based learning platform focused on Data Science and AI, delivering hands-on learning experiences.

## Features

- **Project Assignment System**: Browse and accept available projects
- **Progress Tracking**: Track project completion with milestones
- **Real-time Updates**: Dynamic progress updates and scoring
- **Modern UI**: Clean and responsive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: Next.js API Routes
- **Database**: SQLite
- **Styling**: Tailwind CSS
- **Icons**: Heroicons

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ionots
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
The application uses SQLite for data storage. The database will be automatically initialized when you first run the application. However, you can manually initialize and seed the database with sample data:

```bash
# Initialize database and add sample projects
node src/db/seed.js
```

This will:
- Create the SQLite database file (`ionots.db`)
- Create all necessary tables (projects, user_projects, milestones, etc.)
- Seed the database with sample Data Science projects
- Skip seeding if data already exists

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

You'll see:
- Available projects that you can accept
- Your current projects with progress tracking
- Project difficulty levels and descriptions

## Project Structure

```
ionots/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── projects/  # Project management endpoints
│   │   │   ├── progress/  # Progress tracking endpoints
│   │   │   └── user-projects/ # User-specific project endpoints
│   │   ├── layout.js      # Root layout
│   │   └── page.js        # Main application page
│   └── db/
│       ├── db.js          # Database utilities
│       ├── schema.sql     # Database schema
│       └── seed.js        # Database seeding script
├── public/               # Static assets
└── package.json         # Project dependencies
```

## Database Schema

### Projects Table
- `id`: INTEGER PRIMARY KEY
- `title`: TEXT
- `description`: TEXT
- `difficulty_level`: TEXT (Beginner/Intermediate/Advanced)
- `created_at`: DATETIME

### User Projects Table
- `id`: INTEGER PRIMARY KEY
- `user_id`: TEXT
- `project_id`: INTEGER
- `status`: TEXT (Pending/Accepted/In Progress/Completed)
- `progress_percentage`: INTEGER
- `score`: INTEGER
- `started_at`: DATETIME
- `completed_at`: DATETIME

### Project Milestones Table
- `id`: INTEGER PRIMARY KEY
- `project_id`: INTEGER
- `title`: TEXT
- `description`: TEXT
- `order_index`: INTEGER
- `points`: INTEGER

### User Milestone Progress Table
- `id`: INTEGER PRIMARY KEY
- `user_project_id`: INTEGER
- `milestone_id`: INTEGER
- `completed`: BOOLEAN
- `completed_at`: DATETIME

## API Documentation

### Projects API

- `GET /api/projects`
  - Returns list of available projects
  - Response: Array of project objects
  ```json
  [
    {
      "id": 1,
      "title": "Machine Learning Basics",
      "description": "Learn ML fundamentals",
      "difficulty_level": "Beginner"
    }
  ]
  ```

- `POST /api/projects`
  - Assigns a project to a user
  - Body: `{ userId: string, projectId: number }`
  - Response: `{ message: "Project assigned successfully" }`

### Progress API

- `POST /api/progress`
  - Updates project progress and milestone completion
  - Body:
    ```json
    {
      "userProjectId": number,
      "status": string,
      "progress": number,
      "milestoneId": number (optional),
      "milestoneCompleted": boolean (optional)
    }
    ```
  - Response: `{ message: "Progress updated successfully" }`

### User Projects API

- `GET /api/user-projects?userId=<userId>`
  - Returns list of projects assigned to the user
  - Query params: `userId` (required)
  - Response: Array of user project objects with details

## Error Handling

The application includes comprehensive error handling:
- Database initialization errors are logged and handled gracefully
- API endpoints return appropriate error responses
- Frontend displays user-friendly error messages
- Automatic retries for failed API requests

## Development Notes

### Database Operations
- The database is automatically initialized when needed
- Each database operation includes proper error handling
- The connection is reused across requests for better performance

### Frontend Features
- Real-time progress updates
- Responsive design for all screen sizes
- Loading states for better UX
- Error boundaries for graceful error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Database Initialization Failed**
   - Ensure you have write permissions in the project directory
   - Try running the seed script manually: `node src/db/seed.js`

2. **API Errors**
   - Check if the database is properly initialized
   - Verify that all tables are created (check schema.sql)
   - Look for error messages in the server console

3. **Frontend Not Loading**
   - Clear browser cache
   - Check for console errors
   - Verify that the development server is running
