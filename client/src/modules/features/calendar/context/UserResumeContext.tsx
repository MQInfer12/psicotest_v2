import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { createContext, useContext, useRef, useState } from "react";
import { User } from "../../users/api/responses";
import { Appointment } from "../api/responses";
import { App_Configuracion } from "../../settings/api/responses";

interface Ctx {
  started: boolean;
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  generatingRef: React.MutableRefObject<boolean>;
  generating: boolean;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  citas: Appointment[] | undefined;
  config: App_Configuracion | undefined;
}

const UserResumeContext = createContext<Ctx | null>(null);

interface Props {
  user: User;
  children: React.ReactNode;
}

interface Message {
  question: string | null;
  answer: string | null;
}

export const UserResumeContextProvider = ({ user, children }: Props) => {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      question: "Resumen inicial",
      answer: null,
    },
  ]);
  const [question, setQuestion] = useState("");
  const generatingRef = useRef(false);
  const [generating, setGenerating] = useState(true);

  const { fetchData } = useFetch();
  const { data: citas } = fetchData([
    "GET /cita/paciente/:email/psicotest",
    {
      email: user.email,
    },
  ]);

  const { data: config } = fetchData("GET /configuracion");

  return (
    <UserResumeContext.Provider
      value={{
        started,
        setStarted,
        index,
        setIndex,
        messages,
        setMessages,
        question,
        setQuestion,
        generatingRef,
        generating,
        setGenerating,
        citas,
        config,
      }}
    >
      {children}
    </UserResumeContext.Provider>
  );
};

export const useUserResumeContext = () => {
  const context = useContext(UserResumeContext);
  if (!context) {
    throw new Error(
      "this contexts must be used whitin a UserResumeContextProvider"
    );
  }
  return context;
};
