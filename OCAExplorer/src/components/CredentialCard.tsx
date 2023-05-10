import { OverlayBundle } from "@aries-bifold/oca/build/types";
import CredentialCard10 from "./CredentialCard10";

function CredentialCard({
  overlay,
  language,
}: {
  overlay?: OverlayBundle;
  language?: string;
}) {
  return <CredentialCard10 overlay={overlay} language={language} />;
}

export default CredentialCard;
