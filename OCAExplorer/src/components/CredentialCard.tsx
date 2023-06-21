import React from "react";
import { OverlayBundle } from "@hyperledger/aries-oca/build/types";
import CredentialCard10 from "./CredentialCard10";
import { CredentialExchangeRecord } from "@aries-framework/core";

function CredentialCard({
  overlay,
  record,
  language,
}: {
  overlay?: OverlayBundle;
  record?: CredentialExchangeRecord;
  language?: string;
}) {
  return (
    <CredentialCard10 overlay={overlay} record={record} language={language} />
  );
}

export default CredentialCard;
