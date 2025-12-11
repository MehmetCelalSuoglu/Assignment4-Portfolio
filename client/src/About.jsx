import React from 'react';
import myPhoto from "./assets/MCelalS.jpeg";
import "./index.css";

export default function About() {
  return (
    <section id="about" className="page">
      <h2 className="page-title">About Me</h2>

      <div className="about-container">
        <img src={myPhoto} alt="Mehmet Celal Suoğlu" className="about-photo" />

        <div className="about-text">
          <p className="page-lead">
            My name is <strong>Mehmet Celal Suoglu</strong>. I am a Software Engineering Technician student
            at Centennial College with a Bachelor's degree in Econometrics from Akdeniz University.
          </p>
          <br></br>

          <p>
            I enjoy learning about web development, building React applications, and working with databases
            like MongoDB and Oracle SQL. My background in econometrics helps me think analytically and solve
            real-world problems using data and software.
          </p>

          <p style={{ marginTop: "20px", color: "#9fb3c8" }}>
            This paragraph was added as part of the CI/CD demonstration for COMP229 Assignment 4.
          </p>
        </div>
      </div>
    </section>
  );
}