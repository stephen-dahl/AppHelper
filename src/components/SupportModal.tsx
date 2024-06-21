import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Stack } from "@mui/material";
import React from "react";
import { Locale } from "../helpers";

interface Props {
  appName?: string
  onClose: () => void
}

export const SupportModal: React.FC<Props> = ({ appName = "", onClose }) => {
  const subject = appName ? `?subject=${appName} Support` : ""

  return (<>
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Get Support</DialogTitle>
      <DialogContent>
        <Stack direction="row" alignItems="center" sx={{flexWrap: "wrap"}} mb={2}><b><Stack direction="row" alignItems="center" mr="5px"><Icon sx={{marginRight: "5px"}}>mail</Icon> {Locale.label("support.email")}:</Stack></b> <a href={"mailto:support@livecs.org" + subject}>support@churchapps.org</a></Stack>
        <Stack direction="row" alignItems="center" sx={{flexWrap: "wrap"}} mb={2}><b><Stack direction="row" alignItems="center" mr="5px"><Icon sx={{marginRight: "5px"}}>phone_iphone</Icon> {Locale.label("support.phone")}:</Stack></b> <a href="tel:+19189942638">+1 (918) 994-2638</a></Stack>
        <Stack direction="row" alignItems="center" sx={{flexWrap: "wrap"}} mb={2}><b><Stack direction="row" alignItems="center" mr="5px"><Icon sx={{marginRight: "5px"}}>forum</Icon> {Locale.label("support.messenger")}:</Stack></b> <a href="https://m.me/livecsolutions" target="_new">https://m.me/livecsolutions</a></Stack>
        <Stack direction="row" alignItems="center" sx={{flexWrap: "wrap"}}><b><Stack direction="row" alignItems="center" mr="5px"><Icon sx={{marginRight: "5px"}}>info</Icon> {Locale.label("support.knowledgeBase")}:</Stack></b> <a href="https://support.churchapps.org" target="_new">https://support.churchapps.org</a></Stack>
      </DialogContent>
      <DialogActions sx={{ paddingX: "16px", paddingBottom: "12px" }}>
        <Button variant="outlined" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  </>);
};
