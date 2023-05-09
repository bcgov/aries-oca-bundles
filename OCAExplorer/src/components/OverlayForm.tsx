import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useCallback, useEffect, useState } from "react";
import { BrandingProvider } from "../contexts/Branding";
import CredentialCard from "./CredentialCard";
import CredentialDetail from "./CredentialDetail";
import OverlayBrandingForm from "./OverlayBrandingForm";
import { OverlayBundle } from "@aries-bifold/oca/build/types";

function OverlayForm({ overlay }: { overlay: OverlayBundle }) {
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
            <CredentialCard overlay={overlay} language={language} />
          </Grid>
          <Grid
            md
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
          >
            <CredentialDetail overlay={overlay} language={language} />
          </Grid>
        </Grid>
        <Grid>
          <FormControl fullWidth margin="dense">
            <FormLabel id="overlay-bundle-language-label">Language</FormLabel>
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
        <Grid>
          <OverlayBrandingForm overlay={overlay} language={language} />
        </Grid>
      </Grid>
    </BrandingProvider>
  );
}

export default OverlayForm;
