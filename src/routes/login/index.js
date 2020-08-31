import { css, jsx } from "@emotion/core";
import { useForm } from "react-hook-form";

/** @jsx jsx */
const Login = (props) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data);
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        css={css`
          margin-bottom: 8px;
        `}
      >
        <input
          name="username"
          defaultValue="jeff1967"
          placeholder="username"
          ref={register}
        />
      </div>
      <div
        css={css`
          margin-bottom: 8px;
        `}
      >
        <input
          name="password"
          defaultValue="hotdog"
          placeholder="password"
          type="password"
          ref={register}
        />
      </div>
      <input type="submit" value="log in" />
    </form>
  );
};

export default Login;
