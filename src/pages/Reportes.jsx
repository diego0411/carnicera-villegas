import { useEffect, useState } from "react";
import "../styles/global.css";
import {
  Typography,
  Container,
  TextField,
  Button,
  MenuItem,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import api from "../services/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Reportes = () => {
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [resumen, setResumen] = useState({ totalVentas: 0, totalIngresos: 0 });

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const response = await api.get("/sales");
      if (response.data) {
        setVentas(response.data);
        calcularResumen(response.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener reportes:", error);
    }
  };

  const calcularResumen = (data) => {
    let totalVentas = data.length;
    let totalIngresos = data.reduce((acc, venta) => acc + (venta.total || 0), 0);
    setResumen({ totalVentas, totalIngresos });
  };

  const handleFiltrar = async () => {
    try {
      const response = await api.get(`/sales?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&metodoPago=${metodoPago}`);
      if (response.data) {
        setVentas(response.data);
        calcularResumen(response.data);
      }
    } catch (error) {
      console.error("❌ Error al filtrar ventas:", error);
    }
  };

  const exportToExcel = () => {
    if (ventas.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(ventas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    XLSX.writeFile(wb, "reportes_ventas.xlsx");
  };

  const exportToPDF = () => {
    if (ventas.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Reporte de Ventas", 20, 10);
    doc.autoTable({
      head: [["ID", "Producto", "Cantidad (kg)", "Total (Bs)", "Método de Pago", "Fecha"]],
      body: ventas.map((v) => [v.id, v.producto || "N/A", v.cantidad || 0, v.total || 0, v.metodo_pago || "N/A", v.fecha || "N/A"]),
    });
    doc.save("reportes_ventas.pdf");
  };

  const chartData = {
    labels: ventas.map((v) => v.producto || "Desconocido"),
    datasets: [
      {
        label: "Ventas por Producto",
        data: ventas.map((v) => v.total || 0),
        backgroundColor: "rgba(200, 30, 30, 0.7)", // Color acorde a la temática de carnicería
      },
    ],
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        📊 Reportes de Ventas
      </Typography>

      {/* 📌 Filtros */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
        <TextField
          type="date"
          label="Fecha Inicio"
          InputLabelProps={{ shrink: true }}
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <TextField
          type="date"
          label="Fecha Fin"
          InputLabelProps={{ shrink: true }}
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
        <TextField
          select
          label="Método de Pago"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Efectivo">Efectivo</MenuItem>
          <MenuItem value="QR_BCP">QR BCP</MenuItem>
          <MenuItem value="QR_OtroBanco">QR Otro Banco</MenuItem>
          <MenuItem value="Tarjeta">Tarjeta</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" onClick={handleFiltrar}>
          Filtrar
        </Button>
      </Box>

      {/* 📌 Resumen de Ventas */}
      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h6">📈 Resumen</Typography>
        <Typography>Total Ventas: {resumen.totalVentas}</Typography>
        <Typography>Total Ingresos: {resumen.totalIngresos.toFixed(2)} Bs</Typography>
      </Paper>

      {/* 📌 Tabla de Reportes */}
      <Paper sx={{ overflow: "auto", maxHeight: 300 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad (kg)</TableCell>
              <TableCell>Total (Bs)</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.length > 0 ? (
              ventas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell>{venta.id}</TableCell>
                  <TableCell>{venta.producto || "N/A"}</TableCell>
                  <TableCell>{venta.cantidad || 0}</TableCell>
                  <TableCell>{venta.total || 0}</TableCell>
                  <TableCell>{venta.metodo_pago || "N/A"}</TableCell>
                  <TableCell>{venta.fecha || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay datos disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* 📌 Gráfico de Ventas */}
      <Box sx={{ marginTop: 4, height: 300 }}>
        {ventas.length > 0 ? <Bar data={chartData} /> : <Typography>No hay datos para mostrar en el gráfico.</Typography>}
      </Box>

      {/* 📌 Botones de Exportación */}
      <Box sx={{ display: "flex", gap: 2, marginTop: 3 }}>
        <Button variant="contained" color="success" onClick={exportToExcel}>
          📄 Exportar Excel
        </Button>
        <Button variant="contained" color="error" onClick={exportToPDF}>
          📄 Exportar PDF
        </Button>
      </Box>
    </Container>
  );
};

export default Reportes;
