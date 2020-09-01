import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route } from "react-router-dom";

import Home from "./../routes/home";
import Login from "../routes/login";

import Auth from "./../services/auth";

import { PrivateRoute } from "../utils";

describe("<Home />", () => {
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
        <MemoryRouter>
          <PrivateRoute path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
        </MemoryRouter>
      </Auth>
    );
  });

  test("when unauthenticated, it should redirect to <Login />", () => {
    const { getByText } = render(
      <Auth>
        <MemoryRouter initialentries={["/"]}>
          <PrivateRoute path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
        </MemoryRouter>
      </Auth>
    );

    /**
     * Initial entry was set to "/" yet we are in the <Login /> page
     */
    expect(getByText("log in")).toBeInTheDocument();
  });

  test("when logged in, should redirect to <Home /> with a greetings message", async () => {
    const { getByText, getByPlaceholderText } = render(
      <Auth>
        <MemoryRouter initialentries={["/"]}>
          <PrivateRoute path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
        </MemoryRouter>
      </Auth>
    );

    expect(getByText("log in")).toBeInTheDocument();

    const username = getByPlaceholderText("username");
    const password = getByPlaceholderText("password");

    const logInButton = getByText("log in");

    userEvent.type(username, "John");
    userEvent.type(password, "password");

    await act(async () => {
      userEvent.click(logInButton);
      await waitFor(() => {
        /**
         * After providing the credential we see the welcome message.
         */
        const welcomeMessage = getByText("Welcome John!");

        return expect(welcomeMessage).toBeInTheDocument();
      });
      await waitFor(() => {
        /**
         * Also we have a logout button.
         */
        const logoutButton = getByText("log out");

        return expect(logoutButton).toBeInTheDocument();
      });
    });
  });

  test("when logged out, should be redirected to <Login />", async () => {
    const { getByText, getByPlaceholderText } = render(
      <Auth>
        <MemoryRouter initialentries={["/"]}>
          <PrivateRoute path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
        </MemoryRouter>
      </Auth>
    );

    expect(getByText("log in")).toBeInTheDocument();

    const username = getByPlaceholderText("username");
    const password = getByPlaceholderText("password");

    const logInButton = getByText("log in");

    userEvent.type(username, "John");
    userEvent.type(password, "password");

    await act(async () => {
      userEvent.click(logInButton);
      await waitFor(() => {
        const welcomeMessage = getByText("Welcome John!");

        return expect(welcomeMessage).toBeInTheDocument();
      });
      await waitFor(() => {
        const logoutButton = getByText("log out");

        return expect(logoutButton).toBeInTheDocument();
      });
    });

    const logoutButton = getByText("log out");

    userEvent.click(logoutButton);

    /**
     * After logout the <input name="username" /> is in the DOM again.
     */
    expect(getByPlaceholderText("username")).toBeInTheDocument();
  });
});
