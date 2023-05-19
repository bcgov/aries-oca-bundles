import { Container } from "@mui/material";
import { useCallback, useState } from "react";
import Form from "./components/Form";
import OverlayForm from "./components/OverlayForm";
import Header from "./components/Header";
import theme from "./theme";
import { OverlayBundle } from "@aries-bifold/oca/build/types";
import {
  CredentialExchangeRecord,
  CredentialPreviewAttribute,
  CredentialState,
} from "@aries-framework/core";
import { CssBaseline } from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";

function App() {
  const [overlayData, setOverlayData] = useState<{
    overlay: OverlayBundle | undefined;
    record: CredentialExchangeRecord | undefined;
  }>({ overlay: undefined, record: undefined });

  const handleOverlayData = useCallback(
    (overlayData: {
      overlay: OverlayBundle | undefined;
      data: Record<string, string>;
    }) => {
      const record = new CredentialExchangeRecord({
        threadId: "123",
        protocolVersion: "1.0",
        state: CredentialState.OfferReceived,
        credentialAttributes: Object.entries(overlayData.data).map(
          ([name, value]) => new CredentialPreviewAttribute({ name, value })
        ),
      });

      // TODO: Should validate the overlay here before setting it.
      setOverlayData({ ...overlayData, record });
    },
    []
  );

  return (
    <div>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <Header />
          <div className="App">
            <Container>
              <Form onOverlayData={handleOverlayData} />
              {overlayData?.overlay && (
                <OverlayForm
                  overlay={overlayData.overlay}
                  record={overlayData.record}
                />
              )}
            </Container>
          </div>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}

export default App;
