import React from 'react';

function Hero() {
  return (
    <div className="hero">
      <div className="hero-box">
        <h1 className="hero-primary-heading">
          Discover the ideal driver through Sarathi.
        </h1>
        <div className="hero-description">
          Discover seamless transportation solutions with our driver hiring app.
          Effortlessly connect with skilled and reliable drivers to meet your
          travel needs. Our user-friendly platform ensures a quick and secure
          hiring process, providing you with a convenient and efficient way to
          find the perfect driver for a safe.
        </div>
        <div className="hero-btn">
          <a href="/signup" className="btn-hero btn-hire_driver">
            Hire Driver
          </a>
          <a href="/" className="btn-hero btn-learn">
            Learn More
          </a>
        </div>
      </div>
      <div className="hero-img-container">
        <img src="./img/hero.webp" alt="img" className="hero-img" />
      </div>
    </div>
  );
}

export default Hero;
