import {
  ErrorComponentProps,
  LinkOptions,
  Navigate,
} from "@tanstack/react-router";
import { BuildedError } from "../../hooks/useFetch/utils/handleResponse";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { useLayoutEffect } from "react";
import Icon from "../icons/Icon";

interface Props extends ErrorComponentProps {
  to?: LinkOptions["to"];
}

const ErrorComponent = ({ error, to }: Props) => {
  const buildedError: BuildedError = JSON.parse(error.message);
  const { logout } = useUserContext();

  useLayoutEffect(() => {
    if (buildedError.status === 401) {
      logout();
    }
  }, []);

  if (to) return <Navigate to={to} />;
  return (
    <div className="w-full h-full flex gap-4 flex-col items-center justify-center">
      <div className="w-52 aspect-square text-danger/80">
        <Icon type={Icon.Types.SAD} />
      </div>
      <p className="font-bold text-alto-800">{buildedError.message}</p>
    </div>
  );
};

export default ErrorComponent;
