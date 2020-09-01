import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";

import Login from "./../routes/login";
import Auth from "./../services/auth";
import { useHistory } from "react-router-dom";

jest.mock("react-router-dom", () => {
  const push = jest.fn();
  return {
    useHistory: () => {
      return { push };
    },
  };
});

describe("<Login />", () => {
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

    const { push } = useHistory();

    const username = getByPlaceholderText("username");
    const password = getByPlaceholderText("password");

    const logInButton = getByText("log in");

    userEvent.type(username, "John");
    userEvent.type(password, "password");

    await act(async () => {
      userEvent.click(logInButton);
      await waitFor(() => {
        return expect(push).toHaveBeenCalledWith("/");
      });
    });
  });
});
