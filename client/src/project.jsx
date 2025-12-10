// client/src/project.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./api";

export default function Project() {
  // JWT admin check
  const jwtStr = localStorage.getItem("jwt");
  let jwt = null;

  try {
    jwt = jwtStr ? JSON.parse(jwtStr) : null;
  } catch (e) {
    console.error("Failed to parse jwt:", e);
    jwt = null;
  }

  const user = jwt?.user;
  const isAdmin = user?.role === "admin";

  const authHeader =
    jwt && jwt.token
      ? {
          Authorization: `Bearer ${jwt.token}`,
        }
      : {};

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
    image: null, // file
  });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    link: "",
    newImage: null, // optional new file
  });

  // Load projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API_BASE_URL}/api/projects`);
        setProjects(res.data || []);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ----- ADD -----

  const handleAddChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      setError("");

      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("link", formData.link);
      if (formData.image) {
        fd.append("image", formData.image);
      }

      await axios.post(`${API_BASE_URL}/api/projects`, fd, {
        headers: {
          ...authHeader,
          // Content-Type'i axios kendi ayarlıyor (FormData için)
        },
      });

      const res = await axios.get(`${API_BASE_URL}/api/projects`);
      setProjects(res.data || []);

      setFormData({
        name: "",
        description: "",
        link: "",
        image: null,
      });
    } catch (err) {
      console.error("Error creating project:", err);
      const msg = err.response?.data?.error || "Failed to create project.";
      setError(msg);
    }
  };

  // ----- EDIT -----

  const startEdit = (project) => {
    setEditingId(project._id);
    setEditForm({
      name: project.name,
      description: project.description || "",
      link: project.link || "",
      newImage: null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "newImage") {
      setEditForm((prev) => ({
        ...prev,
        newImage: files[0] || null,
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !editingId) return;

    try {
      setError("");

      const fd = new FormData();
      fd.append("name", editForm.name);
      fd.append("description", editForm.description);
      fd.append("link", editForm.link);
      if (editForm.newImage) {
        fd.append("image", editForm.newImage);
      }

      await axios.put(`${API_BASE_URL}/api/projects/${editingId}`, fd, {
        headers: {
          ...authHeader,
        },
      });

      const res = await axios.get(`${API_BASE_URL}/api/projects`);
      setProjects(res.data || []);
      setEditingId(null);
    } catch (err) {
      console.error("Error updating project:", err);
      const msg = err.response?.data?.error || "Failed to update project.";
      setError(msg);
    }
  };

  // ----- DELETE -----

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    const ok = window.confirm("Do you really want to delete this project?");
    if (!ok) return;

    try {
      setError("");
      await axios.delete(`${API_BASE_URL}/api/projects/${id}`, {
        headers: { ...authHeader },
      });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
      const msg = err.response?.data?.error || "Failed to delete project.";
      setError(msg);
    }
  };

  // ----- IMAGE RENDER -----

  const renderImage = (project) => {
    if (!project.imageUrl) return null;

    // DB'de "uploads/..." şeklinde duruyor; backend base URL ile birleştir
    const normalizedPath = project.imageUrl.replace(/^\/+/, "");
    const fullUrl = `${API_BASE_URL}/${normalizedPath}`; // örn: http://localhost:5000/uploads/p1.jpg

    return <img src={fullUrl} alt={project.name || "Project image"} />;
  };

  return (
    <section id="projects" className="page">
      <h2 className="page-title">Projects</h2>

      <p className="page-lead">
        Here are some of the projects I have worked on during my studies. They
        helped me practice web development, problem solving, and working with
        different technologies.
      </p>

      {loading && <p>Loading projects...</p>}
      {error && (
        <p style={{ color: "salmon", marginTop: "0.5rem" }}>{error}</p>
      )}

      <div className="project-list">
        {projects.length === 0 && !loading && (
          <p style={{ color: "#ccc" }}>
            No projects yet. (Admin can add from below.)
          </p>
        )}

        {projects.map((project) => {
          const isEditing = editingId === project._id;

          // NORMAL CARD
          if (!isEditing) {
            return (
              <div className="project-card" key={project._id}>
                {renderImage(project)}
                <h3>{project.name}</h3>
                {project.description && <p>{project.description}</p>}

                {project.link && (
                  <p style={{ marginTop: "0.8rem" }}>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--accent)",
                        textDecoration: "underline",
                      }}
                    >
                      🔗 View Project
                    </a>
                  </p>
                )}

                {isAdmin && (
                  <div
                    style={{
                      marginTop: "0.8rem",
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      className="btn"
                      onClick={() => startEdit(project)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // EDIT CARD (ADMIN)
          return (
            <div className="project-card" key={project._id}>
              <h3>Edit Project</h3>
              <form className="contact-form" onSubmit={handleEditSubmit}>
                <div className="form-row">
                  <label>Project Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-row">
                  <label>
                    Description{" "}
                    <span style={{ fontSize: "0.85rem", color: "#888" }}>
                      (optional)
                    </span>
                  </label>
                </div>
                <textarea
                  name="description"
                  rows="3"
                  value={editForm.description}
                  onChange={handleEditChange}
                />

                <div className="form-row">
                  <label>
                    Project Link{" "}
                    <span style={{ fontSize: "0.85rem", color: "#888" }}>
                      (optional)
                    </span>
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={editForm.link}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-row">
                  <label>
                    New Image{" "}
                    <span style={{ fontSize: "0.85rem", color: "#888" }}>
                      (optional – upload to change)
                    </span>
                  </label>
                  <input
                    type="file"
                    name="newImage"
                    accept="image/*"
                    onChange={handleEditChange}
                  />
                </div>

                <div
                  style={{
                    marginTop: "0.8rem",
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <button type="submit" className="btn contact-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          );
        })}
      </div>

      {/* Admin add form */}
      {isAdmin && (
        <>
          <h3 style={{ marginTop: "2.5rem", marginBottom: "0.8rem" }}>
            Add Project (Admin)
          </h3>
          <form className="contact-form" onSubmit={handleAddSubmit}>
            <div className="form-row">
              <label>Project Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleAddChange}
              />
            </div>

            <div className="form-row">
              <label>
                Description{" "}
                <span style={{ fontSize: "0.85rem", color: "#888" }}>
                  (optional)
                </span>
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleAddChange}
              />
            </div>

            <div className="form-row">
              <label>
                Project Link{" "}
                <span style={{ fontSize: "0.85rem", color: "#888" }}>
                  (optional)
                </span>
              </label>
              <input
                type="url"
                name="link"
                placeholder=" Add your project link here"
                value={formData.link}
                onChange={handleAddChange}
              />
            </div>

            <div className="form-row">
              <label>Image (from your PC)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                onChange={handleAddChange}
              />
            </div>

            <button type="submit" className="btn contact-btn">
              Add Project
            </button>
          </form>
        </>
      )}
    </section>
  );
}
