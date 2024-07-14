import React from "react";

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded justify-center align-middle">
        {children}
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default Modal;
