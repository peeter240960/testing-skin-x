import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { IconButton, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Iconify from '../../components/iconify';
import { useLogoutMutation } from '../../graphql/generated';
import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { authAtom } from '../../auth/store/jwt';
import { clearStorage } from '../../utils';

// ----------------------------------------------------------------------

export default function Header() {
  const [callLogout, callLogoutResponse] = useLogoutMutation();
  const [auth, setAuth] = useAtom(authAtom);
  const onLogout = useCallback(async () => {
    if (auth?.refreshToken) {
      await callLogout({
        variables: {
          refreshToken: auth.refreshToken,
        },
      });
      setAuth(undefined)
      clearStorage()
    }
  }, [auth?.refreshToken, callLogout, setAuth]);

  return (
    <AppBar
      position="static"
      sx={{
        background: 'transparent',
        boxShadow: 'none',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          height: 60,
          borderBottom: `1px solid rgba(145, 158, 171, 0.16)`,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            height: 1,
            display: 'flex',
            alignItems: 'center',
            color: 'black',
          }}
        >
          <Typography>Logo</Typography>
          <Box sx={{ flexGrow: 1 }} />
          {auth?.refreshToken && (
            <IconButton
              disabled={callLogoutResponse.loading}
              onClick={onLogout}
            >
              <Iconify icon={'uit:signout'} />
            </IconButton>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
}
