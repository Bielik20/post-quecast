import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action } from '../models';

export const mapAction = () => (source: Observable<any>): Observable<Action> => {
  return source.pipe(map(event => event.data.action));
};
