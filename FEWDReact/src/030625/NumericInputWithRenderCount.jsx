import  { useState, useRef, useEffect } from 'react';

const NumericInputWithRenderCount = () => {
  const [value, setValue] = useState('');
  const [dummy, setDummy] = useState(0); // Used to force re-render
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    setDummy((prev) => prev + 1); // Force a re-render to reflect the updated count
  }, [value]); // Trigger when value changes

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setValue(newValue);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      <h2>Numeric Input</h2>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter a number"
        style={{ padding: '8px', fontSize: '16px' }}
      />
      <div style={{ marginTop: '10px' }}>
        <strong>Render Count:</strong> {renderCount.current}
      </div>
    </div>
  );
};

export default NumericInputWithRenderCount;