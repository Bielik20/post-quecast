import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isPostMessageEvent, PostMessageEvent } from '../models';

export function filterChannel<T = PostMessageEvent>(
  channelId: string,
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) =>
    source.pipe(
      filter(event => isPostMessageEvent(event)),
      filter((event: any) => event.data.channelId === channelId),
    );
}
