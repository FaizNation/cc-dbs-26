import React from "react";
import PropTypes from "prop-types";
import useInput from "../utils/useInput";
import LocaleContext from "../contexts/LocaleContext";

function RegisterInput({ register }) {
  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [confirmPassword, onConfirmPasswordChange] = useInput("");
  const { locale } = React.useContext(LocaleContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert(
        locale === "id"
          ? "Kata sandi tidak cocok"
          : "Password and confirm password must match",
      );
      return;
    }
    register({ name, email, password });
  };

  return (
    <form onSubmit={onSubmitHandler} className="register-input">
      <input
        type="text"
        placeholder={locale === "id" ? "Nama" : "Name"}
        value={name}
        onChange={onNameChange}
      />
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
      <input
        type="password"
        placeholder={
          locale === "id" ? "Konfirmasi kata sandi" : "Confirm Password"
        }
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
      />
      <button type="submit">{locale === "id" ? "Daftar" : "Register"}</button>
    </form>
  );
}

RegisterInput.propTypes = {
  register: PropTypes.func.isRequired,
};

export default RegisterInput;
