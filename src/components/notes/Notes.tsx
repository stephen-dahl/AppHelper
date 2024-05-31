import React from "react";
import { Note } from "./Note";
import { AddNote } from "./AddNote";
import { DisplayBox, Loading } from "../";
import { ApiHelper, ArrayHelper } from "../../helpers";
import { MessageInterface, UserContextInterface } from "@churchapps/helpers";

interface Props {
  //showEditNote: (messageId?: string) => void;
  conversationId: string;
  createConversation?: () => Promise<string>;
  noDisplayBox?: boolean;
  context: UserContextInterface;
  maxHeight?: any;
  refreshKey?: number;
}

export function Notes(props: Props) {

  const [messages, setMessages] = React.useState<MessageInterface[]>(null)
  const [editMessageId, setEditMessageId] = React.useState(null)

  const loadNotes = async () => {
    const messages: MessageInterface[] = (props.conversationId) ? await ApiHelper.get("/messages/conversation/" + props.conversationId, "MessagingApi") : [];
    if (messages.length > 0) {
      const peopleIds = ArrayHelper.getIds(messages, "personId");
      const people = await ApiHelper.get("/people/basic?ids=" + peopleIds.join(","), "MembershipApi");
      messages.forEach(n => {
        n.person = ArrayHelper.getOne(people, "id", n.personId);
      })
    }
    setMessages(messages);
    setEditMessageId(null);
  };

  const getNotes = () => {
    if (!messages) return <Loading />
    if (messages.length === 0) return <></>
    else {
      let noteArray: React.ReactNode[] = [];
      for (let i = 0; i < messages.length; i++) noteArray.push(<Note message={messages[i]} key={messages[i].id} showEditNote={setEditMessageId} />);
      return noteArray;
    }
  }

  const getNotesWrapper = () => {
    const notes = getNotes();
    if (props.maxHeight) return <div id="notesScroll" style={{maxHeight: props.maxHeight, overflowY: "scroll"}}>{notes}</div>
    else return notes;
  }

  React.useEffect(() => { loadNotes() }, [props.conversationId, props.refreshKey]); //eslint-disable-line

  React.useEffect(() => {
    if (props.maxHeight && messages?.length>0) {
      setTimeout(() => {
        const element = window?.document?.getElementById("notesScroll");
        if (element) element.scrollTop = element.scrollHeight;
      }, 100);
    }
  }, [messages, props.maxHeight]);

  let result = <>
    {getNotesWrapper()}
    {messages && (<AddNote context={props.context} conversationId={props.conversationId} onUpdate={loadNotes} createConversation={props.createConversation} messageId={editMessageId} />)}
  </>
  if (props.noDisplayBox) return result;
  else return (<DisplayBox id="notesBox" data-cy="notes-box" headerIcon="sticky_note_2" headerText="Notes">{result}</DisplayBox>);
};
