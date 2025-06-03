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
    <div>
      <h2>Contact Form</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}

        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}

        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" />
        {errors.message && <div style={{ color: 'red' }}>{errors.message}</div>}

        <button type="submit">Submit</button>
      </form>

      {submittedData && (
        <div>
          <h3>Submitted Data</h3>
          <p>Name: {submittedData.name}</p>
          <p>Email: {submittedData.email}</p>
          <p>Message: {submittedData.message}</p>
        </div>
      )}
    </div>
  );
}
