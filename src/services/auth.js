import React from "react";

const AuthContext = React.createContext();

const Auth = (props) => {
  const login = React.useCallback(() => {}, []);

  const logout = React.useCallback(() => {}, []);

  const user = {};

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default Auth;
