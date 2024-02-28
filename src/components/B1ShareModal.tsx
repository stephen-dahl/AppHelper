import { GroupInterface, ApiHelper } from "../helpers";
import { Modal, Box, FormControl, InputLabel, MenuItem, Select, TextField, SelectChangeEvent, Button, DialogActions, Alert, Snackbar } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { Loading } from "./Loading";

type Props = {
  contentDisplayName: string;
  contentType: string;
  contentId: string;
  onClose: () => void;
};

export function B1ShareModal(props: Props) {
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState<GroupInterface[]>(null);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const loadData = async () => {
    const g = await ApiHelper.get("/groups/my", "MembershipApi");
    if (g.length > 0) setGroupId(g[0].id);
    setGroups(g);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    switch (e.target.name) {
      case "group":
        setGroupId(e.target.value as string);
        break;
      case "comment":
        setComment(e.target.value as string);
        break;
    }
  }

  const handlePost = () => {
    setShowSuccess(true);
    if (groupId === "") alert("Please select a group.");
    else if (comment === "") alert("Please add a comment.");
    else {
      const payload = {
        groupId: groupId,
        contentType: props.contentType,
        contentId: props.contentId,
        comment: comment,
        title: props.contentDisplayName
      }
      ApiHelper.post("/conversations/start", payload, "MessagingApi").then(() => {
        setShowSuccess(true);
      });
    }
  }

  useEffect(() => { loadData(); }, []);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
  };

  const getModalContent = () => {
    if (!ApiHelper.isAuthenticated) return <p>Please log in first.</p>
    else if (!groups) return (<Loading />);
    else if (groups.length === 0) return (<p>You are not a currently a member of any groups on B1.</p>);
    else return (<>
      <h2>Sharing '{props.contentDisplayName}' to B1 Group</h2>
      <FormControl fullWidth>
        <InputLabel>Group</InputLabel>
        <Select label="Group" name="group" value={groupId} onChange={handleChange}>
          {groups.map(g => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
        </Select>
      </FormControl>
      <TextField fullWidth multiline label="Comment" name="comment" value={comment} onChange={handleChange} rows={3} placeholder="Include a comment with your post." />
    </>);
  }


  if (showSuccess) return (<Snackbar open={true} anchorOrigin={{ horizontal: "center", vertical: "bottom" }} autoHideDuration={2500} onClose={() => props.onClose()}>
    <Alert variant="filled" severity="success">Content shared</Alert>
  </Snackbar>)
  else return (<Modal open={true} onClose={props.onClose}>
    <Box sx={style}>
      <div style={{paddingLeft:16, paddingRight:16}}>
        {getModalContent()}
      </div>
      <DialogActions sx={{ paddingX: "16px", paddingBottom: "12px" }}>
        <Button variant="outlined" onClick={props.onClose}>Close</Button>
        <Button variant="contained" onClick={handlePost}>Post</Button>
      </DialogActions>
    </Box>

  </Modal>);

}
