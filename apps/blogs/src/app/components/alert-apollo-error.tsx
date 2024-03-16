import { ApolloError } from '@apollo/client';
import { Alert, AlertProps } from '@mui/material';
interface ConfirmModalProps {
  error?: ApolloError;
}
export default function AlertApolloError({
  error,
  ...props
}: ConfirmModalProps & Omit<AlertProps, 'children'>) {
  if (!error) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  return (
    <Alert severity="error" {...props}>
      {error?.graphQLErrors.map((err) => err.message).join(',')}
    </Alert>
  );
}
