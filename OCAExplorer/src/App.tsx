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

const setNewUserCookie = () => {
    document.cookie = 'OCAExplorerSeenDemo=true; path=/;';
}
const seenDemo: string | undefined = document.cookie.split('; ').find((c) => c.split("=")[0] == 'OCAExplorerSeenDemo');

function App() {
  const [overlayData, setOverlayData] = useState<{
    overlay: OverlayBundle | undefined;
    record: CredentialExchangeRecord | undefined;
  }>({ overlay: undefined, record: undefined });

  const cookieValue = seenDemo
  console.log(cookieValue);
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
    if ( !seenDemo ){
      setRunDemo("RunningBranding");
      setNewUserCookie()
    }
    } ,
      []
  );

      const [runDemo, setRunDemo] = seenDemo ? useState<DemoState>("NotRunning") : useState<DemoState>("RunningIntro")

  return (
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <ThemeProvider theme={theme}>
        {/* If the overlay is displayed play through all steps if not only play the intro steps */}
        <Header callback={ () => (overlayData?.overlay ? setRunDemo("RunningAll") : setRunDemo("RunningIntro"))}/>
          <div className="App">
            <Demo runDemo={runDemo} theme={theme} resetFunc={ () => setRunDemo("NotRunning") }/>
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
