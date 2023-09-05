import React, { CSSProperties } from "react";
import { Image, Text } from "react-native";
import { DisplayAttribute } from "@hyperledger/aries-oca/build/formatters/Credential";

function AttributeValue({
  attribute,
  styles,
  size,
}: {
  attribute: DisplayAttribute;
  styles?: CSSProperties | CSSProperties[];
  size?: number;
}) {
  switch (attribute.characterEncoding) {
    case "base64":
      if (attribute.format?.includes("image")) {
        return (
          <Image
            source={{
              uri: attribute.value,
              height: size,
              width: size,
            }}
            style={{
              marginTop: 4,
            }}
          />
        );
      }
      return null;
    case "utf-8":
      if (attribute.standard === "urn:iso:std:iso:1989") {
        const dateint = attribute.value;

        const year = parseInt(dateint.substring(0, 4));
        const month = parseInt(dateint.substring(4, 6));
        const day = parseInt(dateint.substring(6, 8));

        const date = new Date(year, month - 1, day);
        return <Text style={styles}>{date.toDateString()}</Text>;
      }
      return null;
    default:
      return <Text style={styles}>{attribute.value || "•".repeat(10)}</Text>;
  }
}

export default AttributeValue;
