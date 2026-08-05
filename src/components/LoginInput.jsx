import React from "react";
import PropTypes from "prop-types";
import useInput from "../utils/useInput";
import LocaleContext from "../contexts/LocaleContext";

function LoginInput({ login }) {
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const { locale } = React.useContext(LocaleContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    login({ email, password });
  };

  return (
    <form onSubmit={onSubmitHandler} className="login-input">
      <input
        type="email"
        placeholder={locale === "id" ? "Email" : "Email"}
        value={email}
        onChange={onEmailChange}
      />
      <input
        type="password"
        placeholder={locale === "id" ? "Kata sandi" : "Password"}
        value={password}
        onChange={onPasswordChange}
      />
      <button type="submit">{locale === "id" ? "Masuk" : "Login"}</button>
    </form>
  );
}

LoginInput.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginInput;
