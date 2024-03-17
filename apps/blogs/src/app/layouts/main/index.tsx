import Box from '@mui/material/Box';

import Header from './header';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Header />
      <Box component="main">{children}</Box>
    </Box>
  );
}
