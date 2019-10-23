import { isPostMessageData, PostMessageData } from './post-message-data';

export interface PostMessageEvent<T = any> {
  data: PostMessageData<T>;
  source: Window;
}

export function isPostMessageEvent(input: any): input is PostMessageEvent {
  return input && input.source && input.data && isPostMessageData(input.data);
}
