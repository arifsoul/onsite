import React from 'react';
import NavMenu from '../components/Navigation/NavMenu';
import { FaCheckCircle, FaStar, FaBuilding } from 'react-icons/fa';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-page">
      <header className="home-header">
        <NavMenu />
      </header>
      <main className="pricing-main">
        <div className="pricing-header">
          <h1>Paket Harga yang Fleksibel</h1>
          <p>Pilih paket yang sesuai dengan kebutuhan Anda dan mulailah membangun lebih cepat.</p>
        </div>
        <div className="pricing-cards">
          <div className="pricing-card">
            <FaCheckCircle className="card-icon" />
            <h2>Starter</h2>
            <div className="price">Gratis</div>
            <ul>
              <li><FaCheckCircle className="feature-icon" /> 5 Proyek</li>
              <li><FaCheckCircle className="feature-icon" /> Komponen Dasar</li>
              <li><FaCheckCircle className="feature-icon" /> Dukungan Komunitas</li>
            </ul>
            <button className="cta-button">Mulai Sekarang</button>
          </div>

          <div className="pricing-card popular">
            <div className="popular-badge">Paling Populer</div>
            <FaStar className="card-icon popular-icon" />
            <h2>Pro</h2>
            <div className="price">$29<span>/bulan</span></div>
            <ul>
              <li><FaCheckCircle className="feature-icon" /> Proyek Tanpa Batas</li>
              <li><FaCheckCircle className="feature-icon" /> Pustaka Komponen Lengkap</li>
              <li><FaCheckCircle className="feature-icon" /> AI Code Generation</li>
              <li><FaCheckCircle className="feature-icon" /> Dukungan Prioritas</li>
            </ul>
            <button className="cta-button">Tingkatkan ke Pro</button>
          </div>

          <div className="pricing-card">
            <FaBuilding className="card-icon" />
            <h2>Enterprise</h2>
            <div className="price">Kustom</div>
            <ul>
              <li><FaCheckCircle className="feature-icon" /> Dukungan Khusus</li>
              <li><FaCheckCircle className="feature-icon" /> Kolaborasi Tim</li>
              <li><FaCheckCircle className="feature-icon" /> Keamanan & SSO</li>
            </ul>
            <button className="cta-button">Hubungi Sales</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;