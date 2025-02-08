import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/productos.css"
import "../styles/global.css";
function Productos() {
    const [productos, setProductos] = useState([]);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [productoId, setProductoId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const API_URL = "http://localhost:5001/api/productos"; // 📌 Cambia esto si usas otro dominio en producción

    // 📌 Obtener productos al cargar la página
    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const res = await axios.get(API_URL);
            setProductos(res.data);
        } catch (error) {
            console.error("❌ Error al obtener productos:", error);
        }
    };

    // 📌 Agregar o editar un producto
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { nombre, precio_kg: precio, categoria };

            if (productoId) {
                // 📌 Editar producto
                await axios.put(`${API_URL}/${productoId}`, data);
            } else {
                // 📌 Agregar nuevo producto
                await axios.post(API_URL, data);
            }

            fetchProductos();
            setModalOpen(false);
            setNombre("");
            setPrecio("");
            setCategoria("");
            setProductoId(null);
        } catch (error) {
            console.error("❌ Error al guardar el producto:", error);
        }
    };

    // 📌 Llenar formulario con datos para editar
    const handleEdit = (producto) => {
        setNombre(producto.nombre);
        setPrecio(producto.precio_kg);
        setCategoria(producto.categoria);
        setProductoId(producto.id);
        setModalOpen(true);
    };

    // 📌 Eliminar producto
    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchProductos();
            } catch (error) {
                console.error("❌ Error al eliminar el producto:", error);
            }
        }
    };

    return (
        <div className="productos-container">
            <h2>📦 Gestión de Productos</h2>
            <button onClick={() => setModalOpen(true)}>➕ Agregar Producto</button>

            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio/kg</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <td>{producto.nombre}</td>
                            <td>{producto.precio_kg} Bs</td>
                            <td>{producto.categoria}</td>
                            <td>
                                <button onClick={() => handleEdit(producto)}>✏️ Editar</button>
                                <button onClick={() => handleDelete(producto.id)}>🗑 Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 📌 Modal para agregar/editar producto */}
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{productoId ? "Editar Producto" : "Agregar Producto"}</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            <input type="number" placeholder="Precio por kg" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
                            <input type="text" placeholder="Categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
                            <button type="submit">{productoId ? "Actualizar" : "Agregar"}</button>
                        </form>
                        <button onClick={() => setModalOpen(false)}>❌ Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Productos;
