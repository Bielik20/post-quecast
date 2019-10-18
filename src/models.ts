export const libId = '@wikia/post-quecast';

export interface PostMessageEvent<T = any> {
  data: PostMessageData<T>;
  source: Window;
}

export function isPostMessageEvent(input: any): input is PostMessageEvent {
  return input && input.source && input.data && isPostMessageData(input.data);
}

export interface PostMessageData<T = any> {
  action: Action<T>;
  libId: string;
  channelId: string;
  private?: boolean;
}

export function isPostMessageData(input: any): input is PostMessageData {
  return (
    input.action &&
    input.action.type &&
    input.action.timestamp &&
    input.channelId &&
    input.libId === libId
  );
}

export type Action<T = any> = {
  type: string;
  timestamp?: number;
} & T;
