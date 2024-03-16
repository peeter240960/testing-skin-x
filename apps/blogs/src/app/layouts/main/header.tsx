'use client';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';

// ----------------------------------------------------------------------

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar
        disableGutters
        sx={{
          height: 60,
          borderBottom: `1px solid rgba(145, 158, 171, 0.16)`,
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          Logo
          <Box sx={{ flexGrow: 1 }} />
          Logout
        </Container>
      </Toolbar>
    </AppBar>
  );
}
