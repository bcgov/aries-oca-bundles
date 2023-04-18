import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import OverlayBundle from "../types/overlay/OverlayBundle";
import OverlayBundleFactory from "../services/OverlayBundleFactory";

const BUNDLE_LIST_URL =
  "https://raw.githubusercontent.com/bcgov/aries-oca-bundles/main";
const BUNDLE_LIST_PATH = "/ocabundleslist.json";

function Form({ onOverlay }: { onOverlay: (bundle: OverlayBundle) => void }) {
  const [options, setOptions] = useState<any[] | undefined>([]);
  const [option, setOption] = useState<any | undefined>(undefined);

  useMemo(() => {
    fetch(BUNDLE_LIST_URL + BUNDLE_LIST_PATH, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
      .then((response) => response.text())
      .then((body) => body.replaceAll("\n", ""))
      .then((body) => body.replace(/,\]$/, "]"))
      .then((body) => JSON.parse(body))
      .then((options) => setOptions(options))
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
        {(options ?? []).map(({ name, ocabundle }) => (
          <MenuItem
            key={name}
            value={JSON.stringify({
              id: name,
              url: BUNDLE_LIST_URL + "/" + ocabundle,
            })}
          >
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Form;
