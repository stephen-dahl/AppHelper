"use client";

import React from "react";
import { SmallButton } from "../SmallButton";
import { PrivateMessageInterface, UserContextInterface } from "@churchapps/helpers";
import { Notes } from "../notes/Notes";
import { Locale } from "../../helpers";

interface Props {
  context: UserContextInterface;
  privateMessage: PrivateMessageInterface;
  onBack: () => void
  refreshKey: number;
}

export const PrivateMessageDetails: React.FC<Props> = (props) => (
  <>
    <div style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
      <span style={{ float: "right" }}>
        <SmallButton icon="chevron_left" text="Back" onClick={props.onBack} />
      </span>
      {Locale.label("wrapper.chatWith")} {props.privateMessage.person.name.display}
    </div>
    <Notes maxHeight={"50vh"} context={props.context} conversationId={props.privateMessage.conversationId} noDisplayBox={true} refreshKey={props.refreshKey} />
  </>
);

