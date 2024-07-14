import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import TableAdd from "./TableAdd";
import TableEdit from "./TableEdit";
import { FaEdit, FaFilter, FaPlus, FaSort, FaTrash } from "react-icons/fa";

const Table = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [colaboradores, setColaboradores] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [colaboradorToDelete, setColaboradorToDelete] = useState(null);
  const [filters, setFilters] = useState({
    Nombre: false,
    Correo: false,
    Área: false,
    Teléfono: false,
    Activo: false,
    Sueldo: false,
  });
  const filterRef = useRef(null);

  const toggleOrder = () => {
    if (isFilterOpen) {
      setIsFilterOpen(false);
    }
    setIsOrderOpen(!isOrderOpen);
  };
  const formatCurrency = (number) => {
    // Convertir a número en caso de que sea un string
    const numericValue =
      typeof number === "string" ? parseFloat(number) : number;
    if (isNaN(numericValue)) return number; // Devuelve el valor original si no es un número válido
    return numericValue.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });
  };

  const fetchColaboradores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/colaboradores");
      setColaboradores(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchColaboradores();
  }, []);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    fetchColaboradores(); // Actualizar la lista de colaboradores
  };
  const addColaborador = async (newColaborador) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/colaboradores",
        newColaborador
      );
      setColaboradores([...colaboradores, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding collaborator:", error);
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const getButtonClass = (buttonName) => {
    const baseClass =
      "p-3 rounded-full flex items-center justify-center focus:outline-none text-white";
    const activeClass = "bg-green-500 hover:bg-green-600";
    const inactiveClass = "bg-blue-500 hover:bg-blue-600";

    if (buttonName === "add") {
      return `${baseClass} ${isModalOpen ? activeClass : inactiveClass}`;
    } else if (buttonName === "filter") {
      return `${baseClass} ${isFilterOpen ? activeClass : inactiveClass}`;
    } else if (buttonName === "order") {
      return `${baseClass} ${isOrderOpen ? activeClass : inactiveClass}`;
    }
    return baseClass;
  };

  const toggleFilter = () => {
    if (isOrderOpen) {
      setIsOrderOpen(false);
    }
    setIsFilterOpen(!isFilterOpen);
  };

  const openAddModal = () => {
    setModalContent(<TableAdd onAddColaborador={addColaborador} />);
    setIsModalOpen(true);
  };
  const handleDeleteClick = (colaborador) => {
    setColaboradorToDelete(colaborador);
    setIsConfirmModalOpen(true);
  };
  const sortedColaboradores = colaboradores.slice().sort((a, b) => {
    if (sortOrder === "asc") {
      return a.Nombre.localeCompare(b.Nombre);
    } else {
      return b.Nombre.localeCompare(a.Nombre);
    }
  });
  const filteredColaboradores = sortedColaboradores.filter((colaborador) =>
    searchQuery.length < 3
      ? true
      : colaborador.Nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/colaboradores/${colaboradorToDelete.id}`
      );
      setColaboradores((prevColaboradores) =>
        prevColaboradores.filter(
          (colaborador) => colaborador.id !== colaboradorToDelete.id
        )
      );
      setIsConfirmModalOpen(false);
      setColaboradorToDelete(null);
    } catch (error) {
      console.error("Error deleting collaborator:", error);
    }
  };

  const cancelDelete = () => {
    setIsConfirmModalOpen(false);
    setColaboradorToDelete(null);
  };
  const handleFilterClick = (key) => {
    if (key === "Sin filtro") {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(key);
    }
    setIsFilterOpen(false); // Cerrar el menú de filtro después de seleccionar un filtro
  };

  const openEditModal = (colaboradorId) => {
    setModalContent(
      <TableEdit
        colaboradorId={colaboradorId}
        onEditColaborador={handleEditColaborador}
      />
    );
    setIsModalOpen(true);
  };
  const handleEditColaborador = (updatedColaborador) => {
    setColaboradores((prevColaboradores) =>
      prevColaboradores.map((colaborador) =>
        colaborador.id === updatedColaborador.id
          ? updatedColaborador
          : colaborador
      )
    );
    setIsModalOpen(false);
  };

  const handleOrderClick = (orderType) => {
    if (orderType === "asc" || orderType === "desc") {
      setSortOrder(orderType);
      setIsOrderOpen(false); // Cerrar el menú de ordenamiento después de seleccionar
    }
  };
  const getFilterLabelClass = (filterName) => {
    return `block text-gray-700 cursor-pointer ${
      selectedFilter === filterName ? "font-bold" : ""
    }`;
  };
  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="grid md:grid-cols-2 items-center align-middle mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-center md:text-justify">
          Colaboradores
        </h1>
        <div className="flex justify-end align-middle space-x-2 mt-[10px] relative md:mt-auto">
          <input
            type="text"
            placeholder="Buscar"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={openAddModal}
            disabled={colaboradores.length <= 1}
            className={getButtonClass("add")}
          >
            <FaPlus />
          </button>
          <button
            onClick={toggleFilter}
            disabled={colaboradores.length <= 1}
            className={getButtonClass("filter")}
          >
            <FaFilter />
            {isFilterOpen && (
              <div
                ref={filterRef}
                className="absolute top-full right-0 mt-2 bg-gray-100 p-4 rounded-lg shadow-lg z-10"
              >
                <div className="mb-2">
                  <label
                    className={`block text-gray-700 cursor-pointer ${
                      selectedFilter === null ? "font-bold" : ""
                    }`}
                    onClick={() => handleFilterClick("Sin filtro")}
                  >
                    Sin filtro
                  </label>
                </div>
                {Object.keys(filters).map((key) => (
                  <div key={key}>
                    <label
                      className={getFilterLabelClass(key)}
                      onClick={() => handleFilterClick(key)}
                    >
                      {key}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </button>
          <button
            onClick={toggleOrder}
            disabled={colaboradores.length <= 1}
            className={getButtonClass("order")}
          >
            <FaSort />
            {isOrderOpen && (
              <div
                className="absolute top-full right-0 mt-2 bg-gray-100 p-4 rounded-lg shadow-lg z-10"
                style={{ minWidth: "100px" }}
              >
                <div className="mb-2">
                  <label
                    className={`block text-gray-700 cursor-pointer ${
                      sortOrder === "asc" ? "font-bold" : ""
                    }`}
                    onClick={() => handleOrderClick("asc")}
                  >
                    Ascendente
                  </label>
                </div>
                <div className="mb-2">
                  <label
                    className={`block text-gray-700 cursor-pointer ${
                      sortOrder === "desc" ? "font-bold" : ""
                    }`}
                    onClick={() => handleOrderClick("desc")}
                  >
                    Descendente
                  </label>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-gray-800">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4">ID</th>
            {!selectedFilter && (
              <>
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Correo</th>
                <th className="py-2 px-4">Área</th>
                <th className="py-2 px-4">Teléfono</th>
                <th className="py-2 px-4">Activo</th>
                <th className="py-2 px-4">Sueldo</th>
                <th className="py-2 px-4">Acciones</th>
              </>
            )}
            {selectedFilter && (
              <>
                {selectedFilter === "Nombre" && (
                  <th className="py-2 px-4">Nombre</th>
                )}
                {selectedFilter === "Correo" && (
                  <>
                    <th className="py-2 px-4">Nombre</th>

                    <th className="py-2 px-4">Correo</th>
                  </>
                )}
                {selectedFilter === "Área" && (
                  <>
                    <th className="py-2 px-4">Nombre</th>

                    <th className="py-2 px-4">Área</th>
                  </>
                )}
                {selectedFilter === "Teléfono" && (
                  <>
                    <th className="py-2 px-4">Nombre</th>
                    <th className="py-2 px-4">Teléfono</th>
                  </>
                )}
                {selectedFilter === "Activo" && (
                  <>
                    <th className="py-2 px-4">Nombre</th>
                    <th className="py-2 px-4">Activo</th>
                  </>
                )}
                {selectedFilter === "Sueldo" && (
                  <>
                    <th className="py-2 px-4">Nombre</th>
                    <th className="py-2 px-4">Sueldo</th>
                  </>
                )}
                <th className="py-2 px-4">Acciones</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredColaboradores.length > 0 ? (
            filteredColaboradores.map((colaborador) => (
              <tr key={colaborador.id}>
                <td className="py-2 px-4">{colaborador.id}</td>
                {!selectedFilter && (
                  <>
                    <td className="py-2 px-4">{colaborador.Nombre}</td>
                    <td className="py-2 px-4">{colaborador.Correo}</td>
                    <td className="py-2 px-4">{colaborador.Área}</td>
                    <td className="py-2 px-4">{colaborador.Teléfono}</td>
                    <td className="py-2 px-4">
                      {colaborador.Activo ? "Sí" : "No"}
                    </td>
                    <td className="py-2 px-4">
                      {formatCurrency(colaborador.Sueldo)}
                    </td>
                    <td className="py-2 px-4 space-x-4 flex justify-around">
                      <button
                        onClick={openAddModal}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 space-x-2 rounded-md"
                      >
                        <FaPlus />
                      </button>
                      <button
                        onClick={() => openEditModal(colaborador.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 space-x-2 ml-2 rounded-md"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(colaborador)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 space-x-2 rounded-md ml-2"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </>
                )}
                {selectedFilter && (
                  <>
                    {selectedFilter === "Nombre" && (
                      <td className="py-2 px-4">{colaborador.Nombre}</td>
                    )}
                    {selectedFilter === "Correo" && (
                      <>
                        <td className="py-2 px-4">{colaborador.Nombre}</td>
                        <td className="py-2 px-4">{colaborador.Correo}</td>
                      </>
                    )}
                    {selectedFilter === "Área" && (
                      <>
                        <td className="py-2 px-4">{colaborador.Nombre}</td>
                        <td className="py-2 px-4">{colaborador.Área}</td>
                      </>
                    )}
                    {selectedFilter === "Teléfono" && (
                      <>
                        <td className="py-2 px-4">{colaborador.Nombre}</td>
                        <td className="py-2 px-4">{colaborador.Teléfono}</td>
                      </>
                    )}
                    {selectedFilter === "Activo" && (
                      <>
                        <td className="py-2 px-4">{colaborador.Nombre}</td>

                        <td className="py-2 px-4">
                          {colaborador.Activo ? "Sí" : "No"}
                        </td>
                      </>
                    )}
                    {selectedFilter === "Sueldo" && (
                      <>
                        <td className="py-2 px-4">{colaborador.Nombre}</td>
                        <td className="py-2 px-4">
                          {formatCurrency(colaborador.Sueldo)}
                        </td>
                      </>
                    )}

                    <td className="py-2 px-4 space-x-4 flex justify-around">
                      <button
                        onClick={openAddModal}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 space-x-2 rounded-md"
                      >
                        <FaPlus />
                      </button>
                      <button
                        onClick={() => openEditModal(colaborador.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 space-x-2 ml-2 rounded-md"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(colaborador)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 space-x-2 rounded-md ml-2"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-black p-4 rounded-lg shadow-lg">
            {modalContent}
            <button
              className="absolute top-0 right-0 p-2 mt-2 mr-2 text-xl text-white"
              onClick={toggleModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black p-4 rounded-lg max-w-md mx-auto shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
            <p>
              ¿Estás seguro de que deseas eliminar a{" "}
              {colaboradorToDelete?.Nombre}?
            </p>
            <div className="flex justify-end mt-4 ">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Eliminar
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
