'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowPathIcon,
  BeakerIcon 
} from '@heroicons/react/24/outline';

// Temporary user ID for demo purposes
const DEMO_USER_ID = 'user123';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsRes, userProjectsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch(`/api/user-projects?userId=${DEMO_USER_ID}`)
      ]);

      if (!projectsRes.ok || !userProjectsRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const projectsData = await projectsRes.json();
      const userProjectsData = await userProjectsRes.json();
      
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setUserProjects(Array.isArray(userProjectsData) ? userProjectsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const acceptProject = async (projectId) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEMO_USER_ID, projectId })
      });

      if (!response.ok) {
        throw new Error('Failed to accept project');
      }
      
      await fetchData();
    } catch (error) {
      console.error('Error accepting project:', error);
      setError('Failed to accept project. Please try again.');
    }
  };

  const updateProgress = async (userProjectId, newStatus, progress) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProjectId, status: newStatus, progress })
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
      
      await fetchData();
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      case 'Accepted':
        return <BeakerIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User's Projects */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Projects</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                {getStatusIcon(project.status)}
              </div>
              
              <p className="text-sm text-gray-500">{project.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={clsx(
                      "h-2 rounded-full",
                      project.progress_percentage === 100
                        ? "bg-green-500"
                        : "bg-blue-500"
                    )}
                    style={{ width: `${project.progress_percentage}%` }}
                  />
                </div>
              </div>

              {project.status !== 'Completed' && (
                <div className="pt-4">
                  <button
                    onClick={() => {
                      const newProgress = Math.min(project.progress_percentage + 25, 100);
                      const newStatus = newProgress === 100 ? 'Completed' : 'In Progress';
                      updateProgress(project.id, newStatus, newProgress);
                    }}
                    className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update Progress
                  </button>
                </div>
              )}
            </div>
          ))}
          {userProjects.length === 0 && (
            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">You haven't accepted any projects yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Available Projects */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Projects</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects
            .filter(
              (project) =>
                !userProjects.some((up) => up.project_id === project.id)
            )
            .map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm p-6 space-y-4"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500">{project.description}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {project.difficulty_level}
                  </span>
                  <button
                    onClick={() => acceptProject(project.id)}
                    className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Accept Project
                  </button>
                </div>
              </div>
            ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No projects available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
