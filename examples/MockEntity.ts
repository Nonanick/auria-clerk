import { CreateModelProcedure } from "../src/connection/mysql/procedure/model/CreateModel";
import { CreateModel } from "../src/entity/CreateModel";
import { IEntity } from "../src/entity/IEntity";
import { AppError } from "../src/error/AppError";
import { ExecuteModelProcedure } from "../src/procedure/model/ExecuteProcedure";
import { IntegerType } from "../src/property/type/common/IntegerType";

const mock: IEntity = {
  name: 'mock',

  identifier: {
    name: '_id',
    type: String,
    validate: (v: string) => v.length === 21 ? true : new AppError('ID is expected to be a 21 length string!'),
    sanitize: (v: string) => v.replace(/\s/g, ''),
  },

  properties: {
    name: {
      type: String,
      isDescriptive: true,
      required: true,
    },
    age: {
      type: IntegerType,
      required: true,
      validate: (v: Number) => v > 0 && v < 150 ? true : new AppError('Age is expected to be > 0 and lesser than 150!')
    },
    birthday: {
      type: Date,
      required: true,
    }
  },

  procedures: {
    model: {
      'create': CreateModelProcedure
    }
  }

};

export { mock as MockEntity };