import { Container, Typography } from "@mui/material";
import { useCallback, useState } from "react";
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
  // Default value should be set based on the stored token in local storage
  const [skipDemo, setSkipDemo] = useState<boolean>(localStorage.getItem('OCAExplorerSeenDemo') != null);

  const forceSkipDemo = () => {
    if (skipDemo == false) {
        localStorage.setItem('OCAExplorerSeenDemo', 'true');
    }
    setSkipDemo(true)
  }

  const [runDemo, setRunDemo] = skipDemo ? useState<DemoState>("NotRunning") : useState<DemoState>("RunningIntro")

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
      if (!skipDemo) {
        setRunDemo("RunningBranding");
        forceSkipDemo()
      }
    } ,
      [skipDemo]
  );

  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        {/* If the overlay is displayed play through all steps if not only play the intro steps */}
        <Header callback={ () => (overlayData?.overlay ? setRunDemo("RunningAll") : setRunDemo("RunningIntro"))}/>
        <div className="App">
          <Demo runDemo={runDemo}
                theme={theme}
                resetFunc={ () => setRunDemo("NotRunning") }
                skipFunc={ () => {
                  setRunDemo("NotRunning")
                  forceSkipDemo()
                }}/>
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
