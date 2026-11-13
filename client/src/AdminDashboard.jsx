import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

const emptyForm = {
  title: "",
  firstname: "",
  lastname: "",
  email: "",
  completionDate: "",
  description: ""
};

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  async function fetchData() {
    try {
      const [projectResponse, qualificationResponse] = await Promise.all([
        fetch(`${API_URL}/api/projects`),
        fetch(`${API_URL}/api/qualifications`)
      ]);

      if (!projectResponse.ok || !qualificationResponse.ok) {
        throw new Error("Could not load dashboard data.");
      }

      setProjects(await projectResponse.json());
      setQualifications(await qualificationResponse.json());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function resetForm() {
    setFormData(emptyForm);
    setEditingId(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const endpoint =
      activeSection === "projects" ? "projects" : "qualifications";

    const url = editingId
      ? `${API_URL}/api/${endpoint}/${editingId}`
      : `${API_URL}/api/${endpoint}`;

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Operation failed.");
      }

      alert(editingId ? "Record updated successfully!" : "Record added successfully!");

      resetForm();
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item) {
    setFormData({
      title: item.title || "",
      firstname: item.firstname || "",
      lastname: item.lastname || "",
      email: item.email || "",
      completionDate: item.completionDate
        ? new Date(item.completionDate).toISOString().split("T")[0]
        : "",
      description: item.description || ""
    });

    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    const endpoint =
      activeSection === "projects" ? "projects" : "qualifications";

    try {
      const response = await fetch(`${API_URL}/api/${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Delete failed.");
      }

      alert("Record deleted successfully!");
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  }

  const items = activeSection === "projects" ? projects : qualifications;

  return (
    <section className="page-section">
      <div className="section-title">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>Admin Dashboard</h1>
        <p>Manage your projects and qualifications.</p>
      </div>

      <div className="button-row">
        <button
          className="button primary"
          onClick={() => {
            setActiveSection("projects");
            resetForm();
          }}
        >
          Manage Projects
        </button>

        <button
          className="button secondary"
          onClick={() => {
            setActiveSection("qualifications");
            resetForm();
          }}
        >
          Manage Qualifications
        </button>
      </div>

      <div className="card" style={{ padding: "25px", marginTop: "25px" }}>
        <h2>
          {editingId ? "Edit" : "Add"}{" "}
          {activeSection === "projects" ? "Project" : "Qualification"}
        </h2>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <div className="form-row">
            <label>
              First Name
              <input
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Last Name
              <input
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Completion Date
            <input
              type="date"
              name="completionDate"
              value={formData.completionDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="button-row">
            <button className="button primary" type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingId
                ? "Update Record"
                : "Add Record"}
            </button>

            {editingId && (
              <button
                className="button secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ marginTop: "35px" }}>
        <h2>
          {activeSection === "projects" ? "Projects" : "Qualifications"}
        </h2>

        <div className="project-grid">
          {items.map((item) => (
            <article className="card" key={item._id} style={{ padding: "20px" }}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>
                <strong>Name:</strong> {item.firstname} {item.lastname}
              </p>
              <p>
                <strong>Email:</strong> {item.email}
              </p>
              <p>
                <strong>Completion Date:</strong>{" "}
                {item.completionDate
                  ? new Date(item.completionDate).toLocaleDateString()
                  : ""}
              </p>

              <div className="button-row">
                <button
                  className="button primary"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>

                <button
                  className="button secondary"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>

        {items.length === 0 && <p>No records found.</p>}
      </div>
    </section>
  );
}

export default AdminDashboard;