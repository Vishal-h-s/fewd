function NetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <div style={{ padding: '1rem', background: isOnline ? '#d4edda' : '#f8d7da', color: isOnline ? '#155724' : '#721c24', borderRadius: '5px' }}>
      <strong>Status:</strong> {isOnline ? "You are Online ✅" : "You are Offline ❌"}
    </div>
  );
}
