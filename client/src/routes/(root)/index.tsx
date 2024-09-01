import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../../constants/ENVIRONMENT";
import { createFileRoute } from "@tanstack/react-router";
import useFetch from "../../hooks/useFetch";
import { toastSuccess } from "@/utils/toasts";
import { TOKEN_NAME } from "@/constants/CONSTANTS";
import { useState } from "react";

const Index = () => {
  const { postData } = useFetch();
  const loginMutation = postData<string, { token: string }>("/login");
  const logoutMutation = postData<null, null>("/logout");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem(TOKEN_NAME));

  const handleLogin = (data: CredentialResponse) => {
    if (!data.credential) return;
    loginMutation.mutate(
      {
        token: data.credential,
      },
      {
        onSuccess: (res) => {
          localStorage.setItem(TOKEN_NAME, res.data);
          setLoggedIn(true);
          toastSuccess(res.message);
        },
      }
    );
  };

  const handleLogout = () => {
    logoutMutation.mutate(null, {
      onSuccess: (res) => {
        localStorage.removeItem(TOKEN_NAME);
        setLoggedIn(false);
        toastSuccess(res.message);
      },
    });
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="h-screen w-screen flex items-center justify-center bg-[#121212]">
        {loggedIn ? (
          <button className="text-white" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <GoogleLogin onSuccess={handleLogin} shape="circle" size="medium" />
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export const Route = createFileRoute("/(root)/")({
  component: Index,
});
