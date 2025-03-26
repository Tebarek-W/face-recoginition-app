import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  Divider, 
  useMediaQuery, 
  useTheme,
  styled,
  alpha
} from '@mui/material';
import { 
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
  People as PeopleIcon,
  Business as DepartmentIcon,
  Analytics as AnalyticsIcon,
  Description as ReportsIcon,
  Schedule as ScheduleIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeItem, setActiveItem] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { text: 'Users', path: '/manage-users', icon: <PeopleIcon /> },
    { text: 'Departments', path: '/manage-departments', icon: <DepartmentIcon /> },
    { text: 'Analytics', path: '/attendance-analytics', icon: <AnalyticsIcon /> },
    { text: 'Reports', path: '/generate-reports', icon: <ReportsIcon /> },
    { text: 'Schedule', path: '/view-schedule', icon: <ScheduleIcon /> },
  ];

  // Styled components
  const Sidebar = styled(Box)(({ theme }) => ({
    width: sidebarOpen ? 240 : 72,
    height: '100vh',
    backgroundColor: theme.palette.primary.dark,
    position: 'fixed',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }));

  const MenuButton = styled(Button)(({ theme, active }) => ({
    justifyContent: 'flex-start',
    textTransform: 'none',
    borderRadius: '8px',
    padding: '12px 16px',
    margin: '4px 12px',
    width: 'calc(100% - 24px)',
    color: active ? theme.palette.common.white : alpha(theme.palette.common.white, 0.8),
    backgroundColor: active ? alpha(theme.palette.common.white, 0.15) : 'transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
    '& .MuiButton-startIcon': {
      marginRight: sidebarOpen ? '12px' : '0',
      minWidth: '24px',
      color: active ? theme.palette.common.white : alpha(theme.palette.common.white, 0.8),
    },
  }));

  const ContentBox = styled(Box)(({ theme }) => ({
    marginLeft: sidebarOpen ? 240 : 72,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: theme.spacing(3),
    minHeight: '100vh',
  }));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sleek Sidebar */}
      <Sidebar>
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          height: '64px',
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
        }}>
          {sidebarOpen ? (
            <>
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                color: 'common.white',
                flexGrow: 1
              }}>
                Admin
              </Typography>
              <IconButton 
                onClick={toggleSidebar} 
                size="small"
                sx={{ color: 'common.white' }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <IconButton 
              onClick={toggleSidebar} 
              sx={{ 
                color: 'common.white',
                margin: '0 auto'
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
        
        <Box sx={{ p: 1, mt: 1, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <MenuButton
              key={item.path}
              startIcon={item.icon}
              onClick={() => {
                navigate(item.path);
                setActiveItem(item.path);
              }}
              active={activeItem === item.path}
              sx={{
                '& span': {
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.2s ease',
                  opacity: sidebarOpen ? 1 : 0
                },
              }}
            >
              {sidebarOpen && item.text}
            </MenuButton>
          ))}
        </Box>
      </Sidebar>

      {/* Main Content */}
      <ContentBox>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            mb: 1
          }}>
            {activeItem ? menuItems.find(item => item.path === activeItem)?.text : 'Dashboard'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {activeItem ? `Manage ${menuItems.find(item => item.path === activeItem)?.text}` : 'System overview'}
          </Typography>
        </Box>

        {/* Content goes here */}
        <Box sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
          boxShadow: theme.shadows[1]
        }}>
          <Typography variant="h6" color="text.secondary">
            {activeItem ? `${menuItems.find(item => item.path === activeItem)?.text} Content` : 'Welcome to Admin Panel'}
          </Typography>
        </Box>
      </ContentBox>
    </Box>
  );
};

export default AdminPage;