import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import { Info } from "@mui/icons-material";
import imgUrl from "../assets/images/BCID_H_rgb_rev.svg";

export default function Header({ callback }: { callback: () => any }) {
  const displayDesktop = (callback: () => any) => {
    return (
      <Toolbar>
        <img
          src={imgUrl}
          alt="Go to the Government of British Columbia website"
          style={{
            width: "100%",
            height: "100%",
            maxHeight: "48px",
            flex: 1,
          }}
        />
        <button onClick={callback}>
          <Info />
        </button>
      </Toolbar>
    );
  };

  return (
    <header style={{ paddingBottom: "10px" }}>
      <AppBar
        position="static"
        sx={{
          alignItems: "flex-start",
          height: "64px",
          flex: 1,
          justifyContent: "left",
        }}
      >
        {displayDesktop(callback)}
      </AppBar>
    </header>
  );
}
