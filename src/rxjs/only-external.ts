import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { INTERNAL } from '../actions';
import { PostMessageEvent } from '../models';

export const onlyExternal = () => (
  source: Observable<PostMessageEvent>,
): Observable<PostMessageEvent> => {
  return source.pipe(
    filter(
      event => !Object.values(INTERNAL).some((type: string) => event.data.action.type === type),
    ),
  );
};
