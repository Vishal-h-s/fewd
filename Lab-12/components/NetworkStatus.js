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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className={`alert ${isOnline ? 'alert-success' : 'alert-danger'} rounded-4 shadow-sm p-4 text-center mb-4`}>
            <div className="d-flex flex-column align-items-center justify-content-center">
              <div className="my-auto">
                {isOnline ? (
                  <i className="bi bi-wifi text-success fs-2"></i>
                ) : (
                  <i className="bi bi-wifi-off text-danger fs-2"></i>
                )}
              </div>
              <div>
                <strong>Network Status:</strong> {isOnline ? "You are Online" : "You are Offline"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
