import { FilterComparison, FilterAsObject, FilterAsArray } from './FilterComparison';

export type IFilterQuery = {
  $or?: FilterComparison[];
  $not?: FilterComparison[];
  [name: string]: IFilterQuery | FilterComparison | FilterComparison[] | undefined;
};

export function implementsFilterComparison(obj: any): obj is FilterComparison {
  return (
    (typeof obj.property === "string"
      && typeof obj.comparison === "string"
    )
    || isFilterComparisonArray(obj)
  );
}

export function isFilterComparisonArray(obj: Array<any>): obj is FilterAsArray {
  return (
    obj.length === 3
    && typeof obj[0] === 'string'
    && typeof obj[1] === 'string'
  );
}