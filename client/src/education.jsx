// client/src/education.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./api";

export default function Education() {
  //  JWT admin check
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

  const authConfig =
    jwt && jwt.token
      ? {
          headers: { Authorization: `Bearer ${jwt.token}` },
        }
      : {};

  // Dynamic education list (MongoDB)
  const [dynamicEdu, setDynamicEdu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state (admin add education form)
  const [formData, setFormData] = useState({
    institution: "",
    program: "",
    years: "",
    description: "",
  });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    institution: "",
    program: "",
    years: "",
    description: "",
  });

  // get education from backend
  useEffect(() => {
    const fetchEducations = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API_BASE_URL}/api/qualifications`);
        setDynamicEdu(res.data || []);
      } catch (err) {
        console.error("Error loading education:", err);
        setError("Failed to load education data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      setError("");
      await axios.post(
        `${API_BASE_URL}/api/qualifications`,
        formData,
        authConfig
      );

      const res = await axios.get(`${API_BASE_URL}/api/qualifications`);
      setDynamicEdu(res.data || []);

      setFormData({
        institution: "",
        program: "",
        years: "",
        description: "",
      });
    } catch (err) {
      console.error("Error creating education:", err);
      const msg = err.response?.data?.error || "Failed to create education.";
      setError(msg);
    }
  };

  // --- EDIT / DELETE ---

  const startEdit = (edu) => {
    setEditingId(edu._id);
    setEditForm({
      institution: edu.institution,
      program: edu.program,
      years: edu.years,
      description: edu.description,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !editingId) return;

    try {
      setError("");
      await axios.put(
        `${API_BASE_URL}/api/qualifications/${editingId}`,
        editForm,
        authConfig
      );

      const res = await axios.get(`${API_BASE_URL}/api/qualifications`);
      setDynamicEdu(res.data || []);
      setEditingId(null);
    } catch (err) {
      console.error("Error updating education:", err);
      const msg = err.response?.data?.error || "Failed to update education.";
      setError(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    const ok = window.confirm("Do you really want to delete this education?");
    if (!ok) return;

    try {
      setError("");
      await axios.delete(
        `${API_BASE_URL}/api/qualifications/${id}`,
        authConfig
      );
      setDynamicEdu((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error deleting education:", err);
      const msg = err.response?.data?.error || "Failed to delete education.";
      setError(msg);
    }
  };

  return (
    <section className="page">
      <h2 className="page-title">Education</h2>

      {loading && <p>Loading education...</p>}
      {error && (
        <p style={{ color: "salmon", marginTop: "0.5rem" }}>{error}</p>
      )}

      <div className="edu-wrapper">
        {dynamicEdu.length === 0 && !loading && (
          <p style={{ color: "#ccc" }}>
            No education records yet. (Admin can add from below.)
          </p>
        )}

        {dynamicEdu.map((edu) => {
          const isEditing = editingId === edu._id;

          // NORMAL CARD
          if (!isEditing) {
            return (
              <div className="edu-card-full" key={edu._id}>
                <h3>{edu.institution}</h3>
                <p>
                  <strong>Program:</strong> {edu.program}
                </p>
                <p>
                  <strong>Years:</strong> {edu.years}
                </p>
                <p className="edu-desc">{edu.description}</p>

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
                      onClick={() => startEdit(edu)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleDelete(edu._id)}
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
            <div className="edu-card-full" key={edu._id}>
              <h3>Edit Education</h3>
              <form className="contact-form" onSubmit={handleEditSubmit}>
                <div className="form-row">
                  <label>Institution</label>
                  <input
                    type="text"
                    name="institution"
                    required
                    value={editForm.institution}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-row">
                  <label>Program</label>
                  <input
                    type="text"
                    name="program"
                    required
                    value={editForm.program}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-row">
                  <label>Years</label>
                  <input
                    type="text"
                    name="years"
                    required
                    value={editForm.years}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-row">
                  <label>Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    required
                    value={editForm.description}
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

      {/* Only for admin (add form) */}
      {isAdmin && (
        <>
          <h3 style={{ marginTop: "2.5rem", marginBottom: "0.8rem" }}>
            Add Education (Admin)
          </h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Institution </label>
              <input
                type="text"
                name="institution"
                required
                value={formData.institution}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Program</label>
              <input
                type="text"
                name="program"
                required
                value={formData.program}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Years</label>
              <input
                type="text"
                name="years"
                required
                placeholder="e.g. 2024 – Present"
                value={formData.years}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Description</label>
              <textarea
                name="description"
                rows="3"
                required
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn contact-btn">
              Add Education
            </button>
          </form>
        </>
      )}
    </section>
  );
}
