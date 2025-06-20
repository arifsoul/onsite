const CSSPanel = ({ styles, onChange }) => {
    const handleChange = (e) => {
      onChange(e.target.name, e.target.value);
    };
  
    return (
      <div className="css-panel">
        <h3>Edit CSS</h3>
        <label>
          Background Color:
          <input
            type="color"
            name="backgroundColor"
            value={styles.backgroundColor || '#ffffff'}
            onChange={handleChange}
          />
        </label>
        <label>
          Font Size:
          <input
            type="number"
            name="fontSize"
            value={parseInt(styles.fontSize) || 16}
            onChange={handleChange}
          />
        </label>
        {/* Tambahkan properti CSS lain sesuai kebutuhan */}
      </div>
    );
  };
  
  export default CSSPanel;