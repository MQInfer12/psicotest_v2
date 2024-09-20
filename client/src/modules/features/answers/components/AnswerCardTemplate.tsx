interface Props {
  title: string;
  gridArea: string;
  children?: React.ReactNode;
}

const AnswerCardTemplate = ({ title, gridArea, children }: Props) => {
  return (
    <div
      style={{
        gridArea,
      }}
      className="w-full h-full flex flex-col gap-2 overflow-hidden"
    >
      <h3 className="text-xl pl-2 font-bold">{title}</h3>
      <div className="flex-1 flex flex-col bg-alto-50 rounded-lg overflow-hidden border border-alto-200/80">
        {children}
      </div>
    </div>
  );
};

export default AnswerCardTemplate;
