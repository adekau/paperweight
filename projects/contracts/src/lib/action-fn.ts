import { Observable } from 'rxjs';

export type ActionFn = () => Observable<any>;
