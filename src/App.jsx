import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Ventas from "./pages/Ventas";
import Inventario from "./pages/Inventario";
import Proveedores from "./pages/Proveedores";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";
import Header from "./components/Header";
import Productos from "./pages/Productos"; 
import axios from "axios";




const drawerWidth = 240; // Ancho del sidebar
import { createTheme, ThemeProvider } from "@mui/material/styles";
const api = axios.create({
  baseURL: "http://localhost:5001/api",
});
const theme = createTheme({
  palette: {
    primary: {
      main: "#8B0000", // Rojo oscuro
    },
    secondary: {
      main: "#5A0000", // Rojo más oscuro
    },
  },
});
// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Error en la API:", error);
    return Promise.reject(error);
  }
);

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Sidebar (Menú lateral) */}
        <Sidebar />
        {/* Contenido principal */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/productos" element={<Productos />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
