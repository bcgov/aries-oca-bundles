import { Container } from "@mui/material";
import { useCallback, useState } from "react";
import Form from "./components/Form";
import OverlayForm from "./components/OverlayForm";
import { OverlayBundle } from "@aries-bifold/oca/build/types";

function App() {
  const [overlay, setOverlay] = useState<{
    bundle: OverlayBundle | undefined;
    data: Record<string, string>;
  }>({ bundle: undefined, data: {} });

  const handleOverlay = useCallback(
    (overlay: {
      bundle: OverlayBundle | undefined;
      data: Record<string, string>;
    }) => {
      // TODO: Should validate the overlay here before setting it.
      setOverlay(overlay);
    },
    []
  );

  return (
    <div className="App">
      <Container>
        <Form onOverlay={handleOverlay} />
        {overlay?.bundle && <OverlayForm overlay={overlay.bundle} />}
      </Container>
    </div>
  );
}

export default App;
