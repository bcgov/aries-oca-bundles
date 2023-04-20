import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import OverlayBundle from "../types/overlay/OverlayBundle";
import OverlayBundleFactory from "../services/OverlayBundleFactory";
import { Clear, UploadFile } from "@mui/icons-material";

const BUNDLE_LIST_URL =
  "https://raw.githubusercontent.com/bcgov/aries-oca-bundles/main";
const BUNDLE_LIST_PATH = "/ocabundleslist.json";

function Form({
  onOverlay,
}: {
  onOverlay: (bundle: OverlayBundle | undefined) => void;
}) {
  const [options, setOptions] = useState<any[] | undefined>([]);
  const [option, setOption] = useState<any | undefined>(undefined);
  const [file, setFile] = useState<File | undefined>(undefined);

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
    setFile(undefined);
    setOption(JSON.parse(event.target.value));
  }, []);

  const handleFileChange = useCallback((event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        const bundle = JSON.parse(text);
        setOption(undefined);
        setFile(file);
        const overlay = OverlayBundleFactory.createOverlayBundle(
          file.name,
          Array.isArray(bundle) ? bundle[0] : bundle
        );
        onOverlay(overlay);
      }
    };
    reader.onerror = (e) => {
      console.error(e);
    };
    reader.readAsText(file);
  }, []);

  const handleUnsetFileChange = useCallback(() => {
    setFile(undefined);
    onOverlay(undefined);
  }, []);

  return (
    <Paper style={{ padding: "1em", marginBottom: "1em" }} elevation={1}>
      <FormControl fullWidth margin="dense">
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        - OR -
      </div>
      <FormControl
        margin="dense"
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        {file ? (
          <div>
            {file.name}
            <IconButton onClick={handleUnsetFileChange}>
              <Clear />
            </IconButton>
          </div>
        ) : (
          <Button
            variant="contained"
            component="label"
            size="large"
            startIcon={<UploadFile />}
          >
            Upload OCA Bundle
            <input
              hidden
              accept="application/json"
              type="file"
              onChange={handleFileChange}
            />
          </Button>
        )}
      </FormControl>
    </Paper>
  );
}

export default Form;
