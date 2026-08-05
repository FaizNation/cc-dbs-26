import React from "react";
import LocaleContext from "../contexts/LocaleContext";

function Loading() {
  const { locale } = React.useContext(LocaleContext);

  return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>{locale === "id" ? "Memuat..." : "Loading..."}</p>
    </div>
  );
}

export default Loading;
