import { IProperty } from "../../property/IProperty";

export interface IOrderBy {
  property: string;
  direction?: 'asc' | 'desc';
}