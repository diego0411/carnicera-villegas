import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../styles/global.css";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 260px)`,
        ml: "260px",
        backgroundColor: "#8B0000", // 🔴 Rojo oscuro en lugar de azul
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 ,color: "#FFD700"}}>
          Bienvenido, Usuario
        </Typography>
        <IconButton color="inherit">
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
