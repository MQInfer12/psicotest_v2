import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { Requirements } from "@/modules/features/tests/types/TestType";
import { UserRequiredDTO } from "@/modules/features/users/api/dtos";
import { Genero } from "@/modules/features/users/types/Genero";
import { UserRequiredDTOSchema } from "@/modules/features/users/validations/UserDTOSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Input from "../../Input";
import { TEST_CAROUSEL_VARIANT } from "../constants/TEST_CAROUSEL_VARIANT";

interface Props {
  direction: number;
  requirements: Requirements[];
}

const TestRequirements = ({ direction, requirements }: Props) => {
  const { user, setUser } = useUserContext();

  const { postData } = useFetch();
  const userMutation = postData("PUT /user/:id");

  const handleSaveUserData = (form: UserRequiredDTO) => {
    userMutation(form, {
      params: {
        id: String(user?.email),
      },
      onSuccess: (res) => {
        toastSuccess(res.message);
        setUser(res.data);
      },
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRequiredDTO>({
    defaultValues: {
      fecha_nacimiento: user?.fecha_nacimiento ?? undefined,
      genero: user?.genero ?? undefined,
    },
    resolver: yupResolver(UserRequiredDTOSchema),
  });

  return (
    <motion.div
      variants={TEST_CAROUSEL_VARIANT}
      custom={direction}
      initial="enter"
      animate="active"
      exit="exit"
      className="absolute inset-0 flex flex-col items-center justify-center"
    >
      <form
        id="userForm"
        className="flex flex-col gap-4 px-2 w-72"
        onSubmit={handleSubmit(handleSaveUserData)}
      >
        <h2 className="text-sm font-bold pb-4 text-center">
          Por favor llena tus datos antes de comenzar
        </h2>
        {requirements.map((r) => {
          switch (r) {
            case Requirements.EDAD:
              return (
                <Input
                  label="Fecha de nacimiento"
                  type="date"
                  error={errors.fecha_nacimiento?.message}
                  {...register("fecha_nacimiento")}
                />
              );
            case Requirements.GENERO:
              return (
                <Input
                  label="Género"
                  error={errors.genero?.message}
                  type="select"
                  {...register("genero")}
                >
                  <option value="">Sin especificar</option>
                  {Object.values(Genero).map((genero) => (
                    <option key={genero} value={genero}>
                      {genero}
                    </option>
                  ))}
                </Input>
              );
          }
        })}
      </form>
    </motion.div>
  );
};

export default TestRequirements;