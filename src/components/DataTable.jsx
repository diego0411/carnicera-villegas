import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import "../styles/global.css";

const DataTable = ({ columns, rows }) => {
  return (
    <Paper sx={{ height: 400, width: "100%", padding: 2, backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} sx={{ fontSize: "1rem", "& .MuiDataGrid-columnHeaders": { backgroundColor: "#1565C0", color: "white" } }} />
    </Paper>
  );
};

export default DataTable;
