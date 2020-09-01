import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useHistory } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";

import Login from "./../routes/login";

import Auth from "./../services/auth";

/**
 * Just mock the whole react-router-dom library.
 */
jest.mock("react-router-dom", () => {
  const push = jest.fn();
  return {
    useHistory: () => {
      return { push };
    },
  };
});

describe("<Login />", () => {
  /**
   * We need this later to match against.
   */
  const { push } = useHistory();

  /**
   * This mocks the API on the network level. No need to mock functions at all.
   */
  const worker = setupServer(
    rest.post(`http://localhost:3333/login`, (req, res, ctx) => {
      return res(ctx.json({ user: { id: 1, name: "John" }, token: "token" }));
    })
  );

  beforeAll(() => {
    worker.listen();
  });

  afterAll(() => {
    worker.close();
  });

  beforeEach(() => {
    push.mockClear();
  });

  test("renders without crash", () => {
    render(
      <Auth>
        <Login />
      </Auth>
    );
  });

  test("renders username, password and submit elements", () => {
    const { getByPlaceholderText, getByText } = render(
      <Auth>
        <Login />
      </Auth>
    );

    const username = getByPlaceholderText("username");
    const password = getByPlaceholderText("password");

    const logInButton = getByText("log in");

    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();

    expect(logInButton).toBeInTheDocument();
  });

  test('successful login should redirect to "/"', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Auth>
        <Login />
      </Auth>
    );

    const username = getByPlaceholderText("username");
    const password = getByPlaceholderText("password");

    const logInButton = getByText("log in");

    userEvent.type(username, "John");
    userEvent.type(password, "password");

    await act(async () => {
      userEvent.click(logInButton);
      await waitFor(() => {
        /**
         * We assume redirection took place by checking is the mocked version of push was called.
         */
        return expect(push).toHaveBeenCalledWith("/");
      });
    });
  });

  test("unsuccessful login should render error message", async () => {
    /**
     * Use a different outcome for the login endpoint.
     */
    worker.use(
      rest.post(`http://localhost:3333/login`, (req, res, ctx) => {
        return res(ctx.status(401), ctx.text("Invalid Username or Password"));
      })
    );

    const { getByPlaceholderText, getByText } = render(
      <Auth>
        <Login />
      </Auth>
    );

    const username = getByPlaceholderText("username");
    const password = getByPlaceholderText("password");

    const logInButton = getByText("log in");

    userEvent.type(username, "John");
    userEvent.type(password, "password");

    await act(async () => {
      userEvent.click(logInButton);

      await waitFor(() => {
        /**
         * Check if the error message is in the DOM.
         */
        const errorMessage = getByText("Unauthorized");

        return expect(errorMessage).toBeInTheDocument();
      });
    });
  });
});
