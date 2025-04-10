export interface StoryPage {
  imageUrl: string;
  text: string;
}

export interface Story {
  title: string;
  pages: StoryPage[];
}
