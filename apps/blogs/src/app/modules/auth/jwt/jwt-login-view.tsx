import { Button, Card, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';

export default function JwtLoginView() {
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
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(form);
    },
    [form]
  );

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={onSubmit}>
        <Stack spacing={1.5}>
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
          <Button variant="contained" type="submit">
            Login
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
