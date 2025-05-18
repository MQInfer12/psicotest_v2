import Button from "@/modules/core/components/ui/Button";
import TextArea from "@/modules/core/components/ui/TextArea";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { NoteDTO } from "@/modules/features/calendar/api/dtos";
import { CalendarNote } from "@/modules/features/calendar/api/responses";
import { NoteDTOSchema } from "@/modules/features/calendar/validations/NoteDTO.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  onSuccess: (data: CalendarNote) => void;
  onSuccessDelete: () => void;
  item?: CalendarNote;
  idCaso?: number;
  idCita?: number;
}

const NoteForm = ({
  onSuccess,
  onSuccessDelete,
  item,
  idCaso,
  idCita,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();

  const { postData } = useFetch();
  const postMutation = postData("POST /nota");
  const putMutation = postData("PUT /nota/:id");
  const deleteMutation = postData("DELETE /nota/:id");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      descripcion: item?.descripcion ?? "",
      id_caso: idCaso,
      id_cita: idCita,
    },
    resolver: yupResolver(NoteDTOSchema),
  });

  const onSubmit = (form: NoteDTO) => {
    setLoading(true);
    if (item) {
      putMutation(form, {
        params: {
          id: item.id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccess(res.data);
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    } else {
      postMutation(form, {
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
    if (!item) return;
    toastConfirm("Se eliminará la nota permanentemente.", () => {
      setLoading(true);
      deleteMutation(null, {
        params: {
          id: item.id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccessDelete();
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    });
  };

  const disabled = item ? user?.email !== item.email_psicologo : false;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        label="Descripción"
        error={errors.descripcion?.message}
        {...register("descripcion")}
        disabled={disabled}
      />
      {!disabled && (
        <div className="flex items-center w-full gap-2">
          <Button className="flex-1" disabled={loading} type="submit">
            Enviar
          </Button>
          {item && (
            <Button
              className="flex-1"
              disabled={loading}
              btnType="secondary"
              danger
              type="button"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          )}
        </div>
      )}
    </form>
  );
};

export default NoteForm;
