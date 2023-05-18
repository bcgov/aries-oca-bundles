import { Container, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import Form from "./components/Form";
import OverlayForm from "./components/OverlayForm";
import Header from "./components/Header";
import { Demo, DemoState } from "./components/Demo";
import theme from "./theme";
import { OverlayBundle } from "@aries-bifold/oca/build/types";
import { CssBaseline } from '@mui/material'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

function App() {
  const [overlay, setOverlay] = useState<OverlayBundle | undefined>(undefined);
  const [runDemo, setRunDemo] = useState<DemoState>("NotRunning")

  const handleOverlay = useCallback((overlay: OverlayBundle | undefined) => {
    // TODO: Should validate the overlay here before setting it.
    setOverlay(overlay);
    setRunDemo("RunningBranding");
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        {/* If the overlay is displayed play through all steps if not only play the intro steps */}
        <Header callback={ () => (overlay ? setRunDemo("RunningAll") : setRunDemo("RunningIntro"))}/>
        <div className="App">
          <Demo runDemo={runDemo} theme={theme} resetFunc={ () => setRunDemo("NotRunning") }/>
          <Container>
            <Form onOverlay={handleOverlay} />
            {overlay && <OverlayForm overlay={overlay} />}
          </Container>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>

  );
}

export default App;
