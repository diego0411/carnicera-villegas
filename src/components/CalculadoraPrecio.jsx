import { useState, useEffect } from "react";
import { Box, TextField, MenuItem, Typography, Button } from "@mui/material";
import api from "../services/api";
import "../styles/global.css";

const CalculadoraPrecio = () => {
  const [precios, setPrecios] = useState([]);
  const [tipo, setTipo] = useState("");
  const [kg, setKg] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchPrecios = async () => {
      try {
        const response = await api.get("/config/prices");
        setPrecios(response.data);
      } catch (error) {
        console.error("Error al obtener los precios", error);
      }
    };
    fetchPrecios();
  }, []);

  const calcularPrecio = () => {
    const precioUnitario = precios.find((p) => p.tipo === tipo)?.precio || 0;
    setTotal(precioUnitario * kg);
  };

  return (
    <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: "white", maxWidth: 400 }}>
      <Typography variant="h5" gutterBottom>
        Calculadora de Precio
      </Typography>
      <TextField select label="Tipo de carne" fullWidth value={tipo} onChange={(e) => setTipo(e.target.value)} margin="dense">
        {precios.map((item) => (
          <MenuItem key={item.tipo} value={item.tipo}>
            {item.tipo}
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
      />
      <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={calcularPrecio}>
        Calcular
      </Button>
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Total: {total.toFixed(2)} Bs
      </Typography>
    </Box>
  );
};

export default CalculadoraPrecio;
