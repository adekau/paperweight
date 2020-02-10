import { FormGroup } from '@angular/forms';
import { EntityState } from '@datorama/akita';

export interface IFormDraftState extends EntityState<FormGroup, string> { }
