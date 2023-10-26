import React from "react";
import { Menu, Icon, Button, Box, Tabs, Tab } from "@mui/material";
import { UserContextInterface } from "../../interfaces";
import { PrivateMessages } from "./PrivateMessages";
import { TabPanel } from "../TabPanel";
import { Notifications } from "./Notifications";
import { Badge } from "@mui/base";

interface Props {
  counts: { notificationCount: number, pmCount: number };
  context: UserContextInterface;
  router?: any;
  onUpdate: () => void;
}

export const NotificationMenu: React.FC<Props> = (props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    props.onUpdate();
    setAnchorEl(null);
  };


  const paperProps = {
    elevation: 0,
    sx: {
      overflow: "visible",
      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
      mt: 1.5,
      "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
      minWidth: 450
    }
  };

  const handleItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e);
  }

  const [tabIndex, setTabIndex] = React.useState(0);

  function handleChange(el: any, newValue: any) {
    setTabIndex(newValue);
  }

  const getTabs = () => (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs variant="fullWidth" value={tabIndex} onChange={handleChange}>
        <Tab label="Messages" icon={(props.counts.pmCount>0) ? <Icon style={{color:"#FF0000"}}>notifications</Icon> : <></>} iconPosition="end" />
        <Tab label="Notifications" icon={(props.counts.notificationCount>0) ? <Icon style={{color:"#FF0000"}}>notifications</Icon> : <></>} iconPosition="end"  />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <PrivateMessages context={props.context} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Notifications context={props.context} />
      </TabPanel>
    </Box>
  );

  const totalCount = props.counts.notificationCount + props.counts.pmCount;
  console.log("totalCount", totalCount, props.counts);

  //const buttonStyle = (totalCount > 0) ? { color: "#FF3333" } : {  };
  let icon = <Icon>notifications</Icon>;
  if (totalCount>0) icon = <Badge style={{backgroundColor:"#FF0000", padding:"0px 5px 0px 5px", borderRadius:5}} badgeContent={totalCount} color="error">{icon}</Badge>


  return (
    <>
      <Button onClick={handleClick} color="inherit" aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} style={{ textTransform: "none" }}>
        {icon}
      </Button>
      <Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleClose} onClick={(e) => { handleItemClick(e) }} PaperProps={paperProps} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} sx={{ "& .MuiBox-root": { borderBottom: 0 } }}>
        {getTabs()}
      </Menu>
    </>
  );
};
