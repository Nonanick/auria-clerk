import { FilterComparison } from './FilterComparisson';

export type IFilterQuery = {
  $or?: FilterComparison[];
  $not?: FilterComparison[];
  [name: string]: IFilterQuery | FilterComparison | FilterComparison[] | undefined;
};

export function implementsFilterComparisson(obj: any): obj is FilterComparison {
  return (
    typeof obj.property === "string"
    && typeof obj.comparisson === "string"
    && ["string", "number", "object", "boolean",].includes(typeof obj.value)
  );
}
