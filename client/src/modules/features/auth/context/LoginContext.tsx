import { Modal, useModal } from "@/modules/core/components/ui/modal/useModal";
import { CredentialResponse } from "@react-oauth/google";
import { createContext, useContext, useState } from "react";
import { useUserContext } from "./UserContext";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";

interface Ctx {
  modal: Modal<unknown>;
  open: boolean;
  setOpen: (openOption: unknown) => void;
  handleLogin: (data: CredentialResponse) => void;
  loading: boolean;
}

const LoginContext = createContext<Ctx | null>(null);

interface Props {
  children: React.ReactNode;
}

export const LoginContextProvider = ({ children }: Props) => {
  const { login } = useUserContext();
  const { postData } = useFetch();
  const loginMutation = postData("POST /login");
  const [loading, setLoading] = useState(false);
  const { modal, open, setOpen } = useModal();

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

  return (
    <LoginContext.Provider
      value={{ modal, open, setOpen, handleLogin, loading }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("this contexts must be used whitin a LoginContextProvider");
  }
  return context;
};