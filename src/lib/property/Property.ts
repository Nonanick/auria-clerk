import type { IProperty } from '@interfaces/property/IProperty';
import { IPropertyType } from '@interfaces/property/type/IPropertyType';

export class Property<T extends IProperty = IProperty> implements IProperty {

  #interface: T;

  #name: string;

  #type: T['type'];

  get name(): string {
    return this.#name;
  }

  get type(): IPropertyType | Symbol {
    return this.#type;
  }

  get required(): boolean {
    return this.#interface.required ?? false;
  }

  get descriptive(): boolean {
    return this.#interface.descriptive ?? false;
  }

  get private(): boolean {
    return this.#interface.private ?? false;
  }

  get identifier(): boolean {
    return this.#interface.identifier ?? false;
  }

  get nullable(): boolean {
    return this.#interface.nullable ?? true;
  }

  get sanitizers(): T['sanitizers'] {
    return { ...(this.#interface.sanitizers ?? {}) };
  }

  get validations(): T['validations'] {
    return { ...(this.#interface.validations ?? {})}!;
  }

  get serializer(): T['serializer'] {
    return this.#interface.serializer;
  }

  get unserializer(): T['unserializer'] {
    return this.#interface.unserializer;
  }

  get default(): T['default'] {
    if (typeof this.#interface.default === 'function') {
      return this.#interface.default();
    }
    return this.#interface.default();
  }

  constructor(prop: T) {
    this.#interface = {
      ...prop
    };

    this.#name = this.#interface.name;
    this.#type = this.#interface.type;
  }

}