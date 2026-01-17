import MainLayout from "../../layouts/MainLayout";
import AiChatPage from "./AiChatPage";


export default function AiChatRoute() {
  return (
    <MainLayout hideFloatingButtons>
      <AiChatPage />
    </MainLayout>
  );
}
