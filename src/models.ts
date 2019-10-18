// export interface Action<T> {
//   type: string;
//   payload: T;
// }

export interface PostMessageEvent<T = any> {
  data: PostMessageData<T>;
  source: Window;
}

export function isPostMessageEvent(input: any): input is PostMessageEvent {
  return input && input.source && input.data && isPostMessageData(input.data);
}

export interface PostMessageData<T = any> {
  action: Action<T>;
  channelId: string;
  timestamp: number;
}

export function isPostMessageData(input: any): input is PostMessageData {
  return input.action && input.action.type && input.channelId && input.timestamp;
}

export type Action<T> = {
  type: string;
} & T;
