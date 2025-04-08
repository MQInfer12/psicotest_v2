import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { Requirements } from "@/modules/features/tests/types/TestType";
import { UserRequiredDTO } from "@/modules/features/users/api/dtos";
import { Genero } from "@/modules/features/users/types/Genero";
import { UserRequiredDTOSchema } from "@/modules/features/users/validations/UserDTO.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Input from "../../Input";
import { TEST_CAROUSEL_VARIANT } from "../constants/TEST_CAROUSEL_VARIANT";
import { toastSuccess } from "@/modules/core/utils/toasts";

interface Props {
  direction: number;
  requirements: Requirements[];
}

const TestRequirements = ({ direction, requirements }: Props) => {
  const { user, setUser } = useUserContext();

  const { postData } = useFetch();
  const userMutation = postData("PUT /user/:id/psicotest");

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
  } = useForm({
    defaultValues: {
      nombre: user?.nombre ?? undefined,
      fecha_nacimiento: user?.fecha_nacimiento ?? undefined,
      genero: user?.genero ?? undefined,
      telefono: user?.telefono ?? undefined,
      nombre_tutor: user?.nombre_tutor ?? undefined,
      telefono_tutor: user?.telefono_tutor ?? undefined,
    },
    context: {
      requirements,
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
      <div className="h-full flex items-center justify-center w-full overflow-auto">
        <form
          id="userForm"
          className="flex flex-col items-center gap-4 px-2 py-4 my-auto w-full"
          onSubmit={handleSubmit(handleSaveUserData)}
        >
          <h2 className="text-sm font-bold pb-4 text-center text-alto-950 dark:text-alto-50">
            Por favor llena tus datos antes de comenzar
          </h2>
          <div
            className="grid w-[640px] gap-4 max-w-full"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(288px, 1fr))`,
            }}
          >
            {requirements.map((r) => {
              switch (r) {
                case Requirements.NOMBRE:
                  return (
                    <Input
                      key={r}
                      label="Nombre"
                      type="text"
                      error={errors.nombre?.message}
                      required
                      {...register("nombre")}
                    />
                  );
                case Requirements.EDAD:
                  return (
                    <Input
                      key={r}
                      label="Fecha de nacimiento"
                      type="date"
                      error={errors.fecha_nacimiento?.message}
                      required
                      {...register("fecha_nacimiento")}
                    />
                  );
                case Requirements.GENERO:
                  return (
                    <Input
                      key={r}
                      label="Género"
                      error={errors.genero?.message}
                      type="select"
                      required
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
                case Requirements.TELEFONO:
                  return (
                    <Input
                      key={r}
                      label="Teléfono"
                      type="number"
                      error={errors.telefono?.message}
                      required
                      {...register("telefono")}
                    />
                  );
                case Requirements.NOMBRE_TUTOR:
                  return (
                    <Input
                      key={r}
                      label="Nombre del padre / madre / tutor"
                      type="text"
                      error={errors.nombre_tutor?.message}
                      required
                      {...register("nombre_tutor")}
                    />
                  );
                case Requirements.TELEFONO_TUTOR:
                  return (
                    <Input
                      key={r}
                      label="Teléfono del padre / madre / tutor"
                      type="number"
                      error={errors.telefono_tutor?.message}
                      required
                      {...register("telefono_tutor")}
                    />
                  );
              }
            })}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TestRequirements;
