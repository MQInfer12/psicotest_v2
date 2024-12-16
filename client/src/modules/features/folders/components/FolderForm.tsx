import Input from "@/modules/core/components/ui/Input";
import { useForm } from "react-hook-form";
import { FolderDTO } from "../api/dtos";
import { Folder } from "../api/responses";
import { yupResolver } from "@hookform/resolvers/yup";
import { FolderDTOSchema } from "../validations/FolderDTO.schema";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import Button from "@/modules/core/components/ui/Button";
import { useState } from "react";
import Icon from "@/modules/core/components/icons/Icon";

interface Props {
  folder: Folder | null;
  onSuccess: (folder: Folder) => void;
  onSuccessDelete?: (item: Folder) => void;
}

const FolderForm = ({ onSuccess, onSuccessDelete, folder }: Props) => {
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
    setLoading(true);
    toastConfirm("¿Quieres eliminar la carpeta permanentemente?", () => {
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

  const link = folder
    ? `${window.location.origin}/folder/${folder.id}`
    : undefined;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {link && (
        <div className="flex items-end gap-2">
          <Input label="Compartir carpeta" disabled value={link} readOnly />
          <Button
            type="button"
            btnType="secondary"
            icon={Icon.Types.CLIPBOARD}
            onClick={() => {
              navigator.clipboard.writeText(link).then(() => {
                toastSuccess("Enlace copiado al portapapeles correctamente");
              });
            }}
          />
        </div>
      )}
      <Input
        label="Descripción"
        error={errors.descripcion?.message}
        {...register("descripcion")}
      />
      <div className="flex items-center w-full gap-2">
        <Button className="flex-1" disabled={loading} type="submit">
          Enviar
        </Button>
        {folder && (
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
