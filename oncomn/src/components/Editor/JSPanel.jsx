const JSPanel = ({ js, onChange }) => {
    const handleActionChange = (e) => {
      const action = e.target.value;
      onChange(`() => ${action}`);
    };
  
    return (
      <div className="js-panel">
        <h3>Edit JS</h3>
        <select onChange={handleActionChange}>
          <option value="">Pilih Aksi</option>
          <option value="alert('Hello!')">Tampilkan Alert</option>
          <option value="console.log('Clicked!')">Log ke Console</option>
          {/* Tambahkan aksi JS lain sesuai kebutuhan */}
        </select>
      </div>
    );
  };
  
  export default JSPanel;