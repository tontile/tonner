import { getI18n } from "@/locales/server";

export const metadata = {
  title: "Dashboard",
};

export default async function Page({ params }: { params: { domain: string } }) {
  const t = await getI18n();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <p>{t("welcome", { name: params.domain })}</p>
        {/* TODO: Mini-App dashboard  */}
      </div>
    </div>
  );
}
