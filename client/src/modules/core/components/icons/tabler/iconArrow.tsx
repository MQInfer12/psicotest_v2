import clsx from "clsx";

interface Props {
  type: "right" | "left";
}

const IconArrow = ({ type }: Props) => {
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
        "icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right",
        {
          "rotate-180": type === "left",
        }
      )}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l14 0" />
      <path d="M15 16l4 -4" />
      <path d="M15 8l4 4" />
    </svg>
  );
};

export default IconArrow;
