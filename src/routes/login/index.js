import { css, jsx } from "@emotion/core";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { useLogin } from "../../services/auth";

/** @jsx jsx */
const Login = () => {
  const { register, handleSubmit } = useForm();
  const { push } = useHistory();
  const [login] = useLogin();

  const onSubmit = async (data) => {
    try {
      await login(data);

      push("/");
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        css={css`
          margin-bottom: 8px;
        `}
      >
        <input name="username" placeholder="username" ref={register} />
      </div>
      <div
        css={css`
          margin-bottom: 8px;
        `}
      >
        <input
          name="password"
          placeholder="password"
          type="password"
          ref={register}
        />
      </div>
      <button type="submit" value="log in">
        log in
      </button>
    </form>
  );
};

export default Login;
