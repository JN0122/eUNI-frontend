import { useTranslation } from "react-i18next";
import { Button, Select } from "antd";

const langs = { en: "English", pl: "Polski" };

function App() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Select
        defaultValue={i18n.language}
        onChange={(lng) => i18n.changeLanguage(lng)}
        options={Object.keys(langs).map((lng) => {
          return { value: lng, label: langs[lng] };
        })}
      />
      <Button>{t("test")}</Button>
    </>
  );
}

export default App;
