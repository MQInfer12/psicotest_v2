import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "@/modules/core/constants/ENVIRONMENT";

interface Props {
  size: "medium" | "large";
  handleLogin: (data: CredentialResponse) => void;
}

const LoginButton = ({ size, handleLogin }: Props) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        width={220}
        onSuccess={handleLogin}
        shape="circle"
        size={size}
      />
    </GoogleOAuthProvider>
  );
};

export default LoginButton;
