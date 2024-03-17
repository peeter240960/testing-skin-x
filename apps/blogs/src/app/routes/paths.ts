const ROOTS = {
  AUTH: '/auth',
};

// ----------------------------------------------------------------------

export const paths = {
  root: '/',
  post: {
    root: `/post`,
    details: (id: string) => `/post/${id}`,
  },
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/login`,
    },
  },
};
