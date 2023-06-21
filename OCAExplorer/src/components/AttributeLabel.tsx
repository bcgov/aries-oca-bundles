import React, { CSSProperties } from "react";
import { DisplayAttribute } from "@hyperledger/aries-oca/build/formatters/Credential";
import startCase from "lodash.startcase";
import { Text } from "react-native";

function AttributeLabel({
  attribute,
  styles,
}: {
  attribute: DisplayAttribute;
  styles?: CSSProperties | CSSProperties[];
}) {
  return (
    <Text style={styles}>{attribute.label ?? startCase(attribute.name)}</Text>
  );
}

export default AttributeLabel;
