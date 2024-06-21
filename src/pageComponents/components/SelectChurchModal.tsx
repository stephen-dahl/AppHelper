import React from "react";
import { ChurchInterface, LoginUserChurchInterface } from "@churchapps/helpers";
import { SelectChurchSearch } from "./SelectChurchSearch";
import { SelectableChurch } from "./SelectableChurch";
import { ErrorMessages } from "../../components"
import { Dialog, DialogContent, DialogTitle, Icon, IconButton, Tooltip } from "@mui/material";
import { Locale } from "../../helpers";

interface Props {
  appName: string,
  show: boolean,
  userChurches?: LoginUserChurchInterface[],
  selectChurch: (churchId: string) => void,
  registeredChurchCallback?: (church: ChurchInterface) => void,
  errors?: string[]
}

export const SelectChurchModal: React.FC<Props> = (props) => {
  const [showSearch, setShowSearch] = React.useState(false);

  const handleClose = () => {
    window.location.reload();
  }

  const getContents = () => {
    if (showSearch || props.userChurches?.length === 0) return <SelectChurchSearch selectChurch={props.selectChurch} registeredChurchCallback={props.registeredChurchCallback} appName={props.appName} />
    else return (<>
      {props.userChurches?.map(uc => (<SelectableChurch church={uc.church} selectChurch={props.selectChurch} key={uc.church.id} />))}
      <a href="about:blank" style={{ display: "block", textAlign: "center" }} onClick={(e) => { e.preventDefault(); setShowSearch(true); }}>{Locale.label("selectChurch.another")}</a>
    </>);
  }

  return (
    <Dialog open={props.show} onClose={handleClose}>
      <DialogTitle>{Locale.label("selectChurch.selectChurch")}
      </DialogTitle>
      <Tooltip title="Logout" arrow>
        <IconButton sx={{ position: "absolute", right: 8, top: 8 }} color="error" onClick={() => { window.location.href = "/logout" }}>
          <Icon>logout</Icon>
        </IconButton>
      </Tooltip>
      <DialogContent sx={{ width: 500, maxWidth: "100%" }}>
        <ErrorMessages errors={props.errors} />
        {getContents()}
      </DialogContent>
    </Dialog>
  );
};
