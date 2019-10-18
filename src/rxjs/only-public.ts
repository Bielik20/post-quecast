import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PostMessageEvent } from '../models';

export const onlyPublic = () => (source: Observable<any>): Observable<PostMessageEvent> => {
  return source.pipe(filter(event => !event.data.private));
};
