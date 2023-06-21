import React, { CSSProperties } from "react";
import { Text, View, Image, ImageBackground } from "react-native";
import { useBranding } from "../contexts/Branding";
import { OverlayBundle } from "@hyperledger/aries-oca/build/types";
import { textColorForBackground } from "@hyperledger/aries-oca/build/utils/color";
import { CredentialExchangeRecord } from "@aries-framework/core";
import { useMemo, useState } from "react";
import { CredentialFormatter, DisplayAttribute, LocalizedCredential } from "@hyperledger/aries-oca/build/formatters/Credential";
import AttributeLabel from "./AttributeLabel";
import AttributeValue from "./AttributeValue";

const width = 360;
const borderRadius = 10;
const padding = width * 0.05;
const logoHeight = width * 0.12;

function computedStyles(): Record<string, CSSProperties> {
  const branding = useBranding();

  return {
    container: {
      backgroundColor:
        branding?.primaryBackgroundColor || "rgba(0, 0, 0, 0.24)",
      borderRadius: borderRadius,
    },
    cardContainer: {
      flexDirection: "row",
      minHeight: 0.33 * width,
    },
    primaryBodyContainer: {
      flexShrink: 1,
      padding,
      margin: -1,
      marginLeft: -1 * logoHeight + padding,
    },
    secondaryBodyContainer: {
      width: logoHeight,
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
      backgroundColor:
        (branding?.backgroundImageSlice
          ? "rgba(0, 0, 0, 0)"
          : branding?.secondaryBackgroundColor) || "rgba(0, 0, 0, 0.24)",
    },
    logoContainer: {
      top: padding,
      left: -1 * logoHeight + padding,
      width: logoHeight,
      height: logoHeight,
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    statusContainer: {
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderTopRightRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
      height: logoHeight,
      width: logoHeight,
      justifyContent: "center",
      alignItems: "center",
    },
    textContainer: {
      color: textColorForBackground(
        branding?.primaryBackgroundColor || "#313132"
      ),
      flexShrink: 1,
    },
    attributeContainer: {
      marginTop: 15,
    },
    label: {
      fontSize: 14,
      fontWeight: "bold",
    },
    labelSubtitle: {
      fontSize: 14,
      fontWeight: "normal",
    },
    normal: {
      fontSize: 18,
      fontWeight: "normal",
    },
  };
}

function IssuerName({
  issuer,
  styles,
}: {
  issuer?: string;
  styles?: Record<string, CSSProperties>;
}) {
  return (
    <View>
      <Text
        style={[
          styles?.label,
          styles?.textContainer,
          {
            lineHeight: 19,
            opacity: 0.8,
            flex: 1,
            flexWrap: "wrap",
          },
        ]}
        numberOfLines={1}
      >
        {issuer}
      </Text>
    </View>
  );
}

function CredentialName({
  name,
  styles,
}: {
  name?: string;
  styles?: Record<string, CSSProperties>;
}) {
  return (
    <View>
      <Text
        style={[
          styles?.normal,
          styles?.textContainer,
          {
            fontWeight: "bold",
            lineHeight: 24,
            flex: 1,
            flexWrap: "wrap",
          },
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
}

function Attribute({
  attribute,
  styles,
}: {
  attribute: DisplayAttribute;
  styles?: Record<string, CSSProperties>;
}) {
  return (
    <View style={[styles?.textContainer, styles?.attributeContainer]}>
      <AttributeLabel
        attribute={attribute}
        styles={[
          styles?.labelSubtitle ?? {},
          styles?.textContainer ?? {},
          {
            lineHeight: 19,
            opacity: 0.8,
          },
        ]}
      ></AttributeLabel>
      {attribute.characterEncoding === "base64" &&
      attribute.format?.includes("image") ? (
        <Image
          source={{
            uri: attribute.value,
            height: logoHeight,
            width: logoHeight,
          }}
          style={{
            marginTop: 4,
          }}
        />
      ) : (
        <AttributeValue
          attribute={attribute}
          styles={[
            styles?.normal ?? {},
            styles?.textContainer ?? {},
            { lineHeight: 24 } as CSSProperties,
          ]}
        />
      )}
    </View>
  );
}

function CardSecondaryBody({
  styles,
}: {
  overlay?: OverlayBundle;
  styles?: Record<string, CSSProperties>;
}) {
  const branding = useBranding();

  return (
    <View style={[styles?.secondaryBodyContainer]}>
      {branding?.backgroundImageSlice ? (
        <ImageBackground
          source={branding?.backgroundImageSlice}
          style={{ flexGrow: 1 }}
          imageStyle={{
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
          }}
        />
      ) : null}
    </View>
  );
}

function CardLogo({
  credential,
  styles,
}: {
  credential?: LocalizedCredential;
  styles?: Record<string, CSSProperties>;
}) {
  const branding = useBranding();

  return (
    <View style={[styles?.logoContainer]}>
      {branding?.logo ? (
        <Image
          source={branding?.logo}
          style={{
            resizeMode: "cover",
            width: logoHeight,
            height: logoHeight,
            borderRadius: 8,
          }}
        />
      ) : (
        <Text
          style={[
            styles?.normal,
            {
              fontSize: 0.5 * logoHeight,
              fontWeight: "bold",
              alignSelf: "center",
            },
          ]}
        >
          {(credential?.issuer ?? credential?.name ?? "C")
            ?.charAt(0)
            .toUpperCase()}
        </Text>
      )}
    </View>
  );
}

function CardPrimaryBody({
  credential,
  primaryAttribute,
  secondaryAttribute,
  styles,
}: {
  credential?: LocalizedCredential;
  primaryAttribute?: DisplayAttribute;
  secondaryAttribute?: DisplayAttribute;
  styles?: Record<string, CSSProperties>;
}) {
  const displayAttributes = [];
  if (primaryAttribute) {
    displayAttributes.push(primaryAttribute);
  }
  if (secondaryAttribute) {
    displayAttributes.push(secondaryAttribute);
  }

  return (
    <View style={styles?.primaryBodyContainer}>
      <IssuerName issuer={credential?.issuer} styles={styles} />
      <CredentialName name={credential?.name} styles={styles} />
      {displayAttributes.map((attribute, index) => (
        <Attribute
          key={`${attribute.name}_${index}}`}
          attribute={attribute}
          styles={styles}
        />
      ))}
    </View>
  );
}

function CardStatus({ styles }: { styles?: Record<string, CSSProperties> }) {
  return <View style={[styles?.statusContainer]} />;
}

function Card({
  overlay,
  credential,
  language,
  styles,
}: {
  overlay?: OverlayBundle;
  credential?: LocalizedCredential;
  language?: string;
  styles?: Record<string, CSSProperties>;
}) {
  const branding = useBranding();

  let primaryAttribute;
  let secondaryAttribute;
  if (branding?.primaryAttribute) {
    primaryAttribute = getOverlayAttribute(
      branding.primaryAttribute,
      overlay,
      credential,
      language
    );
  }
  if (branding?.secondaryAttribute) {
    secondaryAttribute = getOverlayAttribute(
      branding.secondaryAttribute,
      overlay,
      credential,
      language
    );
  }

  return (
    <View style={styles?.cardContainer}>
      <CardSecondaryBody styles={styles} />
      <CardLogo credential={credential} styles={styles} />
      <CardPrimaryBody
        credential={credential}
        primaryAttribute={primaryAttribute}
        secondaryAttribute={secondaryAttribute}
        styles={styles}
      />
      <CardStatus styles={styles} />
    </View>
  );
}

function CredentialCard10({
  overlay,
  record,
  language,
}: {
  overlay?: OverlayBundle;
  record?: CredentialExchangeRecord;
  language?: string;
}) {
  const styles = computedStyles();

  const [formatter, setFormatter] = useState<CredentialFormatter | undefined>();

  useMemo(() => {
    if (!(overlay && record)) {
      return;
    }
    setFormatter(new CredentialFormatter(overlay, record));
  }, [overlay, record]);

  const localizedCredential = formatter?.localizedCredential(language ?? "en");

  return (
    <View style={[styles.container, { width }]}>
      <Card
        overlay={overlay}
        credential={localizedCredential}
        language={language}
        styles={styles}
      />
    </View>
  );
}

function getOverlayAttribute(
  name: string,
  overlay: OverlayBundle | undefined,
  credential: LocalizedCredential | undefined,
  language: string | undefined
): DisplayAttribute | undefined {
  const attribute = credential?.getAttribute(name);
  const overlayOptions = overlay?.getAttribute(name);

  if (overlayOptions) {
    const name = attribute?.name ?? "";
    const mimeType = attribute?.mimeType ?? "";
    const value = attribute?.value ?? "";
    return new DisplayAttribute(
      { name, mimeType, value },
      overlayOptions,
      language ?? "en"
    );
  }

  return;
}

export default CredentialCard10;
