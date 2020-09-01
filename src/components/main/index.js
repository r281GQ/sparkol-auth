import { css, jsx } from "@emotion/core";

/**
 *  These component elements are just a very tiny
 *  wrapper. We can expand upon these later.
 */
/** @jsx jsx */
const Main = (props) => {
  return (
    <main
      css={css`
        display: flex;
        align-items: center;
        flex-direction: column;
        flex: 1;
      `}
    >
      {props.children}
    </main>
  );
};

export default Main;
