import clsx from "clsx";
import Icon, { ICON } from "../../../icons/Icon";

type StateColor = "success" | "alto" | "warning" | "danger";

interface Props {
  data: {
    text: string;
    color: StateColor;
    condition: boolean;
    onClick?: () => void;
    icon?: ICON;
  }[];
}

const StateColumn = ({ data }: Props) => {
  const activeState = data.find((item) => item.condition);

  const getColorsByState = () => {
    switch (activeState?.color) {
      case "success":
        return "bg-success/10 text-success";
      case "alto":
        return "bg-alto-600/10 text-alto-600";
      case "warning":
        return "bg-warning/10 text-warning";
      case "danger":
        return "bg-danger/10 text-danger";
      default:
        return "";
    }
  };

  return (
    <div className="flex w-full justify-center">
      <button
        className={clsx(
          "px-2 py-[2px] text-xs font-medium rounded-md flex items-center justify-center gap-1",
          getColorsByState()
        )}
        onClick={activeState?.onClick}
        disabled={!activeState?.onClick}
      >
        {activeState?.text}
        {activeState?.icon && (
          <div className="h-3 w-3">
            <Icon type={activeState.icon} />
          </div>
        )}
      </button>
    </div>
  );
};

export default StateColumn;
