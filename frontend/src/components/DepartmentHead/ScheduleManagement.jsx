import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import AddScheduleDialog from './dialogs/AddScheduleDialog';
import EditScheduleDialog from './dialogs/EditScheduleDialog';
import  useSchedules  from '../../hooks/useSchedules';


const ScheduleManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const { schedules, loading, error, addSchedule, updateSchedule, deleteSchedule } = useSchedules();

  const handleAddSchedule = (scheduleData) => {
    addSchedule(scheduleData);
    setOpenAddDialog(false);
  };

  const handleEditSchedule = (scheduleData) => {
    updateSchedule(selectedSchedule.id, scheduleData);
    setOpenEditDialog(false);
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteSchedule(scheduleId);
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Class Schedule"
          titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
            >
              Add Schedule
            </Button>
          }
        />
        <CardContent>
          <Box sx={{ height: 400, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Calendar View
            </Typography>
            <Paper sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
              <Typography color="textSecondary">
                Interactive calendar would be displayed here
              </Typography>
            </Paper>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Upcoming Classes
          </Typography>
          
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Instructor</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Room</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Loading...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Error: {error}</TableCell>
                  </TableRow>
                ) : schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No schedules found</TableCell>
                  </TableRow>
                ) : (
                  schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.course}</TableCell>
                      <TableCell>{schedule.instructor}</TableCell>
                      <TableCell>{schedule.time}</TableCell>
                      <TableCell>{schedule.room}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit Schedule">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setOpenEditDialog(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Schedule">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <AddScheduleDialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)} 
        onSubmit={handleAddSchedule} 
      />

      {selectedSchedule && (
        <EditScheduleDialog 
          open={openEditDialog} 
          onClose={() => setOpenEditDialog(false)} 
          onSubmit={handleEditSchedule} 
          schedule={selectedSchedule}
        />
      )}
    </>
  );
};

export default ScheduleManagement;