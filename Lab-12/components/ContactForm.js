const { useState } = React;

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.includes('@')) errs.email = "Invalid email";
    if (!message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    } else {
      setErrors({});
      setSubmittedData({ name, email, message });
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow rounded-4">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Contact Form</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input 
                    className={`form-control rounded-3 ${errors.name ? 'is-invalid' : ''}`}
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Name" 
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <input 
                    className={`form-control rounded-3 ${errors.email ? 'is-invalid' : ''}`}
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Email" 
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <textarea 
                    className={`form-control rounded-3 ${errors.message ? 'is-invalid' : ''}`}
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                    placeholder="Message"
                    rows="4"
                  />
                  {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary rounded-3 px-4">Submit</button>
                </div>
              </form>

              {submittedData && (
                <div className="mt-4 p-3 bg-light rounded-3">
                  <h3 className="h5 mb-3">Submitted Data</h3>
                  <p className="mb-2"><strong>Name:</strong> {submittedData.name}</p>
                  <p className="mb-2"><strong>Email:</strong> {submittedData.email}</p>
                  <p className="mb-0"><strong>Message:</strong> {submittedData.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
