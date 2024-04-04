import React, { useState } from "react";
import { LoginUserChurchInterface, UserContextInterface, ArrayHelper } from "@churchapps/helpers";
import { ApiHelper } from "../../helpers/ApiHelper";
import { UserHelper } from "../../helpers/UserHelper";
import { NavItem } from "./NavItem";

export interface Props { userChurches: LoginUserChurchInterface[], currentUserChurch: LoginUserChurchInterface, context: UserContextInterface, onDelete?: () => void }

export const ChurchList: React.FC<Props> = props => {
  const [userChurches, setUserChurches] = useState(UserHelper.userChurches.filter(uc => uc.apis.length > 0 && uc.person.id !== null));

  const handleDelete = (uc: LoginUserChurchInterface) => {
    if (window.confirm(`Are you sure you wish to delete ${(uc.church.name).toUpperCase()} church from the list?`)) {
      ApiHelper.delete(`/userchurch/record/${props.context.user.id}/${uc.church.id}/${uc.person.id}`, "MembershipApi")
      .then(() => {
        // remove the same from userChurches
        const idx = ArrayHelper.getIndex(UserHelper.userChurches, "church.id", uc.church.id);
        if (idx > -1) UserHelper.userChurches.splice(idx, 1);
        //@ts-ignore
        UserHelper.userChurches.push({ apis: uc.apis, church: uc.church, groups: uc.groups, jwt: uc.jwt, person: { id: null, membershipStatus: null } });
        setUserChurches(UserHelper.userChurches.filter(uc => uc.apis.length > 0 && uc.person.id !== null));
        props?.onDelete();
      }) 
    }
  }

  if (userChurches.length < 2) return <></>;
  else {
    let result: JSX.Element[] = [];
    userChurches.forEach(uc => {
      const userChurch = uc;
      const churchName = uc.church.name;
      result.push(<NavItem 
        key={userChurch.church.id}
        selected={(uc.church.id === props.currentUserChurch.church.id) && true}
        onClick={() => UserHelper.selectChurch(props.context, userChurch.church.id, null)}
        label={churchName}
        icon="church"
        deleteIcon={uc.church.id !== props.currentUserChurch.church.id ? "delete" : null}
        deleteLabel="Delete church from the list"
        deleteFunction={() => { handleDelete(uc); }}
      />);
    });

    return <>{result}</>;
  }
};
