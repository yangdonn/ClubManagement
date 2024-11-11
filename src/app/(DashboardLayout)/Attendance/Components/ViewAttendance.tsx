'use client';

import React, { useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, InputAdornment, FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface ViewAttendanceProps {
  eventId: number;
  attendanceData: {
    id: number;
    studentId: string;
    name: string;
    department: string;
    year: string;
    status: boolean;
  }[];
}

const ViewAttendance: React.FC<ViewAttendanceProps> = ({ eventId, attendanceData }) => {
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Present" | "Absent">("All");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setSelectedDepartment(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<"All" | "Present" | "Absent">) => {
    setStatusFilter(event.target.value as "All" | "Present" | "Absent");  // Ensuring correct type
  };

  // Filter the data based on search term and selected filters
  const filteredData = attendanceData.filter((student) => {
    const isSearchMatch =
      student.studentId.toLowerCase().includes(search.toLowerCase()) ||
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.department.toLowerCase().includes(search.toLowerCase()) ||
      student.year.toLowerCase().includes(search.toLowerCase());

    const isDepartmentMatch = selectedDepartment === "All" || student.department === selectedDepartment;

    const isStatusMatch =
      statusFilter === "All" ||
      (statusFilter === "Present" && student.status) ||
      (statusFilter === "Absent" && !student.status);

    return isSearchMatch && isDepartmentMatch && isStatusMatch;
  });

  return (
    <Box>
      {/* Search, Filter Controls */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, mt:2 }}>
        {/* Department Filter Dropdown */}
        <FormControl size="small" sx={{ mr: 2 }}>
          <Select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            displayEmpty
            IconComponent={ArrowDropDownIcon}
            sx={{ width: 170 }}
          >
            <MenuItem value="All">All departments</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="ECE">ECE</MenuItem>
            <MenuItem value="EG">EG</MenuItem>
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="ICE">ICE</MenuItem>
          </Select>
        </FormControl>

        {/* Search Field */}
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton><SearchIcon /></IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ width: 200 }}
        />

        {/* Status Filter Dropdown */}
        <FormControl size="small" sx={{ ml: 2 }}>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            displayEmpty
            IconComponent={ArrowDropDownIcon}
            sx={{ width: 150 }}
          >
            <MenuItem value="All">Status - All</MenuItem>
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Attendance Table */}
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
                <TableCell sx={{ fontSize: "16px" }}>{student.status ? "Present" : "Absent"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewAttendance;
