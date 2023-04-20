import { Container } from "@mui/material";
import { useCallback, useState } from "react";
import Form from "./components/Form";
import OverlayForm from "./components/OverlayForm";
import OverlayBundle from "./types/overlay/OverlayBundle";

function App() {
  const [overlay, setOverlay] = useState<OverlayBundle | undefined>(undefined);

  const handleOverlay = useCallback((overlay: OverlayBundle | undefined) => {
    // TODO: Should validate the overlay here before setting it.
    setOverlay(overlay);
  }, []);

  return (
    <div className="App">
      <Container>
        <Form onOverlay={handleOverlay} />
        {overlay && <OverlayForm overlay={overlay} />}
      </Container>
    </div>
  );
}

export default App;
