let t;

/**
 * Shared mutable state. I rarely use this but this seems a good use-case.
 *
 * Why?
 *
 * No UI state depends on it. Auth state is manages by the <Auth /> service.
 *
 * This data is purely for providing the access token for API requests.
 *
 * It need to bypass potential closures and saves states.
 */
export const setToken = (token) => {
  t = token;
};

export const removeToken = () => {
  t = undefined;
};

export const getToken = () => {
  return t;
};
