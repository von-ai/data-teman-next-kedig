export const fetchWithSessionRefresh = async (url, options = {}) => {
  let res = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  if (res.status === 401) {
    const refresh = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session/refresh`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    if (refresh.ok) {
      res = await fetch(url, {
        ...options,
        credentials: 'include',
      });
    } else {
      setTimeout(() => {
        window.location.href = '/login';
      });
    }
  }

  return res;
};
