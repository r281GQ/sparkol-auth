import { jsx } from "@emotion/core";

import { useMe, useLogout } from "../../services/auth";

import Header from "../../components/header";
import Layout from "../../components/layout";
import Main from "../../components/main";

/**
 * Home is protected but the logic is not tied to <Home />.
 *
 * Other components might be private in the future.
 *
 * See <PrivateRoute /> for implementation.
 *
 * It uses the useMe hook for getting the user and the useLogout hook to log out.
 */
/** @jsx jsx */
const Home = () => {
  const user = useMe();
  const [logout] = useLogout();

  return (
    <Layout>
      <Header>
        <div>
          <button onClick={logout}>log out</button>
        </div>
      </Header>
      <Main>{`Welcome ${user.name}!`}</Main>
    </Layout>
  );
};

export default Home;
