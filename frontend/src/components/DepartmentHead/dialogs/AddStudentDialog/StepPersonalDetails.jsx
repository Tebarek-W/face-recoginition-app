import React from 'react';
import dayjs from 'dayjs';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

const GENDER_OPTIONS = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
];

const YEAR_OF_STUDY_OPTIONS = [
  { value: 1, label: 'Year 1' },
  { value: 2, label: 'Year 2' },
  { value: 3, label: 'Year 3' },
  { value: 4, label: 'Year 4' },
];

const StepPersonalDetails = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the input is date_of_birth, format it to YYYY-MM-DD
    const updatedValue = name === 'date_of_birth' && value
      ? dayjs(value).format('YYYY-MM-DD')
      : value;

    setFormData(prev => ({ ...prev, [name]: updatedValue }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxWidth: '500px',
        margin: '0 auto',
        width: '100%',
        p: 2
      }}
    >
      <TextField
        name="first_name"
        label="First Name"
        value={formData.first_name}
        onChange={handleChange}
        fullWidth
        required
        variant="outlined"
        size="medium"
      />

      <TextField
        name="last_name"
        label="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        fullWidth
        required
        variant="outlined"
        size="medium"
      />

      <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          label="Gender"
          required
          variant="outlined"
        >
          {GENDER_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Date of Birth"
        name="date_of_birth"
        type="date"
        value={formData.date_of_birth || ''}
        onChange={handleChange}
        fullWidth
        required
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
      />

      <FormControl fullWidth>
        <InputLabel>Year of Study</InputLabel>
        <Select
          name="year_of_study"
          value={formData.year_of_study}
          onChange={handleChange}
          label="Year of Study"
          required
          variant="outlined"
        >
          {YEAR_OF_STUDY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default StepPersonalDetails;
