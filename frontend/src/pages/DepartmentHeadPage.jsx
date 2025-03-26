import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Divider, 
  useTheme, 
  useMediaQuery,
  styled
} from '@mui/material';
import {
  CalendarToday,
  People,
  School,
  Assignment,
  Schedule,
  Settings as SettingsIcon
} from '@mui/icons-material';

// Import sub-components
import Dashboard from '../components/DepartmentHead/Dashboard';
import StudentManagement from '../components/DepartmentHead/StudentManagement';
import CourseManagement from '../components/DepartmentHead/CourseManagement';
import InstructorManagement from '../components/DepartmentHead/InstructorManagement';
import AttendanceManagement from '../components/DepartmentHead/AttendanceManagement';
import ScheduleManagement from '../components/DepartmentHead/ScheduleManagement';
import SettingsPage from '../components/DepartmentHead/Settings';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100vh',
  overflowX: 'auto',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  minWidth: 'fit-content',
  width: '100%',
  [theme.breakpoints.up('lg')]: {
    minWidth: '1200px',
  },
}));

const DepartmentHeadPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return <Dashboard />;
      case 1: return <StudentManagement />;
      case 2: return <CourseManagement />;
      case 3: return <InstructorManagement />;
      case 4: return <AttendanceManagement />;
      case 5: return <ScheduleManagement />;
      case 6: return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <PageContainer>
      <ContentContainer>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 3,
            position: 'sticky',
            left: 0,
            backgroundColor: theme.palette.background.default,
            zIndex: 1,
            paddingRight: 2,
            width: 'fit-content'
          }}
        >
          Department Head Dashboard
        </Typography>

        <Box sx={{ 
          position: 'sticky',
          left: 0,
          backgroundColor: theme.palette.background.default,
          zIndex: 1,
          width: 'fit-content',
          paddingRight: 2
        }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="department head tabs"
            sx={{
              '& .MuiTabs-scroller': {
                overflow: 'visible !important',
              },
              '& .MuiTab-root': {
                minHeight: 64,
                minWidth: isMobile ? 100 : 120,
                padding: isMobile ? '12px 8px' : '12px 16px',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                },
              },
            }}
          >
            <Tab 
              label={isMobile ? null : "Dashboard"} 
              icon={<CalendarToday />} 
              iconPosition={isMobile ? 'top' : 'start'} 
            />
            <Tab 
              label={isMobile ? null : "Students"} 
              icon={<People />} 
              iconPosition={isMobile ? 'top' : 'start'} 
            />
            <Tab 
              label={isMobile ? null : "Courses"} 
              icon={<School />} 
              iconPosition={isMobile ? 'top' : 'start'} 
            />
            <Tab 
              label={isMobile ? null : "Instructors"} 
              icon={<Assignment />} 
              iconPosition={isMobile ? 'top' : 'start'} 
            />
            <Tab 
              label={isMobile ? null : "Attendance"} 
              icon={<CalendarToday />} 
              iconPosition={isMobile ? 'top' : 'start'} 
            />
            <Tab 
              label={isMobile ? null : "Schedule"} 
              icon={<Schedule />} 
              iconPosition={isMobile ? 'top' : 'start'} 
            />
            <Tab 
              label={isMobile ? null : "Settings"} 
              icon={<SettingsIcon />} 
              iconPosition={isMobile ? 'top' : 'start'} 
            />
          </Tabs>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ 
          minWidth: isMobile ? '100%' : 'fit-content',
          width: '100%',
          overflowX: 'auto'
        }}>
          {renderTabContent()}
        </Box>
      </ContentContainer>
    </PageContainer>
  );
};

export default DepartmentHeadPage;