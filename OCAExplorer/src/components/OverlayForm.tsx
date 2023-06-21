import React from "react";
import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useCallback, useEffect, useState } from "react";
import { BrandingProvider } from "../contexts/Branding";
import CredentialCard from "./CredentialCard";
import CredentialDetail from "./CredentialDetail";
import OverlayBrandingForm from "./OverlayBrandingForm";
import { OverlayBundle } from "@hyperledger/aries-oca/build/types";

import { Info } from "@mui/icons-material";
import { CredentialExchangeRecord } from "@aries-framework/core";

function OverlayForm({
  overlay,
  record,
}: {
  overlay: OverlayBundle;
  record?: CredentialExchangeRecord;
}) {
  const [language, setLanguage] = useState<string>("");

  useEffect(() => {
    setLanguage(overlay.languages[0]);
  }, [overlay?.languages]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLanguage((event.target as HTMLInputElement).value);
    },
    []
  );

  return (
    <BrandingProvider>
      <Grid>
        {overlay.languages.length > 1 && (
          <Grid id="overlay-bundle-language-select">
            <FormControl fullWidth margin="dense">
              <FormLabel>Language</FormLabel>
              <RadioGroup
                aria-labelledby="overlay-bundle-language-label"
                name="language"
                onChange={handleChange}
                value={language}
                row
              >
                {overlay.languages.map((language) => (
                  <FormControlLabel
                    key={language}
                    value={language}
                    control={<Radio />}
                    label={language}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
        <Grid>
          <Card>
            <CardContent>
              <Typography variant="overline">
                {overlay.metadata.name[language]}&nbsp;
                {overlay.metadata?.credentialHelpText && (
                  <Tooltip
                    title={
                      overlay.metadata?.credentialHelpText?.[language] ?? ""
                    }
                  >
                    <Info fontSize="small" style={{ marginBottom: 2 }} />
                  </Tooltip>
                )}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {overlay.metadata.description[language]}
              </Typography>
              {overlay.metadata?.issuer && (
                <Typography variant="body2" color="text.secondary">
                  {overlay.metadata?.issuer?.[language]}&nbsp;
                  {overlay.metadata?.issuerDescription && (
                    <Tooltip
                      title={
                        overlay.metadata?.issuerDescription?.[language] ?? ""
                      }
                    >
                      <Info fontSize="inherit" style={{ marginBottom: 2 }} />
                    </Tooltip>
                  )}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid
          container
          gap={4}
          paddingTop="1em"
          display="flex"
          justifyContent="center"
        >
          <Grid
            md
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
          >
            <div id="overlay-bundle-credential-card">
              <CredentialCard
                overlay={overlay}
                record={record}
                language={language}
              />
            </div>
          </Grid>
          <Grid
            md
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
          >
            <div id="overlay-bundle-credential-details">
              <CredentialDetail
                overlay={overlay}
                record={record}
                language={language}
              />
            </div>
          </Grid>
        </Grid>
        <Grid>
          <OverlayBrandingForm overlay={overlay} language={language} />
        </Grid>
      </Grid>
    </BrandingProvider>
  );
}

export default OverlayForm;
