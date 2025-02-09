import { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Box,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import DataTable from "../components/DataTable";
import api from "../services/api";
import "../styles/global.css"

const Proveedores = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 200 },
    { field: "telefono", headerName: "Teléfono", width: 150 },
  ];

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState({ nombre: "", telefono: "" });

  const fetchProveedores = async () => {
    try {
      const response = await api.get("/proveedores");
      if (response?.data && Array.isArray(response.data)) {
        setRows(response.data);
      } else {
        setRows([]);
      }
      setError(false);
    } catch (error) {
      console.error("❌ Error al obtener los proveedores:", error);
      setError(true);
      setRows([]); // Evita que la pantalla quede vacía
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleAddProveedor = async () => {
    if (!nuevoProveedor.nombre || !nuevoProveedor.telefono) {
      alert("⚠️ Completa todos los campos.");
      return;
    }

    try {
      await api.post("/proveedores", nuevoProveedor);
      fetchProveedores(); // Recargar lista de proveedores
      handleClose();
    } catch (error) {
      console.error("❌ Error al agregar el proveedor:", error);
    }
  };

  const handleOpen = () => {
    setNuevoProveedor({ nombre: "", telefono: "" });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        📋 Gestión de Proveedores
      </Typography>

      {/* Botón para agregar proveedor */}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ marginBottom: 2 }}>
        ➕ Agregar Proveedor
      </Button>

      {/* Estado de carga */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ padding: 3, textAlign: "center", backgroundColor: "#ffebee", color: "#d32f2f" }}>
          ❌ No se pudieron cargar los proveedores.<br />
          📌 Asegúrate de que el servidor esté encendido.
        </Paper>
      ) : rows.length === 0 ? (
        <Paper sx={{ padding: 3, textAlign: "center", backgroundColor: "#fffde7", color: "#f57c00" }}>
          ⚠️ No hay proveedores registrados.
        </Paper>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      {/* Modal para agregar proveedor */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Proveedor</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={nuevoProveedor.nombre}
            onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, nombre: e.target.value })}
          />
          <TextField
            label="Teléfono"
            fullWidth
            margin="dense"
            value={nuevoProveedor.telefono}
            onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, telefono: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancelar
          </Button>
          <Button onClick={handleAddProveedor} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Proveedores;
