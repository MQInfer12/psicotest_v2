import { TOKEN_NAME } from "@/modules/core/constants/CONSTANTS";
import useFetch from "@/modules/core/hooks/useFetch";
import { User } from "@/modules/features/users/api/responses";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type UserContextState = "logged" | "unlogged" | "loading";

interface Ctx {
  user: User | null;
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
      mutation.mutate(null, {
        onSuccess: (res) => {
          login(res.data, localStorage.getItem(TOKEN_NAME)!);
        },
      });
    }
  }, []);

  return null;
};

export const UserContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const stateRef = useRef<UserContextState>(
    localStorage.getItem(TOKEN_NAME) ? "loading" : "unlogged"
  );

  const login = useCallback((user: User, token: string) => {
    localStorage.setItem(TOKEN_NAME, token);
    setUser(user);
    stateRef.current = "logged";
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_NAME);
    setUser(null);
    stateRef.current = "unlogged";
  }, []);

  return (
    <UserContext.Provider
      value={{ user, state: stateRef.current, login, logout }}
    >
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
