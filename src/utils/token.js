let t;

export const setToken = (token) => {
  t = token;
};

export const removeToken = () => {
  t = undefined;
};

export const getToken = () => {
  return t;
};
