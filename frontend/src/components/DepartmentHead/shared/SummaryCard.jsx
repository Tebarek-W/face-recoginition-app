import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { 
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { Box } from "@mui/material";


const iconComponents = {
  school: SchoolIcon,
  people: PeopleIcon,
  assignment: AssignmentIcon,
  calendar: CalendarIcon
};

const SummaryCard = ({ title, value, icon, color = 'primary' }) => {
  const IconComponent = iconComponents[icon];
  
  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 3
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography color="textSecondary" gutterBottom variant="subtitle1">
          {title}
        </Typography>
        <Typography variant="h4" component="h2" sx={{ mb: 1.5 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconComponent 
            color={color} 
            sx={{ 
              fontSize: 40,
              opacity: 0.8
            }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;