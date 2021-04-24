import { IHookContext } from './IHookContext';
import { IHookResult } from './IHookResult';

export interface IHook {
  
  name : string;

  procedure : string | string[] | Symbol;

  hookFn : IHookFunction;

}

export type IHookFunction = (context : IHookContext) => Promise<IHookResult>;
