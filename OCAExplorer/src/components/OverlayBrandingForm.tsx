import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useEffect } from "react";
import {
  ActionType,
  useBranding,
  useBrandingDispatch,
} from "../contexts/Branding";
import OverlayBundle from "../types/overlay/OverlayBundle";

function OverlayBrandingForm({
  overlay,
}: {
  overlay?: OverlayBundle;
  language?: string;
}) {
  const branding = useBranding();
  const dispatch = useBrandingDispatch();

  useEffect(() => {
    dispatch &&
      dispatch({
        type: ActionType.SET_BRANDING,
        payload: {
          logo: overlay?.branding?.logo ?? "",
          backgroundImage: overlay?.branding?.backgroundImage ?? "",
          backgroundImageSlice: overlay?.branding?.backgroundImageSlice ?? "",
          primaryBackgroundColor:
            overlay?.branding?.primaryBackgroundColor ?? "",
          secondaryBackgroundColor:
            overlay?.branding?.secondaryBackgroundColor ?? "",
          primaryAttribute: overlay?.branding?.primaryAttribute ?? "",
          secondaryAttribute: overlay?.branding?.secondaryAttribute ?? "",
        },
      });
  }, []);

  return (
    <div>
      <TextField
        fullWidth
        id="logo"
        label="Logo"
        value={branding?.logo ?? ""}
        onChange={(e) => {
          dispatch &&
            dispatch({
              type: ActionType.LOGO,
              payload: { logo: e.target.value },
            });
        }}
        margin="dense"
        size="small"
      />
      <TextField
        fullWidth
        id="background-image"
        label="Background Image"
        value={branding?.backgroundImage ?? ""}
        onChange={(e) => {
          dispatch &&
            dispatch({
              type: ActionType.BACKGROUND_IMAGE,
              payload: { backgroundImage: e.target.value },
            });
        }}
        margin="dense"
        size="small"
      />
      <TextField
        fullWidth
        id="background-image-slice"
        label="Background Image Slice"
        value={branding?.backgroundImageSlice ?? ""}
        onChange={(e) => {
          dispatch &&
            dispatch({
              type: ActionType.BACKGROUND_IMAGE_SLICE,
              payload: { backgroundImageSlice: e.target.value },
            });
        }}
        margin="dense"
        size="small"
      />
      <MuiColorInput
        fullWidth
        id="primary-background-color"
        label="Primary Background Color"
        value={branding?.primaryBackgroundColor ?? ""}
        onChange={(value) => {
          dispatch &&
            dispatch({
              type: ActionType.PRIMARY_BACKGROUND_COLOR,
              payload: { primaryBackgroundColor: value },
            });
        }}
        margin="dense"
        size="small"
      />
      <MuiColorInput
        fullWidth
        id="secondary-background-color"
        label="Secondary Background Color"
        value={branding?.secondaryBackgroundColor ?? ""}
        onChange={(value) => {
          dispatch &&
            dispatch({
              type: ActionType.SECONDARY_BACKGROUND_COLOR,
              payload: { secondaryBackgroundColor: value },
            });
        }}
        margin="dense"
        size="small"
      />
      <FormControl fullWidth margin="dense" size="small">
        <InputLabel id="primary-attribute">Primary Attribute</InputLabel>
        <Select
          labelId="primary-attribute"
          label="Primary Attribute"
          value={branding?.primaryAttribute ?? ""}
          onChange={(e) => {
            dispatch &&
              dispatch({
                type: ActionType.PRIMARY_ATTRIBUTE,
                payload: { primaryAttribute: e.target.value },
              });
          }}
        >
          {Object.entries(overlay?.captureBase?.attributes || {}).map(
            ([key]) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="dense" size="small">
        <InputLabel id="secondary-attribute">Secondary Attribute</InputLabel>
        <Select
          labelId="secondary-attribute"
          label="Secondary Attribute"
          value={branding?.secondaryAttribute ?? ""}
          onChange={(e) => {
            dispatch &&
              dispatch({
                type: ActionType.SECONDARY_ATTRIBUTE,
                payload: { secondaryAttribute: e.target.value },
              });
          }}
        >
          {Object.entries(overlay?.captureBase?.attributes || {}).map(
            ([key]) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
    </div>
  );
}

export default OverlayBrandingForm;
