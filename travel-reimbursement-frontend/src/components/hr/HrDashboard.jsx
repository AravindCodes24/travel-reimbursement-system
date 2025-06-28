import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Grow,
  Avatar,
  Tooltip,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const HrDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '70vh',
        background: 'linear-gradient(to right, #d7e1ec, #f1f5fb)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
      }}
    >
      <Grow in timeout={500}>
        <Paper
          elevation={6}
          sx={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '20px',
            padding: 6,
            width: '100%',
            maxWidth: 700,
          }}
        >
          {/* Header Section */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={4}
            p={2}
            sx={{
              background: 'rgba(255,255,255,0.4)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>HR</Avatar>
              <Typography variant="subtitle1" fontWeight="bold">
                HR Admin
              </Typography>
            </Box>
            <Tooltip title="Logout">
              <Button
                onClick={handleLogout}
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Tooltip>
          </Box>

          {/* Main Title */}
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            sx={{ textAlign: 'center' }}
          >
            HR Dashboard
          </Typography>

          {/* Action Buttons */}
          <Stack spacing={3} mb={2}>
            <Button
              variant="contained"
              startIcon={<GroupAddIcon />}
              onClick={() => navigate('/hr/users')}
              sx={{
                backgroundColor: '#2196f3',
                '&:hover': { backgroundColor: '#1976d2' },
                paddingY: 1.5,
                fontSize: '16px',
                borderRadius: '12px',
              }}
              fullWidth
            >
              Approve New Users
            </Button>

            <Button
              variant="contained"
              startIcon={<FlightTakeoffIcon />}
              onClick={() => navigate('/hr/claims')}
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': { backgroundColor: '#388e3c' },
                paddingY: 1.5,
                fontSize: '16px',
                borderRadius: '12px',
              }}
              fullWidth
            >
              Review Travel Claims
            </Button>
          </Stack>
        </Paper>
      </Grow>
    </Box>
  );
};

export default HrDashboard;
