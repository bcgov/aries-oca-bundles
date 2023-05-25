import { Container, Typography } from "@mui/material";
import { useCallback, useState, useEffect} from "react";
import Form from "./components/Form";
import OverlayForm from "./components/OverlayForm";
import Header from "./components/Header";
import { Demo, DemoState } from "./components/Demo";
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

  // Track if we should skip the rest of the demo.
  const [demoState, setDemoState] = useState<DemoState>(
    localStorage.getItem('OCAExplorerSeenDemo') != null
    ? DemoState.SeenDemo : DemoState.RunningIntro
  )

  useEffect( () => {
    // update localStorage to reflect the skipDemo state
    if (demoState == DemoState.SeenDemo) {
      localStorage.setItem('OCAExplorerSeenDemo', 'true');
    }
  }, [ demoState ]);

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
      setOverlayData({ ...overlayData, record });
      if (demoState != DemoState.SeenDemo) {
        setDemoState(DemoState.RunningBranding);
      }
    } ,
      [ demoState ]
  );

  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        {/* If the overlay is displayed play through all steps if not only play the intro steps */}
        <Header callback={ () => setDemoState(
          overlayData?.overlay
          ? DemoState.RunningAll
          : DemoState.RunningIntro
        )}/>
        <div className="App">
          <Demo runDemo={demoState}
                theme={theme}
                resetFunc={ () => setDemoState(
                  overlayData?.overlay
                  ? DemoState.SeenDemo
                  : DemoState.NotRunning
                )
                }
                skipFunc={ () => setDemoState(DemoState.SeenDemo) }/>
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
  );
}

export default App;
