import { toast, ExternalToast } from "sonner";
import Icon from "../components/icons/Icon";
import { COLORS } from "../constants/COLORS";

interface Options extends ExternalToast {
  title?: string;
}

interface ConfirmOptions extends Options {
  cancelable?: boolean;
  onCancel?: () => void;
}

export const toastSuccess = (message: string, data?: Options) => {
  toast(data?.title || "Éxito", {
    icon: (
      <div className="w-5 h-5 text-emerald-500">
        <Icon type={Icon.Types.CHECK} />
      </div>
    ),
    description: message,
    ...data,
  });
};

export const toastError = (message: string, data?: Options) => {
  toast(data?.title || "Error", {
    icon: (
      <div className="w-5 h-5 text-rose-500">
        <Icon type={Icon.Types.X} />
      </div>
    ),
    description: message,
    ...data,
  });
};

export const toastConfirm = (
  message: string,
  onSuccess: () => void,
  data?: ConfirmOptions
) => {
  toast(data?.title || "¿Estás seguro?", {
    icon: (
      <div className="w-5 h-5 text-amber-500">
        <Icon type={Icon.Types.QUESTION} />
      </div>
    ),
    description: message,
    action: {
      label: "Confirmar",
      onClick: onSuccess,
    },
    cancel: data?.cancelable
      ? {
          label: "Cancelar",
          onClick: () => {
            data.onCancel?.();
          },
        }
      : undefined,
    dismissible: data?.cancelable,
    actionButtonStyle: {
      backgroundColor: COLORS.primary[800],
    },
    cancelButtonStyle: {
      backgroundColor: COLORS.alto[50],
      color: COLORS.alto[950],
    },
    ...data,
  });
};
