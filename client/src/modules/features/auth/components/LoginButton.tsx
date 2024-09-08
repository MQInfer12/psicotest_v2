import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { useUserContext } from "../context/UserContext";
import useFetch from "@/modules/core/hooks/useFetch";
import { GOOGLE_CLIENT_ID } from "@/modules/core/constants/ENVIRONMENT";
import { toastSuccess } from "@/modules/core/utils/toasts";

const LoginButton = () => {
  const { login } = useUserContext();
  const { postData } = useFetch();
  const loginMutation = postData("POST /login");

  const handleLogin = (data: CredentialResponse) => {
    if (!data.credential) return;
    loginMutation(
      {
        token: data.credential,
      },
      {
        onSuccess: (res) => {
          login(res.data.user, res.data.token);
          toastSuccess(res.message);
        },
      }
    );
  };
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={handleLogin} shape="circle" size="medium" />
    </GoogleOAuthProvider>
  );
};

export default LoginButton;
