import { PUBLIC_NAVBAR_HEIGHT } from "../../_layout/constants/LAYOUT_SIZES";
import LoginImg from "@/assets/images/imglogin.png";
import LoginButton from "./LoginButton";

const LoginCard = () => {
  return (
    <div
      style={{
        top: PUBLIC_NAVBAR_HEIGHT + 24,
      }}
      className="z-20 fixed right-20 rounded-xl shadow-xl w-72 h-40 overflow-hidden border-alto-100 border-8 group"
    >
      <div className="w-full h-full relative">
        <div className="w-[130%]">
          <img
            src={LoginImg}
            style={{
              objectPosition: "0 -64px",
            }}
            alt="login-illustration"
            className="object-top group-hover:scale-125 transition-all duration-300 w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-primary-950/40 flex flex-col items-center justify-center p-2 gap-4">
          <p className="text-primary-50 font-bold">¡Inicia sesión ahora!</p>
          <div className="w-fit">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
