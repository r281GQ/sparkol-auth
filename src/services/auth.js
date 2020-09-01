import React from "react";

import { setToken, removeToken } from "../utils";

const MeContext = React.createContext();
const LoginProvider = React.createContext();
const LogoutProvider = React.createContext();

const REMOVE_AUTH = "remove_auth";
const SET_REJECTED_LOGIN = "set_rejected_login";
const SET_RESOLVED_LOGIN = "set_resolved_login";
const SET_START_LOGIN = "set_start_login";

const Auth = (props) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      if (action.type === REMOVE_AUTH) {
        return {
          ...prevState,
          login: {
            ...prevState.login,
            user: undefined,
          },
        };
      }

      if (action.type === SET_START_LOGIN) {
        return {
          ...prevState,
          login: {
            ...prevState.login,
            loading: true,
          },
        };
      }

      if (action.type === SET_RESOLVED_LOGIN) {
        return {
          ...prevState,
          login: {
            user: action.payload.user,
            error: undefined,
            loading: false,
          },
        };
      }

      if (action.type === SET_REJECTED_LOGIN) {
        let error = "Something went wrong.";

        if (action.payload.error.message) {
          error = action.payload.error.message;
        }

        return {
          ...prevState,
          login: {
            user: undefined,
            error,
            loading: false,
          },
        };
      }

      return prevState;
    },
    {
      login: {
        data: undefined,
        loading: false,
        error: undefined,
      },
    }
  );

  const login = React.useCallback(async (data) => {
    try {
      dispatch({ type: SET_START_LOGIN });

      const response = await fetch("http://localhost:3333/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      const json = await response.json();

      setToken(json.token);

      dispatch({
        type: SET_RESOLVED_LOGIN,
        payload: { user: json.user },
      });

      return json;
    } catch (error) {
      dispatch({
        type: SET_REJECTED_LOGIN,
        payload: { error },
      });

      throw error;
    }
  }, []);

  const logout = React.useCallback(() => {
    dispatch({
      type: REMOVE_AUTH,
    });

    removeToken();
  }, []);

  const loginBag = React.useMemo(() => {
    return [
      login,
      {
        user: state.login.user,
        error: state.login.error,
        loading: state.login.loading,
      },
    ];
  }, [login, state.login.user, state.login.error, state.login.loading]);

  const logoutBag = React.useMemo(() => {
    return [logout];
  }, [logout]);

  const user = state.login.user;

  return (
    <LoginProvider.Provider value={loginBag}>
      <LogoutProvider.Provider value={logoutBag}>
        <MeContext.Provider value={user}>{props.children}</MeContext.Provider>
      </LogoutProvider.Provider>
    </LoginProvider.Provider>
  );
};

export const useMe = () => {
  return React.useContext(MeContext);
};

export const useLogin = () => {
  return React.useContext(LoginProvider);
};

export const useLogout = () => {
  return React.useContext(LogoutProvider);
};

export default Auth;
