import Logo from "@/assets/images/icon.png";
import { COLORS } from "@/modules/core/constants/COLORS";

interface Props {
  contents: string;
}

const QRCode = ({ contents }: Props) => {
  /* useEffect(() => {
    document.getElementById("qr1")?.addEventListener("codeRendered", () => {
      document
        .getElementById("qr1")
        //@ts-ignore
        ?.animateQRCode((targets, _x, _y, _count, entity) => ({
          targets,
          from: entity === "module" ? Math.random() * 200 : 200,
          duration: 500,
          easing: "cubic-bezier(.5,0,1,1)",
          web: { opacity: [0, 1], scale: [0.5, 1.1, 1] },
        }));
    });
  }, []); */

  return (
    <qr-code
      id="qr1"
      module-color={COLORS.primary[400]}
      position-ring-color={COLORS.primary[600]}
      position-center-color={COLORS.primary[500]}
      contents={contents}
      style={{
        width: 340,
        backgroundColor: COLORS.alto[50],
      }}
    >
      <img src={Logo} slot="icon" />
    </qr-code>
  );
};

export default QRCode;
