export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: number;
  type: MediaType;
  src: string;
  thumbnail: string;
  fileId: string;
}
