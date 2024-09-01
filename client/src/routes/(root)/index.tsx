import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../../constants/ENVIRONMENT";
import { createFileRoute } from "@tanstack/react-router";
import useFetch from "../../hooks/useFetch";
import { toastSuccess } from "@/utils/toasts";

const Index = () => {
  const { postData } = useFetch();
  const mutation = postData<string, { token: string }>("/login");

  const handleLogin = (data: CredentialResponse) => {
    if (!data.credential) return;
    mutation.mutate(
      {
        token: data.credential,
      },
      {
        onSuccess: (res) => {
          toastSuccess(res.message);
        },
      }
    );
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="h-screen w-screen flex items-center justify-center bg-[#121212]">
        <GoogleLogin onSuccess={handleLogin} shape="circle" size="medium" />
      </div>
    </GoogleOAuthProvider>
  );
};

export const Route = createFileRoute("/(root)/")({
  component: Index,
});
