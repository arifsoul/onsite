import React from 'react';
import NavMenu from '../components/Navigation/NavMenu';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <NavMenu />
      <div className="contact-container">
        <h1>Contact Our Team</h1>
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have questions? Our team is here to help!</p>
            <div className="contact-details">
              <div className="contact-item">
                <h3>Email</h3>
                <p>support@onsite.com</p>
              </div>
              <div className="contact-item">
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="contact-item">
                <h3>Office</h3>
                <p>123 Tech Valley Drive</p>
                <p>San Francisco, CA 94107</p>
              </div>
            </div>
          </div>
          
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;