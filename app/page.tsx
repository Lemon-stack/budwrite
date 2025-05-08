import StoryFormPage from "./story-form-page";
import CommunityCreationsPage from "./community/page";
export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <StoryFormPage />

      <CommunityCreationsPage />
    </div>
  );
}
