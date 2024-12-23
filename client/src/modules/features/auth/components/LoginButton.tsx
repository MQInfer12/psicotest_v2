import { GOOGLE_CLIENT_ID } from "@/modules/core/constants/ENVIRONMENT";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useLoginContext } from "../context/LoginContext";

interface Props {
  size: "medium" | "large";
  type?: "standard" | "icon";
}

const LoginButton = ({ size, type }: Props) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginBtn />
    </GoogleOAuthProvider>
  );
};

const LoginBtn = () => {
  const { handleLogin } = useLoginContext();
  const handleLoginBtn = useGoogleLogin({
    onSuccess: handleLogin,
    scope: "https://www.googleapis.com/auth/calendar.events",
  });
  return <button onClick={() => handleLoginBtn()}>Login</button>;
};

export default LoginButton;
