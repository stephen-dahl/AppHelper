import React, { useState } from "react";
import { ApiHelper } from "../../helpers/ApiHelper";
import { Box, Icon, Stack } from "@mui/material";
import { NotificationInterface, UserContextInterface } from "@churchapps/helpers";
import { DateHelper } from "../../helpers";
import { Navigate } from "react-router-dom";

interface Props {
  appName: string;
  context: UserContextInterface;
  onUpdate: () => void;
}

export const Notifications: React.FC<Props> = (props) => {
  const [redirectUrl, setRedirectUrl] = React.useState("");
  const [notifications, setNotifications] = useState<NotificationInterface[]>([]);

  const loadData = async () => {
    const n: NotificationInterface[] = await ApiHelper.get("/notifications/my", "MessagingApi");
    setNotifications(n);
    props.onUpdate();
  }

  React.useEffect(() => { loadData(); }, []); //eslint-disable-line

  const getAppUrl = (appName:string) => {
    switch (appName) {
      case props.appName.toLowerCase(): return "";
      case "chums": return "https://app.chums.org";
      case "b1": return "https://" + props.context.userChurch.church.subDomain + ".b1.church";
      default: return "";
    }
  }

  const handleClick = (notification:NotificationInterface) => {
    let app = "";
    let path = "";
    switch (notification.contentType) {
      case "task": app = "chums"; path = "/tasks/" + notification.contentId; break;
      case "assignment": app = "b1"; path = "/member/plans/" + notification.contentId; break;
    }

    const appUrl = getAppUrl(app);
    if (appUrl === "") setRedirectUrl(path);
    else window.location.href = appUrl + path;
  }

  const getMainLinks = () => {
    let result: JSX.Element[] = [];
    notifications.forEach(notification => {
      let datePosted = new Date(notification.timeSent);
      const displayDuration = DateHelper.getDisplayDuration(datePosted);

      result.push(
        <div className="note" style={{ cursor: "pointer" }} onClick={(e) => { e.preventDefault(); }}>
          <Box sx={{ width: "100%" }} className="note-contents">
            <Stack direction="row" justifyContent="space-between">
              <div style={{width:"100%"}} onClick={(e) => { e.preventDefault(); handleClick(notification); }}>
                <span className="text-grey" style={{float:"right"}}>{displayDuration}</span>
                <p><Icon>notifications</Icon> {notification.message}</p>
              </div>
            </Stack>
          </Box>
        </div>
      );
    })
    return result;
  }

  React.useEffect(() => { console.log("RELOADED NOTIFICATIONS") }, []);

  if (redirectUrl) return <Navigate to={redirectUrl} />
  else return (
    <>
      {getMainLinks()}
    </>
  );
};
