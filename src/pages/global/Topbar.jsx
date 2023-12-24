import React from "react";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Box,
  IconButton,
  useTheme,
  Typography,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import { useContext } from "react";
import lightLogo from "../../assets/logo-darktheme.png";
import darkLogo from "../../assets/logo-lighttheme.png";
import { useDispatch } from 'react-redux';

const Topbar = () => {
  //Theming
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  
  
  //Function to handle the logout - dispatches the logout action
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <nav>
      <Box
        display="flex"
        justifyContent="space-between"
        p={1}
        backgroundColor={colors.primary[400]}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
          <Box component="img" sx={{ height: 54 }} alt="Logo" src={theme.palette.mode == "dark" ? lightLogo: darkLogo} />
        </Typography>
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode == "dark" ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </nav>
  );
};

export default Topbar;
