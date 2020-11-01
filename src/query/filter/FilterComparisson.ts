import { PropertyComparison } from '../../property/comparisson/PropertyComparisson';

export interface FilterComparison {
  source?: string;
  property: string;
  comparisson: PropertyComparison;
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
  | undefined
  ;