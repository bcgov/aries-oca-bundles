import { View, Image, ImageBackground, Text, FlatList } from "react-native";
import { useBranding } from "../contexts/Branding";
import { textColorForBackground } from "@aries-bifold/oca/build/utils/color";
import { OverlayBundle } from "@aries-bifold/oca/build/types";
import startCase from "lodash.startcase";
import { CredentialExchangeRecord } from "@aries-framework/core";
import { useMemo, useState } from "react";
import {
  CredentialFormatter,
  DisplayAttribute,
  LocalizedCredential,
} from "@aries-bifold/oca/build/formatters/Credential";

const width = 360;
const paddingHorizontal = 24;
const paddingVertical = 16;
const logoHeight = 80;

function computedStyles() {
  const branding = useBranding();

  return {
    container: {
      backgroundColor: branding?.primaryBackgroundColor,
      display: "flex",
    },
    primaryBodyContainer: {
      paddingHorizontal,
      paddingVertical,
    },
    secondaryBodyContainer: {
      height: 1.5 * logoHeight,
      backgroundColor:
        (branding?.backgroundImage
          ? "rgba(0, 0, 0, 0)"
          : branding?.secondaryBackgroundColor) || "rgba(0, 0, 0, 0.24)",
    },
    logoContainer: {
      top: -0.5 * logoHeight,
      left: paddingHorizontal,
      marginBottom: -1 * logoHeight,
      width: logoHeight,
      height: logoHeight,
      backgroundColor: "#ffffff",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    textContainer: {
      color: textColorForBackground(
        branding?.primaryBackgroundColor || "#313132"
      ),
      flexShrink: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
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
    listText: {
      color: "#313132",
    },
    listBorder: {
      borderColor: "#F2F2F2",
      borderBottomWidth: 2,
      paddingTop: 12,
    },
  };
}

function DetailLogo({
  credential,
  styles,
}: {
  credential?: LocalizedCredential;
  styles?: any;
}) {
  const branding = useBranding();

  return (
    <View style={styles.logoContainer}>
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
        <Text style={[styles.title, { fontSize: 0.5 * logoHeight }]}>
          {(credential?.issuer ?? credential?.name ?? "C")
            ?.charAt(0)
            .toUpperCase()}
        </Text>
      )}
    </View>
  );
}

function DetailSecondaryBody({
  styles,
}: {
  overlay?: OverlayBundle | undefined;
  styles?: any;
}) {
  const branding = useBranding();

  return (
    <View>
      {branding?.backgroundImage ? (
        <ImageBackground
          source={branding?.backgroundImage}
          imageStyle={{
            resizeMode: "cover",
          }}
        >
          <View style={styles.secondaryBodyContainer} />
        </ImageBackground>
      ) : (
        <View style={styles.secondaryBodyContainer} />
      )}
    </View>
  );
}

function DetailPrimaryBody({
  credential,
  styles,
}: {
  credential?: LocalizedCredential;
  styles?: any;
}) {
  return (
    <View style={styles.primaryBodyContainer}>
      <View>
        <Text
          style={[
            styles.label,
            styles.textContainer,
            {
              paddingLeft: logoHeight + paddingVertical,
              paddingBottom: paddingVertical,
              lineHeight: 19,
              opacity: 0.8,
            },
          ]}
          numberOfLines={1}
        >
          {credential?.issuer}
        </Text>
        <Text
          style={[
            styles.normal,
            styles.textContainer,
            {
              lineHeight: 24,
            },
          ]}
        >
          {credential?.name}
        </Text>
      </View>
    </View>
  );
}

function Detail({
  credential,
  styles,
}: {
  credential?: LocalizedCredential;
  styles?: any;
}) {
  return (
    <View>
      <View style={styles.container}>
        <DetailSecondaryBody styles={styles} />
        <DetailLogo credential={credential} styles={styles} />
        <DetailPrimaryBody credential={credential} styles={styles} />
      </View>
      <View>
        <DetailList credential={credential} styles={styles} />
      </View>
    </View>
  );
}

function DetailList({
  credential,
  styles,
}: {
  credential?: LocalizedCredential;
  styles?: any;
}) {
  return (
    <FlatList
      data={credential?.attributes ?? []}
      renderItem={({ item: attribute }: { item: DisplayAttribute }) => {
        const label = attribute.label ?? startCase(attribute.name);
        return (
          <View
            style={{
              paddingHorizontal,
              paddingTop: paddingVertical,
            }}
          >
            <Text
              style={[styles.normal, styles.listText, { fontWeight: "bold" }]}
            >
              {label}
            </Text>
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
              <Text
                style={[styles.normal, styles.listText, { paddingVertical: 4 }]}
              >
                {attribute.value || "•".repeat(10)}
              </Text>
            )}
            <View style={styles.listBorder} />
          </View>
        );
      }}
    />
  );
}

function CredentialDetail10({
  overlay,
  record,
  language,
}: {
  overlay?: OverlayBundle;
  record?: CredentialExchangeRecord;
  language: string;
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
    <View style={{ width }}>
      <Detail credential={localizedCredential} styles={styles} />
    </View>
  );
}

export default CredentialDetail10;
