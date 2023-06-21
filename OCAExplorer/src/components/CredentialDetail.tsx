import React from "react";
import { OverlayBundle } from "@hyperledger/aries-oca/build/types";
import CredentialDetail10 from "./CredentialDetail10";
import { CredentialExchangeRecord } from "@aries-framework/core";

function CredentialDetail({
  overlay,
  record,
  language,
}: {
  overlay?: OverlayBundle;
  record?: CredentialExchangeRecord;
  language: string;
}) {
  return (
    <CredentialDetail10 overlay={overlay} record={record} language={language} />
  );
}

export default CredentialDetail;
