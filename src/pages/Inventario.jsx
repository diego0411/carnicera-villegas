import { useEffect, useState } from "react";
import { Typography, Container, Button, Box } from "@mui/material";
import DataTable from "../components/DataTable";
import FormularioProducto from "../components/FormularioProducto";
import api from "../services/api";
import "../styles/global.css";
const Inventario = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Producto", width: 150 },
    { field: "stock_kg", headerName: "Stock (kg)", width: 120 },
    { field: "precio_kg", headerName: "Precio (Bs/kg)", width: 120 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ marginRight: 1 }}
          >
            ✏️ Editar
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            🗑 Eliminar
          </Button>
        </>
      ),
    },
  ];

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [productoActual, setProductoActual] = useState(null);

  // 📌 Obtener productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await api.get("/inventory");
      setRows(response.data);
    } catch (error) {
      console.error("❌ Error al obtener los productos", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleOpen = () => {
    setProductoActual(null); // 📌 Reiniciar el formulario para agregar
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // 📌 Agregar un producto nuevo
  const agregarProducto = async (producto) => {
    try {
      const response = await api.post("/inventory", {
        nombre: producto.nombre,
        stock_kg: parseFloat(producto.stock),
        precio_kg: parseFloat(producto.precio),
      });

      setRows((prevRows) => [...prevRows, response.data]); // 📌 Actualizar sin recargar toda la tabla
      handleClose();
    } catch (error) {
      console.error("❌ Error al agregar el producto", error.response?.data || error);
    }
  };

  // 📌 Editar un producto existente
  const editarProducto = async (producto) => {
    try {
      await api.put(`/inventory/${producto.id}`, {
        nombre: producto.nombre,
        stock_kg: parseFloat(producto.stock),
        precio_kg: parseFloat(producto.precio),
      });

      setRows((prevRows) =>
        prevRows.map((row) => (row.id === producto.id ? { ...row, ...producto } : row))
      ); // 📌 Actualizar en tiempo real
      handleClose();
    } catch (error) {
      console.error("❌ Error al editar el producto", error.response?.data || error);
    }
  };

  // 📌 Eliminar un producto del inventario
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      try {
        await api.delete(`/inventory/${id}`);
        setRows((prevRows) => prevRows.filter((row) => row.id !== id)); // 📌 Eliminar en tiempo real
      } catch (error) {
        console.error("❌ Error al eliminar el producto", error.response?.data || error);
      }
    }
  };

  return (
    <Box sx={{ marginLeft: 2, marginRight: 2, marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        🥩 Inventario de Carnicería (kg)
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        ➕ Agregar Producto
      </Button>
      <Box sx={{ marginTop: 2 }}>
        <DataTable columns={columns} rows={rows} />
      </Box>
      <FormularioProducto
        open={open}
        handleClose={handleClose}
        agregarProducto={agregarProducto}
        editarProducto={editarProducto}
        productoActual={productoActual}
      />
    </Box>
  );
};

export default Inventario;
