import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976D2", // Color azul (ajustar según PDF)
    },
    secondary: {
      main: "#F57C00", // Color naranja (ajustar según PDF)
    },
    background: {
      default: "#F5F5F5", // Fondo gris claro (ajustar según PDF)
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: { fontSize: "2rem", fontWeight: 700 },
    h2: { fontSize: "1.5rem", fontWeight: 600 },
    h3: { fontSize: "1.2rem", fontWeight: 500 },
    body1: { fontSize: "1rem" },
    button: { textTransform: "none", fontWeight: "bold" },
  },
});

export default theme;
