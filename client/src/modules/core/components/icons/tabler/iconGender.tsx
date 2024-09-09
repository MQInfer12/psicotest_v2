interface Props {
  type: "male" | "female" | "none";
}

const IconGender = ({ type }: Props) => {
  switch (type) {
    case "male":
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
          className="icon icon-tabler icons-tabler-outline icon-tabler-gender-male"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 14m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
          <path d="M19 5l-5.4 5.4" />
          <path d="M19 5h-5" />
          <path d="M19 5v5" />
        </svg>
      );
    case "female":
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
          className="icon icon-tabler icons-tabler-outline icon-tabler-gender-female"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 9m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
          <path d="M12 14v7" />
          <path d="M9 18h6" />
        </svg>
      );
    case "none":
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
          className="icon icon-tabler icons-tabler-outline icon-tabler-gender-neutrois"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 10a5 5 0 1 1 0 10a5 5 0 0 1 0 -10z" />
          <path d="M12 10v-7" />
        </svg>
      );
  }
};

export default IconGender;
