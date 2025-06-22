import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialCode = {
  html: `<h1>Welcome to Oncomn AI</h1>\n<p>Start a new project or load an existing one from the projects panel.</p>`,
  css: `body {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  background: #1e1e1e;\n  color: white;\n  font-family: sans-serif;\n  text-align: center;\n}\nh1 {\n  color: #8a5ff1;\n}`,
  js: `console.log("Welcome to Oncomn AI!");`,
  reasoning: '',
  prompt: 'Create a simple welcome page'
};

export const CodeContext = createContext();

// Debounce helper function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const CodeProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);

  // Effect to auto-save the active project when its code changes
  useEffect(() => {
    const handler = debounce(() => {
      if (!activeProjectId || !generatedCode) return;

      setProjects(prevProjects => {
        const project = prevProjects.find(p => p.id === activeProjectId);
        if (!project) return prevProjects;

        const isNewProject = project.name.startsWith('New Project');
        let projectName = project.name;
        if (isNewProject && generatedCode.prompt) {
          projectName = generatedCode.prompt.substring(0, 40) + (generatedCode.prompt.length > 40 ? '...' : '');
        }
        
        return prevProjects.map(p =>
          p.id === activeProjectId
            ? { ...p, name: projectName, code: generatedCode, lastModified: Date.now() }
            : p
        );
      });
    }, 1500); // Auto-save after 1.5 seconds of inactivity

    handler();

    // Cleanup function
    return () => {
      clearTimeout(handler);
    };
  }, [generatedCode, activeProjectId]);

  // Load projects from localStorage on initial render
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('oncomn_projects');
      const projects = savedProjects ? JSON.parse(savedProjects) : [];
      setProjects(projects);

      const lastActiveId = localStorage.getItem('oncomn_lastActiveId');
      if (lastActiveId && lastActiveId !== 'null' && projects.some(p => p.id === lastActiveId)) {
        loadProject(lastActiveId, projects);
      } else if (projects.length > 0) {
        loadProject(projects[0].id, projects);
      } else {
        createNewProject();
      }
    } catch (error) {
      console.error("Failed to load projects from localStorage:", error);
      setProjects([]);
      createNewProject();
    }
  }, []); // Empty dependency array ensures this runs only once

  // Save projects to localStorage whenever the projects array changes
  useEffect(() => {
    try {
      if (projects.length > 0) {
        localStorage.setItem('oncomn_projects', JSON.stringify(projects));
      }
    } catch (error) {
      console.error("Failed to save projects to localStorage:", error);
    }
  }, [projects]);

  // Save the last active project ID
  useEffect(() => {
    try {
      localStorage.setItem('oncomn_lastActiveId', activeProjectId);
    } catch (error) {
      console.error("Failed to save active ID to localStorage:", error);
    }
  }, [activeProjectId]);

  const createNewProject = useCallback(() => {
    const newId = uuidv4();
    const newProject = {
      id: newId,
      name: `New Project - ${new Date().toLocaleDateString()}`,
      code: { ...initialCode, prompt: '' },
      lastModified: Date.now(),
    };
    setActiveProjectId(newId);
    setGeneratedCode(newProject.code);
    setProjects(prev => [newProject, ...prev]);
  }, []);

  const loadProject = useCallback((id, projectList = projects) => {
    const projectToLoad = projectList.find(p => p.id === id);
    if (projectToLoad) {
      setGeneratedCode(projectToLoad.code);
      setActiveProjectId(id);
    } else {
        // Fallback if ID is invalid
        if (projectList.length > 0) {
            setGeneratedCode(projectList[0].code);
            setActiveProjectId(projectList[0].id);
        } else {
            createNewProject();
        }
    }
  }, [projects, createNewProject]);
  
  const deleteProject = useCallback((id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    const remainingProjects = projects.filter(p => p.id !== id);
    setProjects(remainingProjects);
    
    if (activeProjectId === id) {
      if (remainingProjects.length > 0) {
        loadProject(remainingProjects[0].id, remainingProjects);
      } else {
        createNewProject();
      }
    }
  }, [activeProjectId, projects, createNewProject, loadProject]);

  const value = {
    projects, activeProjectId, generatedCode, isLoading,
    setGeneratedCode, setIsLoading, loadProject, createNewProject, deleteProject,
  };

  return <CodeContext.Provider value={value}>{children}</CodeContext.Provider>;
};

export const useCode = () => {
  const context = useContext(CodeContext);
  if (!context) throw new Error('useCode must be used within a CodeProvider');
  return context;
};