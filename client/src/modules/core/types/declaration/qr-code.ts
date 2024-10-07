declare global {
  namespace JSX {
    interface IntrinsicElements {
      "qr-code": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        contents?: string;
        children?: React.ReactNode;
      };
    }
  }
}
