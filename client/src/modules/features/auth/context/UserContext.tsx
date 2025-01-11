import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { User } from "@/modules/features/users/api/responses";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getTokens,
  removeTokens,
  saveTokens,
} from "../utils/localStorageToken";

export type UserContextState = "logged" | "unlogged" | "loading";

interface Ctx {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  state: UserContextState;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const UserContext = createContext<Ctx | null>(null);

interface Props {
  children: React.ReactNode;
}

const GetUser = () => {
  const { state, login } = useUserContext();
  const { postData } = useFetch();
  const mutation = postData("GET /me");

  useEffect(() => {
    if (state === "loading") {
      mutation(null, {
        onSuccess: (res) => {
          const tokens = getTokens();
          if (!tokens) return;
          login(res.data, tokens.token);
        },
      });
    }
  }, []);

  return null;
};

export const UserContextProvider = ({ children }: Props) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<UserContextState>(
    getTokens() ? "loading" : "unlogged"
  );

  const login = useCallback((user: User, token: string) => {
    saveTokens(token);
    setUser(user);
    setState("logged");
  }, []);

  const logout = useCallback(() => {
    removeTokens();
    setUser(null);
    setState("unlogged");
    queryClient.clear();
  }, [queryClient]);

  return (
    <UserContext.Provider value={{ user, setUser, state, login, logout }}>
      {children}
      <GetUser />
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("this contexts must be used whitin a UserContextProvider");
  }
  return context;
};
