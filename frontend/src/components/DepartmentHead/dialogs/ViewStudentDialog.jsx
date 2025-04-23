import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  Box,
  Divider,
  Chip,
  Badge,
  Grid
} from '@mui/material';
import { 
  VerifiedUser,
  FaceRetouchingNatural,
  Close
} from '@mui/icons-material';
import { format } from 'date-fns';

const ViewStudentDialog = ({ open, onClose, student }) => {
  if (!student) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        Student Details
        <Button onClick={onClose} size="small">
          <Close />
        </Button>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Left Column - Profile Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  student.is_verified ? (
                    <VerifiedUser color="success" sx={{ 
                      fontSize: 16,
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                      p: 0.5
                    }} />
                  ) : (
                    <FaceRetouchingNatural color="warning" sx={{ 
                      fontSize: 16,
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                      p: 0.5
                    }} />
                  )
                }
              >
                <Avatar
                  src={student.profile_picture}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    mb: 2,
                    fontSize: 48
                  }}
                >
                  {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                </Avatar>
              </Badge>
              
              <Typography variant="h6" gutterBottom>
                {student.first_name} {student.last_name}
              </Typography>
              
              <Chip 
                label={student.is_verified ? 'Verified' : 'Pending Verification'} 
                color={student.is_verified ? 'success' : 'warning'} 
                size="small"
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary">
                ID: {student.student_id}
              </Typography>
            </Box>
          </Grid>
          
          {/* Right Column - Details */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DetailItem label="Email" value={student.email} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem label="Phone" value={student.phone_number || 'N/A'} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem label="Gender" value={
                  student.gender === 'M' ? 'Male' : 
                  student.gender === 'F' ? 'Female' : 'Other'
                } />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem label="Date of Birth" value={
                  student.date_of_birth ? 
                  format(new Date(student.date_of_birth), 'MMM dd, yyyy') : 'N/A'
                } />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem label="Department" value={student.department?.name || 'N/A'} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem label="Year of Study" value={student.year_of_study || 'N/A'} />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem 
                  label="Verification Status" 
                  value={
                    student.is_verified ? 
                    `Verified on ${format(new Date(student.liveness_verified_at), 'MMM dd, yyyy')}` : 
                    `Pending (Step ${student.verification_step || 0}/5)`
                  } 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem 
                  label="Account Created" 
                  value={format(new Date(student.created_at), 'MMM dd, yyyy')} 
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Helper component for consistent detail items
const DetailItem = ({ label, value }) => (
  <Box sx={{ mb: 1 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1">
      {value}
    </Typography>
  </Box>
);

export default ViewStudentDialog;