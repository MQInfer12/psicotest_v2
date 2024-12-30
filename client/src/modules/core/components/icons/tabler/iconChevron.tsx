import clsx from "clsx";

interface Props {
  type: "left" | "right" | "down";
}

const IconChevron = ({ type }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx(
        "icon icon-tabler icons-tabler-outline icon-tabler-chevron-left",
        {
          "rotate-180": type === "right",
          "-rotate-90": type === "down",
        }
      )}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 6l-6 6l6 6" />
    </svg>
  );
};

export default IconChevron;
