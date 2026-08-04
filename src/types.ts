export interface User {
  id: string;
  username: string;
  avatar: string;
  fullName: string;
  bio: string;
  followers: string[]; // array of user ids
  following: string[]; // array of user ids
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
  likes: string[]; // array of user ids
  replies?: Comment[];
}

export interface Post {
  id: string;
  userId: string;
  type: 'image' | 'video';
  mediaUrl: string;
  mediaUrls?: string[]; // For multiple images
  caption: string;
  likes: string[]; // array of user ids
  comments?: Comment[];
  timestamp: number;
  overlayText?: string;
  overlaySubText?: string;
  overlayTags?: string[];
}
