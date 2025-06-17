const ChatModal = ({ title, firstName, lastName, setFirstName, setLastName, onSubmit, onClose }) => (
  <div className="modal-backdrop">
    <div className="modal-content p-4 bg-white rounded shadow">
      <h4>{title}</h4>
      <input
        className="form-control my-4 fs-5"
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        className="form-control my-2 fs-5"
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <div className="d-flex justify-content-around mt-3">
        <button className="btn btn-secondary col-5 fs-5" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary col-5 fs-5" onClick={onSubmit}>
          {title === 'Edit Chat' ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  </div>
);

export default ChatModal;
