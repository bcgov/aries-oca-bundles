import React, { CSSProperties } from "react";
import { DisplayAttribute } from "@aries-bifold/oca/build/formatters/Credential";
import startCase from "lodash.startcase";
import { Text } from "react-native";

function AttributeLabel({
  attribute,
  styles,
}: {
  attribute: DisplayAttribute;
  styles?: Record<string, CSSProperties> | Record<string, CSSProperties>[];
}) {
  return (
    <Text style={styles}>{attribute.label ?? startCase(attribute.name)}</Text>
  );
}

export default AttributeLabel;
