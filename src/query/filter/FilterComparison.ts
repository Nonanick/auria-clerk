import { PropertyComparison } from '../../property/comparison/PropertyComparison';

export interface FilterAsObject {
  source?: string;
  property: string;
  comparison: PropertyComparison;
  value: ComparableValues;
}

export type FilterAsArray = [property: string, comparison: PropertyComparison, value: ComparableValues];

export type FilterComparison = FilterAsObject | FilterAsArray;

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