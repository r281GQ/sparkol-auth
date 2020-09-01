import { css, jsx } from "@emotion/core";

import { useMe, useLogout } from "../../services/auth";

/** @jsx jsx */
const Home = () => {
  const user = useMe();
  const [logout] = useLogout();

  return (
    <div>
      <button onClick={logout}>log out</button>
      <div>{`Welcome ${user.name}!`}</div>
    </div>
  );
};

export default Home;
