import React from "react";
import LocaleContext from "../contexts/LocaleContext";

function NotFoundPage() {
  const { locale } = React.useContext(LocaleContext);

  return (
    <section className="not-found-page">
      <div className="not-found-page__content">
        <h2>404</h2>
        <p>{locale === "id" ? "Halaman tidak ditemukan" : "Page not found"}</p>
      </div>
    </section>
  );
}

export default NotFoundPage;
