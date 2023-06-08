import { FileUpload } from "@mui/icons-material";
import { Box, TextField, Button, Alert } from "@mui/material"
import { useState, useEffect } from "react";

export default function ImageField({
  id, label,  value, textSetter
}: {
  id?: any, label: string, value: string, textSetter: (e: any) => void
}) {

  /*
     Since we only want to show the number of characters if the
     content was set using a file
   */
  const [ wasFile, setWasFile ] = useState<boolean>(false)
  const [ validFile, setValidFile ] = useState<boolean>(true)

  // Ensure that when the value is changed the new image is assumed to be valid
  useEffect(() => {
    setValidFile(true)
  }, [value])

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const imageDataURL: string = e.target.result;

      // Image validation
      const image = new Image();

      // If invalid warn the user and do not update field
      image.onerror = () => setValidFile(false);

      // If valid image update text field with this data url
      image.onload = () => textSetter(imageDataURL);

      image.src = imageDataURL
    };

    reader.readAsDataURL(file);
  }

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <TextField
          fullWidth
          id={ id }
          label={ label + (
            wasFile
            ? " (" + value.length + " characters long" + ")"
            : ""
          ) }
          value={ value }
          onChange={ (event) => {
            setWasFile(false)
            textSetter(event.target.value)
          } }
          margin="dense"
          size="small"
        />
        <Button variant="text" component="label" size="small" disableElevation>
          <FileUpload/>
          <input hidden type="file" id="myfile" name="myfile" onChange={(e) => {
            setWasFile(true)
            handleImageChange(e)
          }}/>
        </Button>
      </Box>
      { !validFile && <Alert severity="error">ERROR: This file does not seem to be a valid image</Alert>}
    </div>
  );
}
