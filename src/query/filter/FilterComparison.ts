import { PropertyComparison } from '../../property/comparison/PropertyComparison';

export interface FilterComparison {
  source?: string;
  property: string;
  comparison: PropertyComparison;
  value: ComparableValues;
}

export type ComparableValues =
  | String
  | Number
  | Boolean
  | Date
  | String[]
  | Number[]
  | Boolean[]
  | Date[]
  | null
  | undefined
  ;