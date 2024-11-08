import { numberToRoman } from "@/modules/core/utils/numberToRoman";
import { View } from "@react-pdf/renderer";
import { Text } from "./GptPdf";

interface Props {
  paddingHorizontal: number;
  content: string;
}

const GptPdfContent = ({ content, paddingHorizontal }: Props) => {
  //region parseTitles
  const parseToJSX = (str: string) => {
    const regex =
      /<strong class="title">(.*?)<\/strong>|<span class="vignette">(.*?)<\/span>|<strong class="subtitle">(.*?)<\/strong>/gs;
    let result;
    const elements = [];
    let lastIndex = 0;
    let counter = 0;

    while ((result = regex.exec(str)) !== null) {
      const textBefore = str.substring(lastIndex, result.index).trim();
      if (textBefore) {
        elements.push(textBefore);
      }

      if (result[1]) {
        counter++;
        elements.push(
          <View
            style={{
              marginTop: 8,
              flex: 1,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                width: 32,
                fontWeight: 700,
              }}
            >
              {numberToRoman(counter)}.
            </Text>
            <View
              style={{
                flex: 1,
                gap: 4,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {result[1]}
              </Text>
            </View>
          </View>
        );
      }

      if (result[2]) {
        const vignetteContent = result[2];
        const vignetteRegex =
          /<strong class="vignette-(?:title|t)(?:=|)(?:"|)">(.*?)<\/strong>/g;
        let vignetteResult;
        const vignetteElements = [];

        let lastVignetteIndex = 0;
        while (
          (vignetteResult = vignetteRegex.exec(vignetteContent)) !== null
        ) {
          const vignetteTextBefore = vignetteContent
            .substring(lastVignetteIndex, vignetteResult.index)
            .trim();
          if (vignetteTextBefore) {
            vignetteElements.push(vignetteTextBefore + " ");
          }

          vignetteElements.push(
            <Text
              key={`vignette-title-${vignetteResult.index}`}
              style={{
                fontWeight: 500,
              }}
            >
              {vignetteResult[1]}{" "}
            </Text>
          );

          lastVignetteIndex = vignetteRegex.lastIndex;
        }

        const remainingVignetteText = vignetteContent
          .substring(lastVignetteIndex)
          .trim();
        if (remainingVignetteText) {
          vignetteElements.push(remainingVignetteText);
        }

        elements.push(
          <>
            <View
              style={{
                width: 32,
              }}
            />
            <Text
              style={{
                flex: 1,
                paddingLeft: 16,
              }}
            >
              {vignetteElements}
            </Text>
          </>
        );
      }

      if (result[3]) {
        elements.push(
          <>
            <View
              style={{
                width: 32,
              }}
            />
            <Text
              style={{
                flex: 1,
                fontWeight: 600,
              }}
            >
              {result[3]}
            </Text>
          </>
        );
      }

      lastIndex = regex.lastIndex;
    }

    const remainingText = str.substring(lastIndex).trim();
    if (remainingText) {
      elements.push(remainingText);
    }

    return elements;
  };

  return parseToJSX(content).map((element, i) => (
    <View
      key={i}
      style={{
        paddingHorizontal,
        width: "100%",
        flexDirection: "row",
      }}
    >
      {typeof element === "string" ? (
        <>
          <View
            style={{
              width: 32,
            }}
          />
          <Text style={{ flex: 1 }}>{element}</Text>
        </>
      ) : (
        element
      )}
    </View>
  ));
};

export default GptPdfContent;
