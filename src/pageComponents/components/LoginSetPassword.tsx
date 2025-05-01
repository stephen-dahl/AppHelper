"use client";

import React, { useState } from "react";
import { InputBox } from "../../components";
import { Icon, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { LoginResponseInterface, UserInterface } from "@churchapps/helpers";
import { ApiHelper, Locale } from "../../helpers";

interface Props {
  appName: string,
  appUrl: string,
  setErrors: (errors: string[]) => void,
  setShowForgot: (showForgot: boolean) => void,
  isSubmitting: boolean,
  auth: string,
  login: (data: any) => void,
}

export const LoginSetPassword: React.FC<Props> = props => {
  const [password, setPassword] = React.useState("");
  const [verifyPassword, setVerifyPassword] = React.useState("");
  const [user, setUser] = React.useState<UserInterface>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [linkExpired, setLinkExpired] = React.useState(false);

  const validate = () => {
    const result = [];
    if (!password) result.push(Locale.label("login.validate.password"));
    else if (password.length < 8) result.push(Locale.label("login.validate.passwordLength"));
    else if (password !== verifyPassword) result.push(Locale.label("login.validate.passwordMatch"));
    props.setErrors(result);
    return result.length === 0;
  }

  const submitChangePassword = () => {
    if (linkExpired) {
      window.open("/login", "_blank");
    } else if (validate()) {
      submit();
    }
  }

  const loadUser = () => {
    ApiHelper.postAnonymous("/users/login", { authGuid: props.auth }, "MembershipApi").then((resp: LoginResponseInterface) => {

      console.log("RESPONSE", resp);
      if (resp.user) setUser(resp.user);
      else props.setShowForgot(true);
    }).catch(() => {
      props.setShowForgot(true);
    });
  }

  const submit = async () => {
    const resp = await ApiHelper.postAnonymous("/users/setPasswordGuid", { authGuid: props.auth, newPassword: password, appName: props.appName, appUrl: props.appUrl }, "MembershipApi");
    if (resp.success) props.login({ email: user.email, password });
    else props.setShowForgot(true);
  }

  React.useEffect(() => {
    //Get the timestamp from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const timestampParam = urlParams.get("timestamp");
    if (timestampParam) {
      const linkTimestamp = parseInt(timestampParam, 10);
      const currentTime = Date.now();

      //Check if the link is expired (2 min)
      if (currentTime - linkTimestamp > 600000) {
        setLinkExpired(true);
      } else {
        loadUser();
      }
    } else {
      setLinkExpired(true); //No timestamp means link is invalid
    }
  }, []);

  return (
    <InputBox headerText={Locale.label("login.setPassword")} saveFunction={submitChangePassword} saveButtonType="submit" saveText={!linkExpired ? (props.isSubmitting || !user) ? Locale.label("common.pleaseWait") : Locale.label("login.signIn") : Locale.label("login.requestLink")} isSubmitting={props.isSubmitting}>
      {linkExpired ? (
        <>
          <Typography sx={{ color: "#c62828 !important", paddingBottom: 3 }}>{Locale.label("login.expiredLink")}</Typography>
        </>
        ) : (
        <>
          {user && <p style={{ marginTop: 0, marginBottom: 0 }}>{Locale.label("login.welcomeBack")} {user.firstName}.</p>}
          <TextField fullWidth name="password" type={showPassword ? "text" : "password"} label={Locale.label("login.setPassword")} value={password} onChange={(e) => { e.preventDefault(); setPassword(e.target.value) }}  InputProps={{
            endAdornment: (<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={() => { setShowPassword(!showPassword) }}>{showPassword ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}</IconButton></InputAdornment>)
          }} />
          <TextField fullWidth name="verifyPassword" type={showPassword ? "text" : "password"} label={Locale.label("login.verifyPassword")} value={verifyPassword} onChange={(e) => { e.preventDefault(); setVerifyPassword(e.target.value) }}  InputProps={{
            endAdornment: (<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={() => { setShowPassword(!showPassword) }}>{showPassword ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}</IconButton></InputAdornment>)
          }} />
        </>
      )}
    </InputBox>
  );
}
