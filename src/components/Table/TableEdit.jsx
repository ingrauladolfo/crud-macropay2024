import React, { useState, useEffect } from "react";
import axios from "axios";

const TableEdit = ({ colaboradorId, onEditColaborador }) => {
  const [formData, setFormData] = useState({
    Nombre: "",
    Correo: "",
    Área: "",
    Teléfono: "",
    Activo: false,
    Sueldo: 0.0,
  });

  useEffect(() => {
    const fetchColaborador = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/colaboradores/${colaboradorId}`
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching collaborator:", error);
      }
    };

    fetchColaborador();
  }, [colaboradorId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:3000/colaboradores/${colaboradorId}`,
        formData
      );
      onEditColaborador(response.data); // Actualizar la lista de colaboradores
    } catch (error) {
      console.error("Error editing collaborator:", error);
    }
  };

  return (
    <form className="p-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Editar Colaborador</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Nombre</label>
        <input
          type="text"
          name="Nombre"
          value={formData.Nombre}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Correo</label>
        <input
          type="email"
          name="Correo"
          value={formData.Correo}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Área</label>
        <input
          type="text"
          name="Área"
          value={formData.Área}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Teléfono</label>
        <input
          type="text"
          name="Teléfono"
          value={formData.Teléfono}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Activo</label>
        <input
          type="checkbox"
          name="Activo"
          checked={formData.Activo}
          onChange={handleInputChange}
          className="form-checkbox mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Sueldo</label>
        <input
          type="number"
          name="Sueldo"
          value={formData.Sueldo}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
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
    </form>
  );
};

export default TableEdit;
