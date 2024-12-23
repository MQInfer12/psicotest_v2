const TOKEN_NAME = "psicotest_token";

interface Token {
  token: string;
  access_token: string;
}

export const saveTokens = (token: string, access_token: string) => {
  localStorage.setItem(TOKEN_NAME, JSON.stringify({ token, access_token }));
};

export const getTokens = () => {
  const local = localStorage.getItem(TOKEN_NAME);
  if (!local) return null;
  const tokens = JSON.parse(local) as Token;
  return tokens;
};

export const removeTokens = () => {
  localStorage.removeItem(TOKEN_NAME);
};
