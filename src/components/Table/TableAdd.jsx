import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Importar uuidv4 para generar ids únicos
import Modal from "../Modal";

const TableAdd = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [area, setArea] = useState("");
  const [telefono, setTelefono] = useState("");
  const [activo, setActivo] = useState(false);
  const [sueldo, setSueldo] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos antes de enviar
    if (!nombre || !correo || !area || !telefono || !sueldo) {
      setShowModal(true);
      return;
    }

    // Generar un id único para el nuevo colaborador
    const id = uuidv4();

    const newColaborador = {
      id, // Agregar el id generado
      Nombre: nombre,
      Correo: correo,
      Área: area,
      Teléfono: telefono,
      Activo: activo,
      Sueldo: `${parseFloat(sueldo).toFixed(2)}`,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/colaboradores",
        newColaborador
      );
      alert("Usuario agregado exitosamente");
      setShowModal(false);

      return response.data; // Llamar a la función onAddColaborador con los datos de respuesta
    } catch (error) {
      console.error("Error adding collaborator:", error);
    }
  };
  {
    /* Modal de advertencia */
  }
  {
    showModal && (
      <Modal onClose={() => setShowModal(false)}>
        <p className="text-lg text-gray-800 mb-2">
          Por favor llena todos los campos antes de guardar.
        </p>
      </Modal>
    );
  }

  return (
    <form className="p-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Agregar Colaborador</h2>
      <div className="mb-4">
        <label className="block text-white">Nombre</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mt-1"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Correo</label>
        <input
          type="email"
          className="w-full p-2 border border-gray-300 rounded mt-1"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Área</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mt-1"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Teléfono</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mt-1"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Activo</label>
        <input
          type="checkbox"
          className="form-checkbox mt-1"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Sueldo</label>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded mt-1"
          value={sueldo}
          onChange={(e) => setSueldo(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>

      {/* Modal de advertencia */}
      {showModal && (
        <div className="fixed inset-0 fleoundems-center justify-center align-middle bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded  justify-center align-middle">
            <p className="text-lg text-gray-800 mb-2">
              Por favor llena todos los campos antes de guardar.
            </p>
            <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={() => setShowModal(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default TableAdd;
