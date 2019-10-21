import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PostMessageEvent } from '../models';

export const ofEventType = (...types: string[]) => (
  source: Observable<PostMessageEvent>,
): Observable<PostMessageEvent> => {
  return source.pipe(filter(event => types.some(type => event.data.action.type === type)));
};
