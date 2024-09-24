import { PUBLIC_NAVBAR_HEIGHT } from "../../_layout/constants/LAYOUT_SIZES";
import LoginImg from "@/assets/images/imglogin.png";
import LoginButton from "./LoginButton";
import { useEffect, useState } from "react";
import Loader from "@/modules/core/components/ui/loader/Loader";
import clsx from "clsx";
import { CredentialResponse } from "@react-oauth/google";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useUserContext } from "../context/UserContext";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { useNavigate } from "@tanstack/react-router";
import { getActiveBreadcrumb } from "../../_layout/components/breadcrumb/utils/getActiveBreadcrumb";

interface Props {
  redirect?: string;
}

const LoginCard = ({ redirect }: Props) => {
  const { login } = useUserContext();
  const { postData } = useFetch();
  const loginMutation = postData("POST /login");
  const [loading, setLoading] = useState(false);
  const { modal, open, setOpen } = useModal();
  const navigate = useNavigate({ from: "/" });

  const handleLogin = (data: CredentialResponse) => {
    if (!data.credential) return;
    setLoading(true);
    loginMutation(
      {
        token: data.credential,
      },
      {
        onSuccess: (res) => {
          login(res.data.user, res.data.token);
          toastSuccess(res.message);
        },
        onError: () => setLoading(false),
      }
    );
  };

  useEffect(() => {
    if (redirect) {
      setOpen(true);
    }
  }, [redirect]);

  return (
    <>
      {/* ON OPEN */}
      {modal(
        "",
        <div
          style={{
            top: PUBLIC_NAVBAR_HEIGHT + 24,
          }}
          className="shadow-2xl w-full h-96 overflow-hidden"
        >
          <div className="w-full h-full relative">
            <img
              src={LoginImg}
              alt="login-illustration"
              className="object-cover w-auto h-full min-h-full max-sm:h-auto max-sm:min-w-[130%]"
            />
            <div
              className={clsx(
                "absolute right-0 top-0 w-80 h-full flex flex-col items-center justify-center p-2 gap-6 transition-all duration-500",
                "max-sm:bg-alto-900/80 max-sm:w-full"
              )}
            >
              {loading ? (
                <Loader text="Iniciando sesión..." whiteOnResponsive />
              ) : (
                <>
                  <p className="font-bold text-xl max-sm:text-alto-50">
                    ¡Inicia sesión ahora!
                  </p>
                  {redirect && (
                    <div className="flex flex-col gap-1 items-center">
                      <small className="max-sm:text-alto-50">
                        Te estás dirigiendo hacia:
                      </small>
                      <strong className="text-primary-800 max-sm:text-primary-300">
                        {getActiveBreadcrumb(redirect.split("?")[0])?.name}
                      </strong>
                    </div>
                  )}
                  <div className="w-fit h-10 flex items-center justify-center">
                    <LoginButton size="large" handleLogin={handleLogin} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        {
          blur: true,
          width: 640,
          onlyContent: true,
          onClose() {
            console.log("closing");
            navigate({ to: "/" });
          },
        }
      )}
      {/* ON CLOSE */}
      {!open && (
        <div
          style={{
            top: PUBLIC_NAVBAR_HEIGHT + 24,
          }}
          className="z-20 fixed right-20 rounded-xl shadow-2xl w-72 h-40 overflow-hidden border-alto-100 border-8"
        >
          <div className="w-full h-full relative">
            <div className="w-[130%]">
              <img
                src={LoginImg}
                style={{
                  objectPosition: "0 -64px",
                }}
                alt="login-illustration"
                className="object-top transition-all duration-300 w-full h-full"
              />
            </div>
            <div
              className={clsx(
                "absolute inset-0 flex flex-col items-center justify-center p-2 gap-4 transition-all duration-500",
                "bg-primary-950/40"
              )}
            >
              {loading ? (
                <div className="-mt-12">
                  <Loader text="" white />
                </div>
              ) : (
                <>
                  <p
                    onClick={() => setOpen(true)}
                    className="text-primary-50 font-bold"
                  >
                    ¡Inicia sesión ahora!
                  </p>
                  <div className="w-fit h-10 flex items-center justify-center">
                    <LoginButton size="medium" handleLogin={handleLogin} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginCard;
