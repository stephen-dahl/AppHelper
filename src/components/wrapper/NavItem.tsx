"use client";

import React from "react";
import { Badge, Icon, IconButton, ListItemButton, ListItemIcon, ListItemText, styled, Tooltip } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

interface Props {
	badgeCount?: number;
  url?: string;
  target?: string;
  label: string;
  icon: string;
  onClick?: () => void;
  onNavigate?: (url: string) => void;
  external?: boolean;
  selected?: boolean;
  deleteIcon?: string;
  deleteLabel?: string;
  deleteFunction?: () => void;
}

const StyledNavLink = styled(NavLink)({
  textDecoration: "none",
  "&:hover": { textDecoration: "none" },
  "& .MuiListItemIcon-root": { minWidth: 40 }
});

export const NavItem: React.FC<Props> = (props) => {
  let isReact = false;
  try {
    const a = typeof useLocation();
    if (a !== null) isReact = true;
  } catch { }

  const getIcon = () => {
    if (props.badgeCount && props.badgeCount > 0) return <Badge badgeContent={props.badgeCount} color="error"><Icon>{props.icon}</Icon></Badge>
    else return <Icon>{props.icon}</Icon>
  }

  const getLinkContents = () => (<ListItemButton>
    <Tooltip title={props.label || ""} arrow placement="right">
      <ListItemIcon sx={{ minWidth: "40px" }}>{getIcon()}</ListItemIcon>
    </Tooltip>
    <ListItemText primary={props.label} />
    {props?.deleteIcon
      ? (
        <Tooltip title={props.deleteLabel || ""} arrow placement="left">
          <IconButton onClick={props.deleteFunction ? (e) => { e.stopPropagation(); e.preventDefault(); props.deleteFunction() } : null} sx={{ color: "#f7a9a9" }} size="small">
            <Icon sx={{ fontSize: 19 }}>delete</Icon>
          </IconButton>
        </Tooltip>
      )
      : ""}
  </ListItemButton>)

  if (props.external || !isReact) return (<a href={props.url} target={props.target} rel="noreferrer" style={{ textDecoration: "none" }} className={(props.selected) ? "selected" : ""} onClick={(e) => { e.preventDefault(); props.onClick ? props.onClick() : window.location.href = props.url }}>{getLinkContents()}</a>)
  else return (<StyledNavLink to={props.url || "about:blank"} target={props.target} className={(props.selected) ? "selected" : ""} onClick={(e) => { e.preventDefault(); (props.onClick) ? props.onClick() : props.onNavigate(props.url)}}>{getLinkContents()}</StyledNavLink>)
};
