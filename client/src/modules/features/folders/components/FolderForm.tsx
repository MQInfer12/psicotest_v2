import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../auth/context/UserContext";
import { FolderDTO } from "../api/dtos";
import { Folder } from "../api/responses";
import { FolderDTOSchema } from "../validations/FolderDTO.schema";
import { Permisos } from "../../auth/types/Permisos";

interface Props {
  folder: Folder | null;
  id_grupo: number | null;
  onSuccess: (folder: Folder) => void;
  onSuccessDelete?: (item: Folder) => void;
}

const FolderForm = ({
  onSuccess,
  onSuccessDelete,
  folder,
  id_grupo,
}: Props) => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();
  const postMutation = postData("POST /carpeta");
  const putMutation = postData("PUT /carpeta/:id");
  const deleteMutation = postData("DELETE /carpeta/:id");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FolderDTO>({
    defaultValues: {
      descripcion: folder?.descripcion,
      id_grupo,
    },
    resolver: yupResolver(FolderDTOSchema),
  });

  const onSubmit = (form: FolderDTO) => {
    setLoading(true);
    if (!folder) {
      postMutation(form, {
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccess(res.data);
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    } else {
      putMutation(form, {
        params: {
          id: folder.id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccess(res.data);
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (!folder) return;
    toastConfirm("¿Quieres eliminar la carpeta permanentemente?", () => {
      setLoading(true);
      deleteMutation(null, {
        params: {
          id: folder.id,
        },
        onSuccess(res) {
          toastSuccess(res.message);
          onSuccessDelete?.(folder);
        },
        onSettled() {
          setLoading(false);
        },
      });
    });
  };

  const isMine =
    folder &&
    !folder.global &&
    (user?.permisos.includes(Permisos.VER_TODAS_LAS_CARPETAS) ||
      folder.email_user === user?.email);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Descripción"
        error={errors.descripcion?.message}
        {...register("descripcion")}
        required
      />
      {isMine && (
        <Input
          label="Grupo"
          error={errors.id_grupo?.message}
          type="select"
          required
          {...register("id_grupo")}
        >
          <option value="">Carpetas propias</option>
          {user?.grupos.map((grupo) => (
            <option key={grupo.id} value={grupo.id}>
              {grupo.descripcion}
            </option>
          ))}
        </Input>
      )}
      <div className="flex items-center w-full gap-2">
        <Button className="flex-1" disabled={loading} type="submit">
          Enviar
        </Button>
        {isMine && (
          <Button
            btnType="secondary"
            className="flex-1"
            disabled={loading}
            type="button"
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        )}
      </div>
    </form>
  );
};

export default FolderForm;
