import React from 'react';
import { useCode } from '../../context/CodeContext';
import { FaPlus, FaTrash } from 'react-icons/fa';
import './ProjectPopup.css'; // Pastikan nama file CSS juga sudah diubah

const ProjectPopup = ({ isVisible, toggleVisibility }) => {
  const { projects, activeProjectId, loadProject, createNewProject, deleteProject } = useCode();

  // Jangan render apa pun jika tidak terlihat
  if (!isVisible) {
    return null;
  }

  const handleProjectClick = (id) => {
    loadProject(id);
    toggleVisibility(); // Tutup popup setelah proyek dipilih
  };

  const handleNewProjectClick = () => {
    createNewProject();
    toggleVisibility(); // Tutup popup setelah proyek baru dibuat
  };
  
  const handleDeleteClick = (e, id) => {
    e.stopPropagation(); // Mencegah event click menyebar ke item li
    deleteProject(id);
  };

  return (
    // Overlay semi-transparan yang menutupi seluruh layar
    <div className="project-popup-overlay" onClick={toggleVisibility}>
      {/* Kontainer popup utama */}
      <div className="project-popup-container" onClick={(e) => e.stopPropagation()}>
        <header className="project-popup-header">
          <h2>Daftar Proyek</h2>
          <button className="new-project-button" onClick={handleNewProjectClick}>
            <FaPlus /> Buat Proyek Baru
          </button>
        </header>
        <ul className="project-list">
          {projects.map((project) => (
            <li
              key={project.id}
              className={`project-item ${project.id === activeProjectId ? 'active' : ''}`}
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="project-info">
                <span className="project-name">{project.name}</span>
                <span className="project-date">
                  {new Date(project.lastModified).toLocaleDateString()}
                </span>
              </div>
              <button className="delete-project-button" onClick={(e) => handleDeleteClick(e, project.id)}>
                <FaTrash />
              </button>
            </li>
          ))}
          {/* Tampilkan pesan jika tidak ada proyek */}
          {projects.length === 0 && (
            <li className="no-projects-message">Belum ada proyek.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProjectPopup;