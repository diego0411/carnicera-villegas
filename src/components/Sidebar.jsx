import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import { Dashboard, ShoppingCart, Inventory, Business, BarChart, Settings, ExitToApp } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import "../styles/global.css";
const drawerWidth = 260;

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Ventas", icon: <ShoppingCart />, path: "/ventas" },
    { text: "Inventario", icon: <Inventory />, path: "/inventario" },
    { text: "Proveedores", icon: <Business />, path: "/proveedores" },
    { text: "Reportes", icon: <BarChart />, path: "/reportes" },
    { text: "Configuración", icon: <Settings />, path: "/configuracion" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      className="sidebar"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "#8B0000", // 🎨 Rojo oscuro para la temática de la carnicería
          color: "#fff",
        },
      }}
    >
      <Box className="sidebar-logo">

        <Typography variant="h5">Carnicería CDN</Typography>
      </Box>

      <List className="sidebar-menu">
        {menuItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.text}
            sx={{
              "&:hover": { backgroundColor: "#5A0000" }, // 🎨 Efecto hover más oscuro
            }}
          >
            <ListItemIcon sx={{ color: "#FFD700" }}>{item.icon}</ListItemIcon> {/* 🎨 Dorado para los íconos */}
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      {/* Botón de Cierre de Sesión */}
      <Box className="sidebar-logout">
        <button onClick={handleLogout}>
          <ExitToApp /> Cerrar Sesión
        </button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
