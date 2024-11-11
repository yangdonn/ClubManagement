'use client';
import * as React from 'react';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Box, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';

// Define the types for the OutlinedCard component props
interface OutlinedCardProps {
  eventName: string;
  venue: string;
  dresscode: string;
  date: Date;
  imageUrl: string;
  onViewFeedback: () => void;
}

// Define the type for feedback data
interface Feedback {
  comments: string;
  submittedAt: string; // ISO 8601 string for date/time
}

// Main component for the OutlinedCard
const OutlinedCard: React.FC<OutlinedCardProps> = ({ eventName, venue, dresscode, date, imageUrl, onViewFeedback }) => {
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

  return (
    <Card variant="outlined" sx={{ maxWidth: 450 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="150"
          width="100"
          image={imageUrl}
          alt={eventName}
          sx={{
            objectFit: 'contain',
            margin: 'auto',
          }}
        />
        <CardContent>
          <Typography variant="h5" component="div" sx={{ mb: 1 }}>
            {eventName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, fontSize: '13px', color: '#8d94b3' }}>
            <strong>Venue:</strong> {venue}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, fontSize: '13px', color: '#8d94b3' }}>
            <strong>Dress code:</strong> {dresscode}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '13px', color: '#8d94b3' }}>
            <strong>Date:</strong> {formattedDate}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box sx={{ backgroundColor: '#f8f8f8' }}>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            sx={{
              backgroundColor: '#f4fbf7',
              color: '#02b2af',
              borderColor: '#84d9d8',
              borderWidth: 2,
              '&:hover': {
                backgroundColor: '#e6f8f7',
                color: '#004d3e',
                borderColor: '#007f5f',
              },
              mr: 1,
            }}
            onClick={onViewFeedback}
          >
            View Feedback
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};

// Dialog for viewing feedback
const FeedbackViewDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  event: { eventName: string; venue: string; dresscode: string; date: Date };
  feedbacks: Feedback[];
}> = ({ open, onClose, event, feedbacks }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#f9f9f9',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div" style={{ fontWeight: 'bold' }}>
          Feedback for {event.eventName}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {feedbacks.length === 0 ? (
          <Typography variant="body2">No feedback available for this event.</Typography>
        ) : (
          feedbacks.map((feedback, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body2">{feedback.comments}</Typography>
              <Typography variant="body2" sx={{ fontSize: '12px', color: '#8d94b3' }}>
                Submitted at: {new Date(feedback.submittedAt).toLocaleString()}
              </Typography>
            </Box>
          ))
        )}
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center', padding: '20px' }}>
        <Button
          onClick={onClose}
          style={{
            backgroundColor: '#d3d3d3',
            color: '#333',
            borderRadius: '5px',
            padding: '10px 20px',
            textTransform: 'none',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main component for displaying multiple cards
const CardGrid: React.FC = () => {
  const [cardsData, setCardsData] = React.useState([
    { eventName: 'Welcome Gathering', venue: 'Teamwork hall', dresscode: 'Formal', date: new Date('2024-07-27'), imageUrl: '/images/logos/event.jpg' },
    { eventName: 'First meeting', venue: 'LH - 01', dresscode: 'Casual', date: new Date('2024-08-02'), imageUrl: '/images/logos/event.jpg' },
    { eventName: 'Tech Talk Contest', venue: 'Convention hall', dresscode: 'Formal', date: new Date('2024-07-17'), imageUrl: '/images/logos/event.jpg' },
    { eventName: 'Seminar 1', venue: 'Convention hall', dresscode: 'Formal', date: new Date('2024-08-10'), imageUrl: '/images/logos/event.jpg' },
    { eventName: 'ICPC', venue: 'OOS and Software lab', dresscode: 'Formal', date: new Date('2024-11-01'), imageUrl: '/images/logos/event.jpg' },
    { eventName: 'ITS', venue: 'Innotech hall', dresscode: 'Casual', date: new Date('2024-07-27'), imageUrl: '/images/logos/event.jpg' },
  ]);

  const [selectedEvent, setSelectedEvent] = React.useState<{ eventName: string; venue: string; dresscode: string; date: Date } | null>(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = React.useState(false);
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>([]);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string | null>(null);

  const handleViewFeedback = (event: { eventName: string; venue: string; dresscode: string; date: Date }) => {
    // Example feedback data; replace this with actual data fetching logic
    const sampleFeedbacks: Feedback[] = [
      { comments: 'Great event!', submittedAt: '2024-07-27T12:00:00Z' },
      { comments: 'Very informative session.', submittedAt: '2024-07-27T13:00:00Z' },
    ];
    setFeedbacks(sampleFeedbacks);
    setSelectedEvent(event);
    setFeedbackDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFeedbackDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarMessage(null); // Clear the snackbar message
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {cardsData.map((card) => (
        <Grid item xs={12} sm={6} md={4} key={card.eventName}>
          <OutlinedCard
            eventName={card.eventName}
            venue={card.venue}
            dresscode={card.dresscode}
            date={card.date}
            imageUrl={card.imageUrl}
            onViewFeedback={() => handleViewFeedback(card)}
          />
        </Grid>
      ))}

      {selectedEvent && (
        <FeedbackViewDialog
          open={feedbackDialogOpen}
          onClose={handleCloseDialog}
          event={selectedEvent}
          feedbacks={feedbacks}
        />
      )}

      {/* Snackbar for feedback confirmation */}
      <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default CardGrid;
