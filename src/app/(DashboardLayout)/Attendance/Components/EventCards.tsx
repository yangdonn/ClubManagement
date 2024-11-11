'use client';

import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import RecordAttendance from "./RecordAttendance";
import ViewAttendance from "./ViewAttendance";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type EventCardsProps = {
  mode: "record" | "view";
};



// const initialData = [
//   { id: 1, studentId: "S001", name: "Alice", department: "IT", year: "2nd", status: false },
//   { id: 2, studentId: "S002", name: "Bob", department: "CS", year: "3rd", status: false },
//   { id: 3, studentId: "S003", name: "Charlie", department: "IT", year: "1st", status: false },
//   { id: 4, studentId: "S004", name: "Roy", department: "IT", year: "2nd", status: false },
//   { id: 5, studentId: "S005", name: "Alien", department: "CS", year: "3rd", status: false },
//   { id: 6, studentId: "S006", name: "Exo", department: "IT", year: "1st", status: false },
// ];

const EventCards: React.FC<EventCardsProps> = ({ mode }) => {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [initialData, setInitialData] = useState<Member[]>([]);

  const programMap: { [key: string]: string } = {
    "P01": "Architecture",
    "P02": "Civil",
    "P03": "Electrical",
    "P04": "ECE",
    "P05": "EG",
    "P06": "ICE",
    "P07": "IT",
    "P08": "Mechanical",
    "P09": "Software",
    "P10": "Water Resources",
  };

  const fetchMembers = async (userId: string) => {
    try {
      const response = await fetch(`/api/members/${userId}`); // Update this to your actual API endpoint
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      // Map API response to match MemberData structure
      const formattedMembers = data.map((member: any) => {
        const [firstName, lastName] = member.stdname.split(" "); // Split the name into first and last

        return {
          id: member.stdid,
          name: member.stdname,
          studentId: member.stdid,
          department: programMap[member.pid] || "Unknown",
          gender: member.stdgender,
          year: Number(member.stdyear),
          status: false,
        };
      });

      setInitialData(formattedMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events/${session?.user.cid}`); // Update this to your actual API endpoint
        const data = await response.json();
        const formattedEvents = data.map((event) => ({
          id: event.eid.trim(),
          name: event.ename,
          venue: event.evenue,
          dresscode: event.edresscode, 
          date: new Date(event.edate).toISOString().slice(0, 10), // Format to YYYY-MM-DD
        }));
        setEvents(formattedEvents);
        console.log(formattedEvents)
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
    fetchMembers(session?.user.cid);
  }, [])
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [attendanceData, setAttendanceData] = useState<{ [key: number]: typeof initialData }>({});

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    return `${parsedDate.getDate().toString().padStart(2, '0')}/${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getFullYear()}`;
  };
  

  const handleSetAttendanceData = (eventId: number, data: typeof initialData) => {
    setAttendanceData((prevData) => ({ ...prevData, [eventId]: data }));
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Select an Event</Typography>
      <Box sx={{ display: "flex", overflowX: "auto", gap: 2, pb: 3 }}>
        {events.map((event) => (
          <Card
            key={event.id}
            onClick={() => setSelectedEvent(event.id)}
            sx={{
              minWidth: 250,
              cursor: "pointer",
              backgroundColor: selectedEvent === event.id ? "#f5f5f5" : "#fff",
              boxShadow: selectedEvent === event.id ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              borderRadius: 2,
              border: "1px solid #ddd",
              "&:hover": { transform: "scale(1.02)", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.15)" },
            }}
          >
            <CardContent sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>{event.name}</Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={12}><Typography variant="body2" sx={{ color: "#8d94b3" }}><strong>Venue:</strong> {event.venue}</Typography></Grid>
                <Grid item xs={12}><Typography variant="body2" sx={{ color: "#8d94b3" }}><strong>Dress code:</strong> {event.dresscode}</Typography></Grid>
                <Grid item xs={12}><Typography variant="body2" sx={{ color: "#8d94b3" }}><strong>Date:</strong> {formatDate(event.date)}</Typography></Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>

      {selectedEvent && (
        mode === "record" ? 
          <RecordAttendance 
            eventId={selectedEvent} 
            attendanceData={attendanceData[selectedEvent] || initialData} 
            setAttendanceData={(data) => handleSetAttendanceData(selectedEvent, data)} 
          /> : 
          <ViewAttendance 
            eventId={selectedEvent} 
            attendanceData={attendanceData[selectedEvent] || initialData} 
          />
      )}
    </Box>
  );
};

export default EventCards;
