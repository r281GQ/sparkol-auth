import { css, jsx } from "@emotion/core";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import Layout from "../../components/layout";
import Main from "../../components/main";

import { useLogin } from "../../services/auth";

/**
 * We have a simple form to take care of the <input /> elements.
 *
 * On successful login it redirects to "/".
 *
 * The useLogin hook takes care of the login process, the form does not need to know about it.
 */
/** @jsx jsx */
const Login = () => {
  const { register, handleSubmit } = useForm();
  const { push } = useHistory();
  const [login, { error }] = useLogin();

  const onSubmit = async (data) => {
    try {
      await login(data);

      push("/");
    } catch {}
  };

  return (
    <Layout>
      <Main>
        <form
          css={css`
            margin-top: 30vh;
            display: flex;
            flex-direction: column;
          `}
          onSubmit={handleSubmit(onSubmit)}
        >
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
          <input type="submit" value="log in" />
          {error && (
            <div
              css={css`
                margin-bottom: 8px;
                text-align: center;
                color: red;
              `}
            >
              {error}
            </div>
          )}
        </form>
      </Main>
    </Layout>
  );
};

export default Login;
