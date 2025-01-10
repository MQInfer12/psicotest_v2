import { GOOGLE_CLIENT_ID } from "@/modules/core/constants/ENVIRONMENT";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useLoginContext } from "../context/LoginContext";
import GoogleLogo from "@/assets/images/google.svg";

interface Props {
  type?: "standard" | "icon";
}

const LoginButton = (props: Props) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginBtn {...props} />
    </GoogleOAuthProvider>
  );
};

const LoginBtn = ({ type }: Props) => {
  const { handleLogin } = useLoginContext();

  const handleLoginBtn = useGoogleLogin({
    onSuccess: handleLogin,
    scope: "https://www.googleapis.com/auth/calendar.events",
  });

  return (
    <button
      className="flex gap-4 items-center border border-alto-200 p-2 rounded-md bg-white hover:bg-alto-100 transition-all duration-300"
      onClick={() => handleLoginBtn()}
    >
      <img className="h-6 w-6" src={GoogleLogo} />
      {type === "standard" && (
        <p className="text-sm font-medium text-alto-900">
          Inicia sesión con Google
        </p>
      )}
    </button>
  );
};

export default LoginButton;
