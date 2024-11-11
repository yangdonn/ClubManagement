'use client';

import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Snackbar,
  Alert,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type Student = {
  id: number;
  studentId: string;
  name: string;
  department: string;
  year: string;
  status: boolean;
};

interface RecordAttendanceProps {
  eventId: number;
  attendanceData: Student[];
  setAttendanceData: (data: Student[]) => void;
}

const RecordAttendance: React.FC<RecordAttendanceProps> = ({ eventId, attendanceData, setAttendanceData }) => {
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [localAttendanceData, setLocalAttendanceData] = useState<Student[]>(attendanceData);

  useEffect(() => {
    setLocalAttendanceData(attendanceData);
  }, [attendanceData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const handleStatusChange = (id: number) => {
    setLocalAttendanceData((prevData) =>
      prevData.map((student) =>
        student.id === id ? { ...student, status: !student.status } : student
      )
    );
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setSelectedDepartment(event.target.value);
  };

  const filteredData = localAttendanceData.filter((student) => {
    const isSearchMatch = 
      student.studentId.toLowerCase().includes(search.toLowerCase()) ||
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.department?.toLowerCase().includes(search.toLowerCase()) 


    const isDepartmentMatch = selectedDepartment === "All" || student.department === selectedDepartment;

    return isSearchMatch && isDepartmentMatch;
  });

  const handleSave = () => {
    setAttendanceData(localAttendanceData);
    setSnackbarMessage("Attendance saved successfully!");
  };

  // const handleCancel = () => {
  //   setLocalAttendanceData(attendanceData);
  //   setSnackbarMessage("Changes have been discarded.");
  // };
  const handleCancel = () => {
    // Reset local attendance data to the initial state
    setLocalAttendanceData(attendanceData);
    // Show snackbar message
    setSnackbarMessage("Set back to initial");
  };
  

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          placeholder="Search"
          size="small"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ width: 200 }}
        />

        <FormControl sx={{ width: 120 }}>
          <Select
            size="small"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            displayEmpty
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="CS">CS</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>Student ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>Year</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((student) => (
              <TableRow key={student.id}>
                <TableCell sx={{ fontSize: "16px" }}>{student.studentId}</TableCell>
                <TableCell sx={{ fontSize: "16px" }}>{student.name}</TableCell>
                <TableCell sx={{ fontSize: "16px" }}>{student.department}</TableCell>
                <TableCell sx={{ fontSize: "16px" }}>{student.year}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={student.status}
                    onChange={() => handleStatusChange(student.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="outlined" color="primary" onClick={handleCancel} sx={{ mr: 1 }}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
      </Box>

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarMessage(null)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecordAttendance;

