import OverlayBundle from "../types/overlay/OverlayBundle";
import { View, Image, ImageBackground, Text } from "react-native";
import { textColorForBackground } from "../utils/color";
import { useBranding } from "../contexts/Branding";

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
        branding?.primaryBackgroundColor || "#000000"
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
  };
}

function DetailLogo({
  overlay,
  language,
  styles,
}: {
  overlay?: OverlayBundle | undefined;
  language?: string;
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
          {(
            overlay?.metadata?.issuer?.[language ?? "en"] ??
            overlay?.metadata?.name?.[language || "en"] ??
            "C"
          )
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
  overlay,
  language,
  styles,
}: {
  overlay?: OverlayBundle | undefined;
  language?: string;
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
          {overlay?.metadata?.issuer?.[language ?? "en"]}
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
          {overlay?.metadata?.name[language ?? "en"]}
        </Text>
      </View>
    </View>
  );
}

function Detail({
  overlay,
  language,
  styles,
}: {
  overlay?: OverlayBundle | undefined;
  language?: string;
  styles?: any;
}) {
  return (
    <View style={styles.container}>
      <DetailSecondaryBody styles={styles} />
      <DetailLogo overlay={overlay} language={language} styles={styles} />
      <DetailPrimaryBody
        overlay={overlay}
        language={language}
        styles={styles}
      />
    </View>
  );
}

function CredentialDetail10({
  overlay,
  language,
}: {
  overlay?: OverlayBundle;
  language: string;
}) {
  const styles = computedStyles();

  return (
    <View style={[styles.container, { width }]}>
      <Detail overlay={overlay} language={language} styles={styles} />
    </View>
  );
}

export default CredentialDetail10;
