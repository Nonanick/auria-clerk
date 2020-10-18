import { Model } from '../Model';

export interface ValueHistory {
  modelRef: Model;
  values: any;
  changedProperties: string[];
  comitted_at: Date;
}