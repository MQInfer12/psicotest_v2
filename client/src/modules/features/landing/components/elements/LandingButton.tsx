import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  type?: "primary" | "secondary";
}

const LandingButton = ({ children, onClick, type = "primary" }: Props) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "max-sm:text-sm whitespace-nowrap p-2 px-6 rounded-md transition-all duration-300 max-w-max border",
        {
          "border-primary-500 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white":
            type === "primary",
          "border-alto-200 dark:border-alto-800 bg-alto-50 dark:bg-alto-950 hover:bg-alto-100 hover:dark:bg-alto-900 active:bg-alto-200 active:dark:bg-alto-800 text-primary-800 dark:text-primary-200":
            type === "secondary",
        }
      )}
    >
      {children}
    </button>
  );
};

export default LandingButton;
