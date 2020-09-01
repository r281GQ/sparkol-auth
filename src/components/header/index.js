import { css, jsx } from "@emotion/core";

/**
 *  These component elements are just a very tiny
 *  wrapper. We can expand upon these later.
 */
/** @jsx jsx */
const Header = (props) => {
  return (
    <header
      css={css`
        padding: 12px;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          max-width: 600px;
          margin: 0 auto;
        `}
      >
        <div
          css={css`
            display: flex;
            flex: 1;
            justify-content: flex-end;
          `}
        >
          {props.children}
        </div>
      </div>
    </header>
  );
};

export default Header;
