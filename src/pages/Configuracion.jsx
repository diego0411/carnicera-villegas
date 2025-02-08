import { useEffect, useState } from "react";
import { Typography, Container, TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import api from "../services/api";
import "../styles/global.css";
const Configuracion = () => {
  const [precios, setPrecios] = useState([]);
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchPrecios();
  }, []);

  const fetchPrecios = async () => {
    try {
      const response = await api.get("/config/prices");
      setPrecios(response.data);
    } catch (error) {
      console.error("❌ Error al obtener los precios:", error);
      mostrarNotificacion("❌ Error al obtener precios.", "error");
    }
  };

  const mostrarNotificacion = (mensaje, tipo = "success") => {
    setSnackbar({ open: true, message: mensaje, severity: tipo });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUpdatePrice = async (tipo, precio) => {
    if (!precio || parseFloat(precio) <= 0) {
      mostrarNotificacion("⚠️ El precio debe ser mayor a 0.", "warning");
      return;
    }

    if (!window.confirm(`¿Confirmas actualizar el precio de ${tipo} a ${precio} Bs/kg?`)) {
      return;
    }

    try {
      await api.put("/config/prices", { tipo, precio: parseFloat(precio) });
      fetchPrecios();
      mostrarNotificacion("✅ Precio actualizado con éxito.");
    } catch (error) {
      console.error("❌ Error al actualizar el precio:", error);
      mostrarNotificacion("❌ Error al actualizar el precio.", "error");
    }
  };

  const handleAddMeatType = async () => {
    if (!nuevoTipo.trim() || !nuevoPrecio || parseFloat(nuevoPrecio) <= 0) {
      mostrarNotificacion("⚠️ Ingrese un tipo de carne y un precio válido.", "warning");
      return;
    }

    try {
      await api.post("/config/prices", { tipo: nuevoTipo, precio: parseFloat(nuevoPrecio) });
      setNuevoTipo("");
      setNuevoPrecio("");
      fetchPrecios();
      mostrarNotificacion("✅ Tipo de carne agregado con éxito.");
    } catch (error) {
      console.error("❌ Error al agregar el tipo de carne:", error);
      mostrarNotificacion("❌ Error al agregar el tipo de carne.", "error");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        ⚙️ Configuración de Precios
      </Typography>

      {precios.map((item) => (
        <Box key={item.tipo} sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <Typography sx={{ minWidth: 150, fontWeight: "bold" }}>{item.tipo}:</Typography>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            value={item.precio}
            onChange={(e) => {
              const updatedPrices = precios.map((p) =>
                p.tipo === item.tipo ? { ...p, precio: e.target.value } : p
              );
              setPrecios(updatedPrices);
            }}
            sx={{ width: 100, marginRight: 2 }}
          />
          <Button variant="contained" color="primary" onClick={() => handleUpdatePrice(item.tipo, item.precio)}>
            Guardar
          </Button>
        </Box>
      ))}

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">➕ Agregar Nuevo Tipo de Carne</Typography>
        <TextField
          label="Tipo de carne"
          fullWidth
          variant="outlined"
          value={nuevoTipo}
          onChange={(e) => setNuevoTipo(e.target.value)}
          margin="dense"
        />
        <TextField
          label="Precio (Bs/kg)"
          type="number"
          fullWidth
          variant="outlined"
          value={nuevoPrecio}
          onChange={(e) => setNuevoPrecio(e.target.value)}
          margin="dense"
        />
        <Button variant="contained" color="secondary" sx={{ marginTop: 2 }} onClick={handleAddMeatType}>
          Agregar
        </Button>
      </Box>

      {/* 📌 Notificación emergente (Snackbar) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Configuracion;
