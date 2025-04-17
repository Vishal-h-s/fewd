const MyComponent = ({ first, second, ...rest }) => {
    const filteredEntries = Object.entries(rest).slice(2); // Ignore first two of rest
  
    return (
      <div>
        {filteredEntries.map(([key, value]) => (
          <p key={key}>
            {key}: {value}
          </p>
        ))}
      </div>
    );
  };
  
  const App = () => {
    return (
      <MyComponent first="A" second="B" third="C" fourth="D" last="E" />
    );
  };
  
  // Render React Component into #root
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
  