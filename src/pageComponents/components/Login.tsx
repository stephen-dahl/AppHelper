import React from "react";
import { InputBox } from "../../components";
import { TextField, Box, PaperProps } from "@mui/material";
import { Locale } from "../../helpers/Locale";

interface Props {
  //registerCallback: () => void,
  //loginCallback: () => void
  login: (data: any) => void,
  isSubmitting: boolean,
  setShowRegister: (showRegister: boolean) => void,
  setShowForgot: (showForgot: boolean) => void,
  setErrors: (errors: string[]) => void;
  mainContainerCssProps?: PaperProps;
}

export const Login: React.FC<Props> = ({ mainContainerCssProps = {}, ...props }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const validateEmail = (email: string) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email))

  const validate = () => {
    const result = [];
    if (!email) result.push(Locale.label("login.validate.email"));
    else if (!validateEmail(email)) result.push(Locale.label("login.validate.email"));
    if (!password) result.push(Locale.label("login.validate.password"));
    props.setErrors(result);
    return result.length === 0;
  }

  const submitLogin = () => {
    if (validate()) props.login({ email, password });
  }

  const getRegisterLink = () => (
    <><a href="about:blank" className="text-decoration" onClick={handleShowRegister}>{Locale.label("login.register")}</a> &nbsp; | &nbsp; </>
  )

  const handleShowRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    props.setShowRegister(true);
  }

  return (
    <InputBox headerText={Locale.label("login.signInTitle")} saveFunction={submitLogin} saveButtonType="submit" saveText={props.isSubmitting ? Locale.label("common.pleaseWait") : Locale.label("login.signIn")} isSubmitting={props.isSubmitting} mainContainerCssProps={mainContainerCssProps}>
      <TextField fullWidth autoFocus name="email" type="email" label={Locale.label("login.email")} value={email} onChange={(e) => { e.preventDefault(); setEmail(e.target.value) }} />
      <TextField fullWidth name="email" type="password" label={Locale.label("login.password")} value={password} onChange={(e) => { e.preventDefault(); setPassword(e.target.value) }} />
      <Box sx={{ textAlign: "right", marginY: 1 }}>
        {getRegisterLink()}
        <a href="about:blank" className="text-decoration" onClick={(e) => { e.preventDefault(); props.setShowForgot(true); }}>{Locale.label("login.forgot")}</a>&nbsp;
      </Box>
    </InputBox>
  );
}
