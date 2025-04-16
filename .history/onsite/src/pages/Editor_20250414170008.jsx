import ComponentEditor from '../components/Editor/ComponentEditor';
import LivePreview from '../components/Preview/LivePreview';
import GoogleLogin from '../components/Auth/GoogleLogin';
import { useAuth0 } from '@auth0/auth0-react';
import './Editor.css';

const Editor = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="editor-container">
      <header className="editor-header">
        <div className="logo">
          <h1>Onsite</h1>
          <span>Visual Editor</span>
        </div>
        <GoogleLogin />
      </header>
      <main className="editor-main">
        {!isAuthenticated ? (
          <section className="login-prompt">
            <h2>Login Diperlukan</h2>
            <p>Harap login untuk mengakses editor visual dan mengedit komponen Anda.</p>
            <GoogleLogin />
          </section>
        ) : (
          <section className="editor-section">
            <div className="card editor-card">
              <h3>Editor Komponen</h3>
              <ComponentEditor />
            </div>
            <div className="card preview-card">
              <h3>Pratinjau Langsung</h3>
              <LivePreview />
            </div>
          </section>
        )}
      </main>
      <footer className="editor-footer">
        <p>© 2025 Onsite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Editor;