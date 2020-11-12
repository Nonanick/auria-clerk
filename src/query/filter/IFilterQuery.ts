import { FilterComparison } from './FilterComparison';

export type IFilterQuery = {
  $or?: FilterComparison[];
  $not?: FilterComparison[];
  [name: string]: IFilterQuery | FilterComparison | FilterComparison[] | undefined;
};

export function implementsFilterComparison(obj: any): obj is FilterComparison {
  return (
    typeof obj.property === "string"
    && typeof obj.comparison === "string"
  );
}
