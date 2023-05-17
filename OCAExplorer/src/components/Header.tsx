import { AppBar, Toolbar, Icon } from "@mui/material";

export default function Header() {
  const displayDesktop = () => {

    return (
      <Toolbar>
        <img src="assets/images/BCID_H_rgb_rev.svg" alt="Go to the Government of British Columbia website" style={{
          width: '100%',
          height: '100%',
          maxHeight: "48px",
          flex: 1
        }}
        />
      </Toolbar>
    )
  };

    return (
      <header>
        <AppBar position="static" sx={{ alignItems: 'flex-start', height: "64px", flex:1 , justifyContent: 'left' }}>{displayDesktop()}</AppBar>
      </header>
    );
}
