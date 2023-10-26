import { AppBar, Drawer, styled } from "@mui/material";

export const OpenDrawer = styled(Drawer)(
  ({ theme }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      backgroundColor: theme.palette.primary.main,
      color: "#FFFFFF",
      whiteSpace: "nowrap",
      width: "100vw",
      zIndex: 9999,
      [theme.breakpoints.up("md")]: { width: 220 },
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      boxSizing: "border-box"
    },
    "& .MuiListItemButton-root, & .MuiListItemIcon-root": { color: "#FFFFFF" }
  })
);

export const ClosedDrawer = styled(OpenDrawer)(
  ({ theme }) => ({
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    zIndex: 1,
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: { width: theme.spacing(7) },
    "& .MuiListSubheader-root": {
      opacity: 0
    }
  })
);

export const ClosedDrawerAppBar = styled(AppBar)(
  ({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    "& .MuiIcon-root": { color: "#FFFFFF" }
  })
);

export const OpenDrawerAppBar = styled(ClosedDrawerAppBar)(
  ({ theme }) => ({
    marginLeft: 220,
    width: `calc(100% - ${220}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
);

