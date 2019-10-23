import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isPostMessageEvent, PostMessageEvent } from '../utils/post-message-event';

export const onlyValidMessages = () => (source: Observable<any>): Observable<PostMessageEvent> => {
  return source.pipe(filter(event => isPostMessageEvent(event)));
};
