import React, { useState, useEffect } from "react";
import "./Portfolio.css";

const Portfolio = () => {
  // Retrieve saved projects from localStorage or initialize an empty array
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  // Form data for project creation and editing
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    isEditing: false,
    editId: null,
  });

  // Persist project data in localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  // Handle input changes in the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate if the image URL is valid
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Add a new project
  const addProject = () => {
    if (!formData.title || !formData.description || !formData.image) {
      alert("Please fill in all fields.");
      return;
    }
    if (!isValidURL(formData.image)) {
      alert("Invalid image URL.");
      return;
    }

    const newProject = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      image: formData.image,
    };

    setProjects([...projects, newProject]);
    resetForm();
  };

  // Update an existing project
  const updateProject = (id) => {
    if (!formData.title || !formData.description || !formData.image) {
      alert("Please fill in all fields.");
      return;
    }
    if (!isValidURL(formData.image)) {
      alert("Invalid image URL.");
      return;
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === id
          ? { ...project, title: formData.title, description: formData.description, image: formData.image }
          : project
      )
    );
    resetForm();
  };

  // Set up the form for editing an existing project
  const editProject = (id) => {
    const projectToEdit = projects.find((project) => project.id === id);
    setFormData({
      title: projectToEdit.title,
      description: projectToEdit.description,
      image: projectToEdit.image,
      isEditing: true,
      editId: id,
    });
  };

  // Delete a project
  const deleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  // Reset the form fields
  const resetForm = () => {
    setFormData({ title: "", description: "", image: "", isEditing: false, editId: null });
  };

  return (
    <section id="portfolio" className="portfolio container">
      <h2 className="mb-5">
        Latest <span>Projects</span>
      </h2>

      <div className="row">
        {projects.map((project) => (
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={project.id}>
            <div className="portfolio-item card shadow-sm">
              <img src={project.image} alt={project.title} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text">{project.description}</p>
                <button onClick={() => editProject(project.id)} className="btn btn-warning mr-2">
                  Edit
                </button>
                <button onClick={() => deleteProject(project.id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="form-container mt-5">
        <input
          type="text"
          name="title"
          className="form-control mb-3"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          className="form-control mb-3"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="image"
          className="form-control mb-3"
          placeholder="Project Image URL"
          value={formData.image}
          onChange={handleInputChange}
        />
        <button
          onClick={formData.isEditing ? () => updateProject(formData.editId) : addProject}
          className={`btn ${formData.isEditing ? "btn-success" : "btn-primary"}`}
        >
          {formData.isEditing ? "Update Project" : "Add Project"}
        </button>
        {formData.isEditing && (
          <button onClick={resetForm} className="btn btn-secondary ml-3">
            Cancel
          </button>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
