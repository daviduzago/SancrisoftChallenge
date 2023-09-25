export type ImageOrVideo = {
  url: string;
  contentType?: string;
};

export type SvgOrImageProps = {
  item: ImageOrVideo;
  style: any;
};

export type StoryDataValue = string | boolean | ImageOrVideo | null;

export type StoryData = {
  [key: string]: StoryDataValue;
};

export interface StoryProps {
  items: Story[];
}

export interface Story {
  title: string;
  eyebrowText: string;
  targetUrl: string;
  enableDarkBackdrop: boolean;
  eyebrowImage: ImageOrVideo;
  mobileImageOrVideo: ImageOrVideo;
}

export interface Announcement {
  backgroundColor: string;
  ctaLabel: string;
  ctaUrl: string;
  intro: string;
  message: string;
}

export interface SliderProps {
  items: Announcement[];
}
