import { DisplayAttribute } from "@aries-bifold/oca/build/formatters/Credential";
import startCase from "lodash.startcase";
import { Text } from "react-native";

function AttributeLabel({
  attribute,
  styles,
}: {
  attribute: DisplayAttribute;
  styles?: any | any[];
}) {
  return (
    <Text style={styles}>{attribute.label ?? startCase(attribute.name)}</Text>
  );
}

export default AttributeLabel;
