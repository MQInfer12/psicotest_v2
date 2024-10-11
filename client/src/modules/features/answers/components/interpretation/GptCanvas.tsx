import GPT from "@/assets/images/gpt.png";

interface Props {
  content: string;
}

const GptCanvas = ({ content }: Props) => {
  return (
    <div className="bg-alto-50 flex-1 overflow-x-hidden overflow-y-scroll relative isolate">
      <div className="sticky h-0 w-full top-1/2 flex items-center justify-center -z-10 pointer-events-none overflow-visible">
        <img src={GPT} className="min-w-[540px] h-auto opacity-5" />
      </div>
      <p className="w-full whitespace-pre-line text-sm leading-loose p-4">
        {content}
      </p>
    </div>
  );
};

export default GptCanvas;
