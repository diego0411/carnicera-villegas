import { useEffect, useState } from "react";
import { Typography, Container, TextField, MenuItem, Button, Box, Snackbar, Alert } from "@mui/material";
import DataTable from "../components/DataTable";
import api from "../services/api";
import "../styles/global.css";
const Ventas = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "producto", headerName: "Producto", width: 150 },
    { field: "cantidad", headerName: "Cantidad (kg)", width: 120 },
    { field: "total", headerName: "Total (Bs)", width: 120 },
  ];

  const [rows, setRows] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [tipo, setTipo] = useState("");
  const [kg, setKg] = useState("");
  const [total, setTotal] = useState(0);
  const [ventas, setVentas] = useState([]);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchPrecios = async () => {
      try {
        const response = await api.get("/config/prices");
        setPrecios(response.data);
      } catch (error) {
        console.error("❌ Error al obtener los precios:", error);
      }
    };

    const fetchVentas = async () => {
      try {
        const response = await api.get("/sales");
        setVentas(response.data);
      } catch (error) {
        console.error("❌ Error al obtener ventas:", error);
      }
    };

    fetchPrecios();
    fetchVentas();
  }, []);

  useEffect(() => {
    const precioUnitario = precios.find((p) => p.tipo === tipo)?.precio || 0;
    setTotal(precioUnitario * (kg ? parseFloat(kg) : 0));
  }, [tipo, kg, precios]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mostrarNotificacion = (mensaje, tipo = "success") => {
    setSnackbar({ open: true, message: mensaje, severity: tipo });
  };

  const registrarVenta = async () => {
    if (!tipo || !kg || total === 0 || parseFloat(kg) <= 0) {
      mostrarNotificacion("⚠️ Selecciona un producto y una cantidad válida.", "warning");
      return;
    }

    const productoSeleccionado = precios.find((p) => p.tipo === tipo);
    if (!productoSeleccionado) {
      mostrarNotificacion("⚠️ Error: Tipo de carne no válido.", "error");
      return;
    }

    if (!window.confirm(`¿Confirmas la venta de ${kg} kg de ${tipo} por ${total.toFixed(2)} Bs?`)) {
      return;
    }

    const ventaData = {
      productos: [{
        id: productoSeleccionado.id,
        cantidad: parseFloat(kg),
        precio_unitario: parseFloat(productoSeleccionado.precio),
        total
      }],
      metodo_pago: metodoPago,
    };

    console.log("📌 Enviando venta al backend:", JSON.stringify(ventaData, null, 2));

    try {
      const response = await api.post("/sales", ventaData);
      console.log("✅ Venta registrada con éxito:", response.data);

      setVentas([...ventas, { producto: tipo, cantidad: kg, total }]);
      setTipo("");
      setKg("");
      setTotal(0);

      mostrarNotificacion("✅ Venta registrada con éxito.");
    } catch (error) {
      console.error("❌ Error al registrar la venta:", error.response?.data || error);
      mostrarNotificacion("❌ Error al registrar la venta.", "error");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        🛒 Ventas
      </Typography>

      {/* Formulario para Nueva Venta */}
      <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: "white", maxWidth: 400, marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Nueva Venta
        </Typography>
        <TextField select label="Tipo de carne" fullWidth value={tipo} onChange={(e) => setTipo(e.target.value)} margin="dense">
          {precios.map((item) => (
            <MenuItem key={item.tipo} value={item.tipo}>
              {item.tipo} - {item.precio} Bs/kg
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Cantidad (kg)"
          type="number"
          fullWidth
          value={kg}
          onChange={(e) => setKg(e.target.value)}
          margin="dense"
          error={kg <= 0}
          helperText={kg <= 0 ? "La cantidad debe ser mayor a 0." : ""}
        />
        <TextField
          select
          label="Método de Pago"
          fullWidth
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          margin="dense"
        >
          <MenuItem value="Efectivo">Efectivo</MenuItem>
          <MenuItem value="QR_BCP">QR BCP</MenuItem>
          <MenuItem value="QR_OtroBanco">QR Otro Banco</MenuItem>
          <MenuItem value="Tarjeta">Tarjeta</MenuItem>
        </TextField>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Total a Cobrar: {total.toFixed(2)} Bs
        </Typography>
        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={registrarVenta}>
          Registrar Venta
        </Button>
      </Box>

      {/* Tabla de Ventas */}
      <DataTable columns={columns} rows={ventas} />

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

export default Ventas;
