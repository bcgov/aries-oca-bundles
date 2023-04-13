import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import OverlayBundle from "../types/overlay/OverlayBundle";
import OverlayBundleFactory from "../services/OverlayBundleFactory";

const urlMap = new Map(
  Object.entries({
    "XUxBrVSALWHLeycAUhrNr9:2:student_card:1.0":
      "https://raw.githubusercontent.com/bcgov/aries-oca-bundles/main/OCABundles/XUxBrVSALWHLeycAUhrNr9/XUxBrVSALWHLeycAUhrNr9%3A2%3Astudent_card%3A1.0/OCABundle.json",
    "XUxBrVSALWHLeycAUhrNr9:2:Person:1.0":
      "https://raw.githubusercontent.com/bcgov/aries-oca-bundles/main/OCABundles/XUxBrVSALWHLeycAUhrNr9/XUxBrVSALWHLeycAUhrNr9%3A2%3APerson%3A1.0/OCABundle.json",
    "XUxBrVSALWHLeycAUhrNr9:2:Member Card:1.5.1":
      "https://raw.githubusercontent.com/petridishdev/aries-oca-bundles/main/OCABundles/XUxBrVSALWHLeycAUhrNr9/XUxBrVSALWHLeycAUhrNr9%3A2%3AMember%20Card%3A1.5.1/OCABundle.json",
  })
);

function Form({ onOverlay }: { onOverlay: (bundle: OverlayBundle) => void }) {
  const [option, setOption] = useState<any | undefined>(undefined);

  useEffect(() => {
    if (!option?.url) {
      return;
    }

    OverlayBundleFactory.fetchOverlayBundle(option.id, option.url)
      .then((bundle) => {
        onOverlay(bundle);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [option?.url]);

  const handleChange = useCallback((event: SelectChangeEvent) => {
    setOption(JSON.parse(event.target.value));
  }, []);

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="overlay-bundle-id-label">Bundle ID</InputLabel>
      <Select
        labelId="overlay-bundle-id-label"
        label="Bundle"
        value={option ? JSON.stringify(option) : ""}
        onChange={handleChange}
      >
        {Array.from(urlMap.entries()).map(([key, value]) => (
          <MenuItem key={key} value={JSON.stringify({ id: key, url: value })}>
            {key}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Form;
