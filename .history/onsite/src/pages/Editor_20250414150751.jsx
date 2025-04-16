import ComponentEditor from '../components/Editor/ComponentEditor';
import LivePreview from '../components/Preview/LivePreview';
import GoogleLogin from '../components/Auth/GoogleLogin';
import { useAuth0 } from '@auth0/auth0-react';
import './Editor.css';

const Editor = () => {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <div>Harap login untuk mengakses editor.</div>;
  }

  return (
    <div className="editor-page">
      <header>
        <h1>Editor</h1>
        <GoogleLogin />
      </header>
      <div className="editor-layout">
        <div className="editor-section">
          <ComponentEditor />
        </div>
        <div className="preview-section">
          <LivePreview />
        </div>
      </div>
    </div>
  );
};

export default Editor;