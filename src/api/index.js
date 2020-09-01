import { getToken } from "./../utils";

/**
 * A very simple example with the API to show how to forward the token.
 *
 * We can use to token for this API, other REST api's, for graphql. Completely separated from any implementation.
 */
export const verifyToken = async () => {
  try {
    const response = await fetch("http://localhost:3333/verifyToken", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.ok) {
      return "OK";
    } else {
      throw new Error(response.statusText);
    }
  } catch (e) {
    throw e;
  }
};
