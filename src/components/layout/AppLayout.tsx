import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { Outlet, Link, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const items = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardRoundedIcon /> },
  { label: 'Students', to: '/students', icon: <SchoolRoundedIcon /> },
  { label: 'Admissions', to: '/admissions', icon: <PersonAddAlt1RoundedIcon /> },
  { label: 'Attendance', to: '/attendance', icon: <FactCheckRoundedIcon /> },
  { label: 'Academics', to: '/academics', icon: <MenuBookRoundedIcon /> },
  { label: 'Exams', to: '/exams', icon: <QuizRoundedIcon /> },
  { label: 'Fees', to: '/fees', icon: <PaymentsRoundedIcon /> },
  { label: 'Hostel', to: '/hostel', icon: <ApartmentRoundedIcon /> },
  { label: 'Notifications', to: '/notifications', icon: <NotificationsRoundedIcon /> },
  { label: 'Parent Portal', to: '/parent', icon: <FamilyRestroomRoundedIcon /> },
  { label: 'Student Portal', to: '/student', icon: <PersonRoundedIcon /> },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          ml: `${drawerWidth}px`,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Toolbar>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34 }}>N</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>NexSchool SMS</Typography>
              <Typography variant="body2" color="text.secondary">School management workspace</Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight={700}>Modules</Typography>
        </Toolbar>
        <Divider />
        <List sx={{ px: 1.5, py: 1 }}>
          {items.map((item) => (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={location.pathname === item.to}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, mt: 10, p: 3, ml: `${drawerWidth}px` }}>
        <Outlet />
      </Box>
    </Box>
  );
}
