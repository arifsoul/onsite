import { useCode } from '../../context/CodeContext';
import Draggable from 'react-draggable';
import CSSPanel from './CSSPanel';
import JSPanel from './JSPanel';
import './ComponentEditor.css';

const ComponentEditor = () => {
  const { components, updateComponent } = useCode();

  const handleStyleChange = (id, property, value) => {
    updateComponent(id, { styles: { [property]: value } });
  };

  const handleJSChange = (id, jsCode) => {
    updateComponent(id, { js: jsCode });
  };

  return (
    <div className="editor-container">
      {components.map((comp) => (
        <Draggable key={comp.id}>
          <div className="component-wrapper">
            <div dangerouslySetInnerHTML={{ __html: comp.html }} />
            <CSSPanel
              styles={comp.styles}
              onChange={(prop, val) => handleStyleChange(comp.id, prop, val)}
            />
            <JSPanel
              js={comp.js}
              onChange={(code) => handleJSChange(comp.id, code)}
            />
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default ComponentEditor;