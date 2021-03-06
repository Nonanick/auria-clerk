import { Maybe, MaybePromise } from '../error/Maybe';
import { Model } from '../model/Model';
import { ComparableValues } from '../query/filter/FilterComparison';
import { DefaultValue, ResolveDefaultValue } from './default/DefaultValue';
import { IArrayProperty, IProperty } from './IProperty';
import { IPropertyRelation } from './relation/IPropertyRelation';
import { ArrayType } from './type/common/ArrayType';
import { BooleanType } from './type/common/BooleanType';
import { DateType } from './type/common/DateType';
import { NumberType } from './type/common/NumberType';
import { ObjectType } from './type/common/ObjectType';
import { StringType } from './type/common/StringType';
import { IPropertyType } from './type/IPropertyType';

export class Property {

  get name(): string {
    return this._info.name;
  }

  isPrivate(): boolean {
    return this._info.private ?? false;
  }

  isRequired(): boolean {
    return this._info.required ?? false;
  }

  isUnique(): boolean {
    return this._info.unique ?? false;

  }
  protected _info: IProperty;

  constructor(propertyInfo: IProperty) {
    this._info = propertyInfo;
  }

  async validate(value: ComparableValues, model: Model): MaybePromise<true> {
    if (this._info.validate == null) {
      return true;
    }
    let validate = this._info.validate;

    // Array of validations
    if (Array.isArray(validate)) {
      for (let v of validate) {
        let isValid = await v.validate(value as any, { property: this._info, model, });

        if (isValid instanceof Error) {
          return isValid;
        }
      }
      return true;
    }

    let isValid: Maybe<true>;
    // Single validation function
    if (typeof validate === 'function') {
      isValid = await validate(value as any, { property: this._info, model });
    } else {
      isValid = await validate.validate(value as any, { property: this._info, model });
    }

    if (isValid instanceof Error) {
      return isValid;
    }

    return true;
  }

  getProxy(value: any, model: Model): Maybe<any> {
    let getValue = value;

    for (let proxy of this._info.proxy?.get ?? []) {
      getValue = proxy(
        getValue,
        {
          property: this,
          model
        }
      );

      if (getValue instanceof Error) {
        return getValue;
      }
    }

    return getValue;
  }

  setProxy(value: any, model: Model): Maybe<any> {
    let setValue = value;

    for (let proxy of this._info.proxy?.set ?? []) {
      setValue = proxy(
        setValue,
        {
          property: this,
          model
        }
      );

      if (setValue instanceof Error) {
        return setValue;
      }
    }

    return setValue;
  }

  hasDefault(): boolean {
    return this._info.default !== undefined;
  }

  hasRelation(): boolean {
    return this._info.relatedTo != null;
  }

  getRelation(): IPropertyRelation | undefined {
    return this._info.relatedTo;
  }

  /**
   * Get Default
   * -----------
   * Return the resolved default value for this property!
   * If it's inside a function it shall call it !
   */
  async getDefault(): Promise<ComparableValues | undefined> {
    if (!this.hasDefault()) {
      return undefined;
    }
    return ResolveDefaultValue(this._info.default!);
  }

  syncGetDefault(): DefaultValue | undefined {
    if (!this.hasDefault()) {
      return undefined;
    }

    let def = this._info.default!;

    if (typeof def === "function") {
      return def() as DefaultValue;
    } else {
      return def;
    }

  }

  getType(): IPropertyType {
    const type = this._info.type;
    return normalizePropertyType(type, this._info);

  }

  toDTO(): string {
    let canBeOptional : boolean = true;
    if(this._info.name == "_id")
      console.log('Has default?', this._info);
    if(this.isRequired() && !this.hasDefault()) {
      canBeOptional = false;
    }
    return `${this.name}${canBeOptional ? '?' : ''}: ${this.getType().toDTO()}`;
  }
}


export function normalizePropertyType(type: IProperty['type'], info: IProperty): IPropertyType {

  if (type === 'string') {
    return StringType;
  }

  if (type === 'number') {
    return NumberType;
  }

  if (type === 'bool' || type === "boolean") {
    return BooleanType;
  }

  if (type === 'date') {
    return DateType;
  }

  if (type === 'object') {
    return ObjectType;
  }

  if (type === "array") {
    const i = info as IArrayProperty;
    if (typeof i.item === 'string') {
      return normalizePropertyType(i.item, info);
    }
    return ArrayType(i.item);
  }

  return type as IPropertyType;

}