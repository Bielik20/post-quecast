import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action } from '../utils/action';

export const onlyNew = <T>() => (source: Observable<Action<T>>): Observable<Action<T>> => {
  const timestamp = new Date().getTime();

  return source.pipe(filter(event => event.timestamp > timestamp));
};
