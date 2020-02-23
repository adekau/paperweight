import { PaperweightService } from 'projects/forms/src/public-api';

export interface ActionFns {
    setDisabled: PaperweightService['setDisabled'];
    setValue: PaperweightService['setValue'];
    reset: PaperweightService['reset'];
    setValidators: PaperweightService['setValidators'];
}
