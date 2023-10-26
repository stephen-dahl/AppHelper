import React from "react";
import { IconButton, Toolbar, Icon, Typography, Box, Container, Link } from "@mui/material";
import { UserHelper, AppearanceHelper, PersonHelper, AppearanceInterface, ApiHelper } from "../../helpers";
import { UserMenu } from "./UserMenu";
import { UserContextInterface } from "../../interfaces";
import { useMountedState } from "../../hooks/useMountedState";
import { SocketHelper } from "../../helpers/SocketHelper";
import { NotificationMenu } from "./NotificationMenu";
import { ClosedDrawer, ClosedDrawerAppBar, OpenDrawer, OpenDrawerAppBar } from "./Drawers";

interface Props {
  navContent: JSX.Element,
  context: UserContextInterface,
  children: React.ReactNode,
  appName: string,
  router?: any,
  appearance?: AppearanceInterface
}

export const SiteWrapper: React.FC<Props> = props => {
  const [churchLogo, setChurchLogo] = React.useState<string>();
  const [open, setOpen] = React.useState(false);
  const [notificationCounts, setNotificationCounts] = React.useState({notificationCount:0, pmCount:0});
  const toggleDrawer = () => { setOpen(!open); };
  const isMounted = useMountedState();

  const CustomDrawer = (open) ? OpenDrawer : ClosedDrawer;
  const CustomAppBar = (open) ? OpenDrawerAppBar : ClosedDrawerAppBar;

  const loadCounts = () => {
    ApiHelper.get("/notifications/unreadCount", "MessagingApi").then(data => { setNotificationCounts(data); });
  }
  const handleNotification = () => {
    //alert("Notification received.  Make GET to fetch bell count and toast message.")
    console.log("Notification received.  Make GET to fetch bell count and toast message.");
    loadCounts();
  }



  React.useEffect(() => {
    const getChurchLogo = async () => {
      if (UserHelper.currentUserChurch) {
        setChurchLogo(AppearanceHelper.getLogoDark(props.appearance, "/images/logo-wrapper.png"));
      }
    }

    if (!isMounted()) {
      getChurchLogo();
    }
  }, [isMounted, props.appearance]);


  React.useEffect(() => {
    if (!props.context.userChurch) SocketHelper.setPersonChurch({personId:null, churchId:null});
    else SocketHelper.setPersonChurch({personId:props.context.userChurch?.person?.id, churchId:props.context.userChurch?.church?.id});
  }, [props.context.userChurch]);

  React.useEffect(() => {
    SocketHelper.addHandler("notification", "notificationBell", handleNotification);
    SocketHelper.init();
    loadCounts();
  }, []);



  return <>
    <CustomAppBar position="absolute">
      <Toolbar sx={{ pr: "24px" }}>
        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{ marginRight: "36px", ...(open && { display: "none" }) }}>
          <Icon>menu</Icon>
        </IconButton>
        <Typography variant="h6" noWrap>{UserHelper.currentUserChurch?.church?.name || ""}</Typography>
        <div style={{ flex: 1 }}></div>
        {UserHelper.user && <NotificationMenu onUpdate={loadCounts} counts={notificationCounts} context={props.context} router={props.router} />}
        {UserHelper.user && <UserMenu profilePicture={PersonHelper.getPhotoUrl(props.context?.person)} userName={`${UserHelper.user?.firstName} ${UserHelper.user?.lastName}`} userChurches={UserHelper.userChurches} currentUserChurch={UserHelper.currentUserChurch} context={props.context} appName={props.appName} router={props.router} />}
        {!UserHelper.user && <Link href="/login" color="inherit" style={{ textDecoration: "none" }}>Login</Link>}
      </Toolbar>
    </CustomAppBar>

    <CustomDrawer variant="permanent" open={open}>
      <Toolbar sx={{ display: "flex", alignItems: "center", width: "100%", px: [1] }}>
        <img src={churchLogo || "/images/logo-wrapper.png"} alt="logo" style={{ maxWidth: 170 }} />
        <div style={{ justifyContent: "flex-end", flex: 1, display: "flex" }}>
          <IconButton onClick={toggleDrawer}><Icon style={{ color: "#FFFFFF" }}>chevron_left</Icon></IconButton>
        </div>
      </Toolbar>
      {props.navContent}
    </CustomDrawer>
    <Box component="main" sx={{ flexGrow: 1, overflow: "auto", marginTop: 8, minHeight: "90vh" }}>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        {props.children}
      </Container>
    </Box>
  </>
};
