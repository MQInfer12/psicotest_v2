import { numberToRoman } from "@/modules/core/utils/numberToRoman";
import {
  PDFViewer,
  Document,
  Page,
  Text as PDFText,
  View,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import Psicotest from "@/assets/images/logo.png";
import Unifranz from "@/assets/images/unifranz-logo.png";
import PoppinsRegular from "@/assets/fonts/Poppins/Poppins-Regular.ttf";
import PoppinsMedium from "@/assets/fonts/Poppins/Poppins-Medium.ttf";
import PoppinsSemiBold from "@/assets/fonts/Poppins/Poppins-SemiBold.ttf";
import PoppinsBold from "@/assets/fonts/Poppins/Poppins-Bold.ttf";
import PoppinsExtraBold from "@/assets/fonts/Poppins/Poppins-ExtraBold.ttf";
import PoppinsBlack from "@/assets/fonts/Poppins/Poppins-Black.ttf";
import GptPdfContent from "./GptPdfContent";
import { formatDate } from "@/modules/core/utils/formatDate";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";

Font.register({
  family: "Poppins",
  src: PoppinsRegular,
  fontWeight: 400,
});
Font.register({
  family: "Poppins",
  src: PoppinsMedium,
  fontWeight: 500,
});
Font.register({
  family: "Poppins",
  src: PoppinsSemiBold,
  fontWeight: 600,
});
Font.register({
  family: "Poppins",
  src: PoppinsBold,
  fontWeight: 700,
});
Font.register({
  family: "Poppins",
  src: PoppinsExtraBold,
  fontWeight: 800,
});
Font.register({
  family: "Poppins",
  src: PoppinsBlack,
  fontWeight: 900,
});

const styles = StyleSheet.create({
  text: {
    fontSize: 8,
    fontFamily: "Poppins",
    fontWeight: 400,
  },
});

export const Text = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: Record<string, any>;
}) => {
  return (
    <PDFText
      style={{
        ...styles.text,
        lineHeight: 2,
        ...style,
      }}
    >
      {children}
    </PDFText>
  );
};

export interface GptPdfData {
  name: string;
  age: string;
  group: string;
}

interface Props {
  content: string;
  data: GptPdfData;
}

const GptPdf = ({ content, data }: Props) => {
  const paddingHorizontal = 48;

  return (
    <PDFViewer height="100%" width="100%">
      <Document>
        <Page
          size="LETTER"
          style={{
            paddingVertical: 32,
            gap: 4,
          }}
        >
          <View
            style={{
              paddingHorizontal,
              height: 24,
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <Image source={Unifranz} />
            <Image source={Psicotest} />
          </View>
          <Text
            style={{
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            INFORME PSICOLÓGICO
          </Text>
          <View
            style={{
              paddingHorizontal,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                width: 32,
                fontWeight: 700,
              }}
            >
              {numberToRoman(1)}.
            </Text>
            <View
              style={{
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontWeight: 700,
                }}
              >
                DATOS GENERALES
              </Text>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 600,
                      width: 96,
                    }}
                  >
                    Nombre completo
                  </Text>
                  <Text
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    :
                  </Text>
                  <Text>{data.name}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 600,
                      width: 96,
                    }}
                  >
                    Edad
                  </Text>
                  <Text
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    :
                  </Text>
                  <Text>{data.age} años</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 600,
                      width: 96,
                    }}
                  >
                    Grupo
                  </Text>
                  <Text
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    :
                  </Text>
                  <Text>{data.group}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 600,
                      width: 96,
                    }}
                  >
                    Fecha
                  </Text>
                  <Text
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    :
                  </Text>
                  <Text>{formatDate(getTodayUtc())}</Text>
                </View>
              </View>
            </View>
          </View>
          <GptPdfContent
            content={content}
            paddingHorizontal={paddingHorizontal}
          />
          {/* <View
            style={{
              paddingHorizontal,
              width: "100%",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                width: 32,
                fontWeight: 700,
              }}
            >
              {numberToRoman(2)}.
            </Text>
            <View
              style={{
                flex: 1,
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontWeight: 700,
                }}
              >
                INTRODUCCIÓN
              </Text>
              <Text>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime
                atque necessitatibus natus pariatur voluptatibus nulla
                aspernatur dolorum praesentium eveniet! Beatae fuga, ab
                explicabo delectus culpa doloribus harum facere magni suscipit
                quas! Amet veritatis adipisci dicta eos consequuntur animi
                eligendi porro possimus. Maxime velit atque modi aperiam ab
                dolorum delectus odio.
              </Text>
            </View>
          </View> */}
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default GptPdf;
