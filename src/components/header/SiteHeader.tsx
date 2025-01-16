import React from "react";
import { AppBar, Link, styled, Toolbar } from "@mui/material";
import { UserHelper } from "../../helpers/UserHelper"
import { UserMenu } from "../wrapper/UserMenu";
import { PersonHelper } from "../../helpers/PersonHelper";
import { PrimaryMenu } from "./PrimaryMenu";
import { SecondaryMenu } from "./SecondaryMenu";
import { SecondaryMenuAlt } from "./SecondaryMenuAlt";
import { SupportDrawer } from "./SupportDrawer";
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

  const getRelatedArticles = () => {
    let result: any [] = [];
    if (props.appName === "CHUMS") {
      if (props.primaryMenuLabel === "People") {
        if (props.secondaryMenuLabel === "People") result = ["chums/adding-people", "chums/advanced-search", "chums/assigning-roles"];
        else if (props.secondaryMenuLabel === "Groups") result = ["chums/group-roster", "chums/groups", "chums/group-calendar"];
        else if (props.secondaryMenuLabel === "Attendance") result = ["chums/attendance", "chums/checkin"];
      }
      else if (props.primaryMenuLabel === "Donations") {
        if (props.secondaryMenuLabel === "Summary") result = ["chums/donation-report"];
        else if (props.secondaryMenuLabel === "Batches" || props.secondaryMenuLabel === "Funds") result = ["chums/giving", "chums/manual-input"];
      }
      else if (props.primaryMenuLabel === "Serving") {
        if (props.secondaryMenuLabel === "Plans") result = ["chums/plans"];
        else if (props.secondaryMenuLabel === "Tasks") result = ["chums/tasks", "chums/automations"];
      }
      else if (props.primaryMenuLabel === "Settings") {
        if (props.secondaryMenuLabel === "Settings") result = ["chums/assigning-roles", "chums/exporting-data", "chums/import-csv", "chums/import-from-breeze"];
        else if (props.secondaryMenuLabel === "Forms") result = ["chums/forms"];
      }
    } else if (props.appName === "B1") {
      if (props.primaryMenuLabel === "Mobile App") result = ["b1/admin/portal", "b1/mobile/setup"];
      else if (props.primaryMenuLabel === "Website") result = ["b1/admin/portal", "b1/admin/website-elements", "b1/admin/website-setup"];
      else if (props.primaryMenuLabel === "Sermons") result = ["b1/admin/sermons", "b1/admin/stream-setup"];
      else if (props.primaryMenuLabel === "Calendars") result = ["b1/portal/calendars"];
    }
    return result;
  }

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
          <SupportDrawer appName={props.appName} relatedArticles={getRelatedArticles()} />
        </Toolbar>
      </CustomAppBar>

    </div>
  </>
  );
}
