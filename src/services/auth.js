import React from "react";

const AuthContext = React.createContext();

const Auth = (props) => {
  const login = React.useCallback(async (data) => {
    try {
      // start loading state

      const response = await fetch("http://localhost:3333/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      const json = await response.json();

      // set token
      // update resolved

      return json;
    } catch (error) {
      // update rejected

      throw error;
    }
  }, []);

  const logout = React.useCallback(() => {
    // remove user
    // remove token
  }, []);

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
