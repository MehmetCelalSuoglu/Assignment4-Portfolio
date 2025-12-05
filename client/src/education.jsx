import React from "react";

export default function Education() {
  return (
    <section className="page">
      <h2 className="page-title">Education</h2>

      <div className="edu-wrapper">

        {/* -------- CARD 1 -------- */}
        <div className="edu-card-full">
          <h3>Centennial College</h3>
          <p><strong>Program:</strong> Software Engineering Technician</p>
          <p><strong>Years:</strong> 2024 – Present</p>
          <p className="edu-desc">
            Currently studying software development with a focus on web applications,
            databases, and object-oriented programming using C#, Java, and JavaScript.
          </p>
        </div>

        {/* -------- CARD 2 -------- */}
        <div className="edu-card-full">
          <h3>Akdeniz University</h3>
          <p><strong>Degree:</strong> Bachelor's Degree in Econometrics</p>
          <p><strong>Years:</strong> 2017 – 2023</p>
          <p className="edu-desc">
            Learned strong foundations in statistics, data analysis, and economics,
            focusing on solving real-world problems using quantitative approaches.
          </p>
        </div>

      </div>
    </section>
  );
}
