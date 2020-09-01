import React from "react";

import { setToken, removeToken } from "../utils";

const MeContext = React.createContext();
const LoginProvider = React.createContext();
const LogoutProvider = React.createContext();

const REMOVE_AUTH = "remove_auth";
const SET_REJECTED_LOGIN = "set_rejected_login";
const SET_RESOLVED_LOGIN = "set_resolved_login";
const SET_START_LOGIN = "set_start_login";

/**
 *  The core of the app.
 *
 *  There are so many solution to implement this:
 *
 *  - redux with redux thunk, redux saga
 *  - xstate
 *  - some prefer observables
 *
 *  Why did I choose this instead of the other despite this is a greenfield project.
 *
 *  First, it is a greenfield project from the perspective of the code. I don't know anything about
 *  my teammates. If for example no one have used redux-saga before then and we have limited time
 *  then we might just want to go with things everyone is familiar with **AND** is a good solution.
 *
 *  React's Context API with hooks is simple and powerful at the same time.
 *
 *  That is also the reason why I did not do this app in other language. I might have used ReasonML
 *  but JS/TS is much easier to work with in a group if there is no **ASSUMPTION** on the team.
 *
 *  Second, it is a greenfield project from the web perspective but not from the API.
 *  I don't know if that api is the main api? Or there will be microservices and this just takes care of
 *  authentication. Or graphql will be used?
 *
 *  There is already a limitation of the api even before getting any further. That is, I'd be uncomfortable
 *  with storing the JWT token to local/session storage or javascript web persisted cookies.
 *
 *  So without having any control on the server I'd like to make the least assumption on the direction where the backend
 *  will evolve.
 *
 *  This solution gives plenty of option in the upcoming days.
 *
 *  Graphql will be used? Great. Use apollo or urql and just grab the token from 'utils/token'. Change some
 *  logic around the login function (see below) but the interface remains the same.
 *
 *  More rest api endpoint? Great. Maybe use redux to implement some cache, with redux thunk, or sagas.
 *
 *  Or search for some cache library. Just again, use 'utils/token'.
 *
 *  Plenty of options.
 *
 *  ---
 *
 *  After describing my motivations let me describe how this thing works.
 *
 *  First, since the <Auth /> wraps the whole app I use three providers. That way we can use specific hooks
 *  to get the job done. Every hook gets only the least amount of information -> no unwanted rerenders.
 *
 *  First it the login hook.
 *
 *  That resembles the syntax of react apollo (no coincidence :)). It gives a tuple, with the handler and meta.
 *
 *  The login function under the hood takes care of everything. More on that later.
 *
 *  Logout hook works the same. It just much simpler.
 *
 *  useMe gives back the auth user.
 *
 *  LoginFunction sets the meta, fires the request, sets the token and the user or persist the error.
 *
 *  The state that must be reflected in the UI is taken care by a simple reducer.
 *
 *  The shared mutable state of token is handled by the token util.
 *
 *  Last steps to memoize the callback  and the values that we share with the rest of the app.
 */
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
