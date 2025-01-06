import * as yup from "yup";

const TOKEN_NAME = "psicotest_token";

const tokenSchema = yup.object({
  token: yup.string().required(),
  access_token: yup.string().required(),
});

export const removeTokens = () => {
  localStorage.removeItem(TOKEN_NAME);
};

export const saveTokens = (token: string, access_token: string) => {
  localStorage.setItem(TOKEN_NAME, JSON.stringify({ token, access_token }));
};

export const getTokens = () => {
  const local = localStorage.getItem(TOKEN_NAME);
  if (!local) return null;
  try {
    const parsedLocal = JSON.parse(local);
    const tokens = tokenSchema.cast(parsedLocal);
    return tokens;
  } catch {
    
    removeTokens();
    return null;
  }
};
