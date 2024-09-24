import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "@/modules/core/constants/ENVIRONMENT";
import { useLoginContext } from "../context/LoginContext";

interface Props {
  size: "medium" | "large";
  type?: "standard" | "icon";
}

const LoginButton = ({ size, type }: Props) => {
  const { handleLogin } = useLoginContext();
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        width={220}
        onSuccess={handleLogin}
        shape="square"
        type={type}
        size={size}
      />
    </GoogleOAuthProvider>
  );
};

export default LoginButton;
