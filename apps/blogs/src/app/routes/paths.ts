const ROOTS = {
  AUTH: '/auth',
};

// ----------------------------------------------------------------------

export const paths = {
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
