import { OverlayBundle } from "@aries-bifold/oca/build/types";
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
