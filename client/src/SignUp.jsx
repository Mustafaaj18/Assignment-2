import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Registration failed."
        );
      }

      alert("Your account was created successfully!");
      navigate("/signin");

    } catch (err) {
      setError(err.message || "Could not create your account.");

    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-section narrow">
      <div className="section-title">
        <p className="eyebrow">CREATE ACCOUNT</p>
        <h1>Sign Up</h1>
        <p>Create an account to access the portfolio.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          className="button primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </section>
  );
}

export default SignUp;