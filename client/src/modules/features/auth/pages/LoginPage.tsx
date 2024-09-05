import { GOOGLE_CLIENT_ID } from "@/modules/core/constants/ENVIRONMENT";
import useFetch from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { useUserContext } from "../context/UserContext";

const LoginPage = () => {
  const { login } = useUserContext();
  const { postData } = useFetch();
  const loginMutation = postData("POST /login");

  const handleLogin = (data: CredentialResponse) => {
    if (!data.credential) return;
    loginMutation.mutate(
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
      <div className="h-full flex items-center justify-center bg-[#121212]">
        <GoogleLogin onSuccess={handleLogin} shape="circle" size="medium" />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
