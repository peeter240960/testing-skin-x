import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { authAtom } from '../store/jwt';

// ----------------------------------------------------------------------

export const useAuthContext = () => {
  const [loading, setLoadin] = useState(true);
  const auth = useAtomValue(authAtom);

  useEffect(() => {
    setLoadin(false)
  }, [])
  

  return {
    loading,
    authenticated: !!auth?.account.id,
    account: auth?.account,
  };
};
