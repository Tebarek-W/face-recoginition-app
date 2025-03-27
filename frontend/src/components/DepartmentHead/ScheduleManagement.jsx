import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CircularProgress,
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Tooltip,
  Typography,
  Alert
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import AddScheduleDialog from './dialogs/AddScheduleDialog';
import EditScheduleDialog from './dialogs/EditScheduleDialog';
import useSchedules from '../../hooks/useSchedules';

const ScheduleManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  
  // Destructure with default empty array for schedules
  const { 
    schedules = [], 
    loading, 
    error, 
    addSchedule, 
    updateSchedule, 
    deleteSchedule 
  } = useSchedules();

  const handleAddSchedule = async (scheduleData) => {
    try {
      await addSchedule(scheduleData);
      setOpenAddDialog(false);
    } catch (err) {
      console.error('Failed to add schedule:', err);
    }
  };

  const handleEditSchedule = async (scheduleData) => {
    try {
      await updateSchedule(selectedSchedule.id, scheduleData);
      setOpenEditDialog(false);
    } catch (err) {
      console.error('Failed to update schedule:', err);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteSchedule(scheduleId);
      } catch (err) {
        console.error('Failed to delete schedule:', err);
      }
    }
  };

  // Safe rendering of schedule data
  const renderScheduleCell = (value) => {
    return value || '-'; // Display '-' if value is null/undefined
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
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message || 'Failed to load schedules'}
            </Alert>
          )}

          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Instructor</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Day</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Room</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading || !Array.isArray(schedules) ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <CircularProgress size={24} sx={{ mr: 2 }} />
                        <Typography>Loading schedules...</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="textSecondary">
                        No schedules found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules.map((schedule) => (
                    <TableRow key={schedule.id || Math.random()}>
                      <TableCell>{renderScheduleCell(schedule.course?.name)}</TableCell>
                      <TableCell>{renderScheduleCell(schedule.instructor?.name)}</TableCell>
                      <TableCell>{renderScheduleCell(schedule.day)}</TableCell>
                      <TableCell>
                        {renderScheduleCell(schedule.start_time)} - {renderScheduleCell(schedule.end_time)}
                      </TableCell>
                      <TableCell>{renderScheduleCell(schedule.room)}</TableCell>
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