import { css, jsx } from "@emotion/core";

/**
 *  These component elements are just a very tiny
 *  wrapper. We can expand upon these later.
 */
/** @jsx jsx */
const Layout = (props) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      `}
    >
      {props.children}
    </div>
  );
};

export default Layout;
