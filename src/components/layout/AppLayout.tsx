import { Box, Drawer, List, ListItemButton, ListItemText, Toolbar, AppBar, Typography } from '@mui/material';
import { Outlet, Link } from 'react-router-dom';

const items = [
  ['Dashboard', '/dashboard'],
  ['Students', '/students'],
  ['Admissions', '/admissions'],
  ['Attendance', '/attendance'],
  ['Academics', '/academics'],
  ['Exams', '/exams'],
  ['Fees', '/fees'],
  ['Hostel', '/hostel'],
  ['Notifications', '/notifications'],
  ['Parent Portal', '/parent'],
  ['Student Portal', '/student'],
];

export function AppLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed"><Toolbar><Typography>NexSchool SMS</Typography></Toolbar></AppBar>
      <Drawer variant="permanent" sx={{ width: 240, '& .MuiDrawer-paper': { width: 240, mt: 8 } }}>
        <List>
          {items.map(([label, to]) => (
            <ListItemButton key={to} component={Link} to={to}><ListItemText primary={label} /></ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, ml: 30, mt: 10, p: 3 }}><Outlet /></Box>
    </Box>
  );
}
