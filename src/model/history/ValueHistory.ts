import { Model } from '../Model';

export interface ValueHistory {
  modelRef: Model;
  values: any;
  changedProperties: string[];
  committed_at: Date;
}