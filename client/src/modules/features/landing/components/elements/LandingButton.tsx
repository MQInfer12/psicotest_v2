interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

const LandingButton = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="max-sm:text-sm whitespace-nowrap bg-primary-500 hover:bg-primary-600 active:bg-primary-700 p-2 px-6 rounded-md text-white transition-all duration-300"
    >
      {children}
    </button>
  );
};

export default LandingButton;
