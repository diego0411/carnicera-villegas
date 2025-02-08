import { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import "../styles/global.css";
const FormularioProducto = ({ open, handleClose, agregarProducto, editarProducto, productoActual }) => {
  const [producto, setProducto] = useState({ nombre: "", stock: "", precio: "" });

  // 📌 Cargar datos si se está editando un producto
  useEffect(() => {
    if (productoActual) {
      setProducto(productoActual);
    } else {
      setProducto({ nombre: "", stock: "", precio: "" });
    }
  }, [productoActual]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (productoActual) {
      editarProducto(producto);
    } else {
      agregarProducto(producto);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{productoActual ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
      <DialogContent>
        <TextField label="Nombre" name="nombre" fullWidth value={producto.nombre} onChange={handleChange} margin="dense" />
        <TextField label="Stock" name="stock" type="number" fullWidth value={producto.stock} onChange={handleChange} margin="dense" />
        <TextField label="Precio" name="precio" type="number" fullWidth value={producto.precio} onChange={handleChange} margin="dense" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">Cancelar</Button>
        <Button onClick={handleSubmit} color="primary">{productoActual ? "Actualizar" : "Guardar"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioProducto;
