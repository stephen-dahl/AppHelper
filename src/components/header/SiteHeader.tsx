import React from "react";
import { AppBar, Link, styled, Toolbar } from "@mui/material";
import { UserHelper } from "../../helpers/UserHelper"
import { UserMenu } from "../wrapper/UserMenu";
import { PersonHelper } from "../../helpers/PersonHelper";
import { PrimaryMenu } from "./PrimaryMenu";
import { SecondaryMenu } from "./SecondaryMenu";
import { SecondaryMenuAlt } from "./SecondaryMenuAlt";
import { UserContextInterface } from "@churchapps/helpers";

type Props = {
  primaryMenuLabel: string;
  primaryMenuItems:{ url: string, icon:string, label: string }[];
  secondaryMenuLabel: string;
  secondaryMenuItems:{ url: string, label: string }[];
	context: UserContextInterface;
	appName: string;
	onNavigate: (url: string) => void;
}

export const SiteHeader = (props:Props) => {

  const CustomAppBar = styled(AppBar)(
    ({ theme }) => ({
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      "& .MuiIcon-root": { color: "#FFFFFF" }
    })
  );
  /*<Typography variant="h6" noWrap>{UserHelper.currentUserChurch?.church?.name || ""}</Typography>*/
  return (<>
    <div style={{backgroundColor:"var(--c1)", color: "#FFF"}}>
      <CustomAppBar position="absolute">
        <Toolbar sx={{ pr: "24px", backgroundColor: "var(--c1)" }}>
          <PrimaryMenu label={props.primaryMenuLabel} menuItems={props.primaryMenuItems} onNavigate={props.onNavigate} />
          <SecondaryMenu label={props.secondaryMenuLabel} menuItems={props.secondaryMenuItems} onNavigate={props.onNavigate} />
          <div style={{ flex: 1 }}>
            <SecondaryMenuAlt label={props.secondaryMenuLabel} menuItems={props.secondaryMenuItems} onNavigate={props.onNavigate} />
          </div>
          {UserHelper.user && <UserMenu profilePicture={PersonHelper.getPhotoUrl(props.context?.person)} userName={`${UserHelper.user?.firstName} ${UserHelper.user?.lastName}`} userChurches={UserHelper.userChurches} currentUserChurch={UserHelper.currentUserChurch} context={props.context} appName={props.appName} loadCounts={() => {}} notificationCounts={{notificationCount:0, pmCount:0}} onNavigate={props.onNavigate} />}
          {!UserHelper.user && <Link href="/login" color="inherit" style={{ textDecoration: "none" }}>Login</Link>}
        </Toolbar>
      </CustomAppBar>

    </div>
  </>
  );
}
