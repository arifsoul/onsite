import React from 'react';
import NavMenu from '../components/Navigation/NavMenu';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <header className="home-header">
        <NavMenu />
      </header>
      <main className="contact-main">
        <div className="contact-header">
          <h1>Hubungi Kami</h1>
          <p>Punya pertanyaan atau butuh bantuan? Tim kami siap membantu Anda.</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <h3>Email</h3>
              <p>support@onsite.com</p>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <h3>Telepon</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <h3>Kantor</h3>
              <p>123 Tech Valley, San Francisco</p>
            </div>
          </div>
          
          <form className="contact-form">
            <h2>Kirim Pesan</h2>
            <div className="form-group">
              <label htmlFor="name">Nama</label>
              <input type="text" id="name" placeholder="Nama lengkap Anda" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="alamat@email.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Pesan</label>
              <textarea id="message" rows="5" placeholder="Tulis pesan Anda di sini..." required></textarea>
            </div>
            <button type="submit" className="submit-button">Kirim Pesan</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Contact;