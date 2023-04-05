import OverlayBundle from "../types/overlay/OverlayBundle";
import CredentialDetail10 from "./CredentialDetail10";

function CredentialDetail({
  overlay,
  language,
}: {
  overlay?: OverlayBundle;
  language: string;
}) {
  return <CredentialDetail10 overlay={overlay} language={language} />;
}

export default CredentialDetail;
