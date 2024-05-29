import React from "react";

const Toolbar = ({ onBlock, onUnblock, onDelete }) => {
  return (
    <div>
      <button onClick={onBlock} className="btn btn-danger me-2">
        Block
      </button>
      <button onClick={onUnblock} className="btn btn-outline-dark me-2">
        Unblock
      </button>
      <button onClick={onDelete} className="btn btn-outline-dark">
        Delete
      </button>
    </div>
  );
};

export default Toolbar;
