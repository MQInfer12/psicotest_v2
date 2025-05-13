import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import UserResumeStarted from "./UserResumeStarted";
import { User } from "@/modules/features/users/api/responses";
import { useUserResumeContext } from "../../context/UserResumeContext";

interface Props {
  user: User;
}

const UserResume = ({ user }: Props) => {
  const { started, setStarted } = useUserResumeContext();

  if (!started) {
    return (
      <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
        <small className="text-alto-950 dark:text-alto-50 opacity-60 max-w-80 text-center">
          Obtén un resumen acerca del historial confirmado del paciente y haz
          tus propias preguntas.
        </small>
        <Button
          onClick={() => {
            setStarted(true);
          }}
          icon={Icon.Types.GPT}
        >
          Empezar
        </Button>
        <small className="text-alto-950 dark:text-alto-50 opacity-30 max-w-80 text-balance text-center">
          No se guardará ninguna información generada en este chat
        </small>
      </div>
    );
  }

  return <UserResumeStarted user={user} />;
};

export default UserResume;
