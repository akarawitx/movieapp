import { PRIVACY, TERMS } from "../data/legal";
import LegalDocument from "../components/LegalDocument";

export function PrivacyPage() {
  return <LegalDocument doc={PRIVACY} related={{ to: "/terms", label: "เงื่อนไขการใช้งาน" }} />;
}

export function TermsPage() {
  return (
    <LegalDocument doc={TERMS} related={{ to: "/privacy", label: "นโยบายความเป็นส่วนตัว" }} />
  );
}
