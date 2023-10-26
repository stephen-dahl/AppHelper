import React from "react";
import { Box, styled } from "@mui/material";

interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }

const StyledMenuBox = styled(Box)(
  ({ theme }) => ({
    paddingTop: 10,
    "& .MuiListItemButton-root": { paddingLeft: 30 },
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main
    },
    "& .MuiListItemText-root": { color: theme.palette.text.primary },
    "& .selected .MuiListItemText-root span": { fontWeight: "bold" }
  })
);

export function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`userMenuPanel-${index}`}>
      {value === index && (
        <StyledMenuBox>
          <Box>{children}</Box>
        </StyledMenuBox>
      )}
    </div>
  );
}
