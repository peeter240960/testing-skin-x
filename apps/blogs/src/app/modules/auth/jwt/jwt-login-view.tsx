import { Button, Card, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useLoginMutation } from '../../../graphql/generated';
import AlertApolloError from '../../../components/alert-apollo-error';
import { useSetAtom } from 'jotai';
import { authAtom } from '../../../auth/store/jwt';

export default function JwtLoginView() {
  const [callLogin, callLoginResponse] = useLoginMutation();
  const setAuth = useSetAtom(authAtom);
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { data } = await callLogin({
        variables: {
          username: form.username,
          password: form.password,
        },
      });
      setAuth(data?.login);
    },
    [callLogin, form.password, form.username, setAuth]
  );

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={onSubmit}>
        <Stack spacing={1.5}>
          <AlertApolloError error={callLoginResponse.error} />
          <Typography variant="h6" p={0} m={0}>
            Login
          </Typography>
          <TextField
            size="small"
            label="Username"
            name="username"
            variant="standard"
            onChange={onInputChange}
            value={form['username']}
            required
          />
          <TextField
            size="small"
            type="password"
            name="password"
            label="Password"
            variant="standard"
            onChange={onInputChange}
            value={form['password']}
            required
          />
          <Button
            variant="contained"
            type="submit"
            disabled={callLoginResponse.loading}
          >
            Login
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
