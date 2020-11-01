import { Store } from "../src/store/Store";
import { MockEntity } from "./MockEntity";
import { MockFactory } from "./MockFactory";

let store = new Store(new MockFactory);

store.add(
  MockEntity
);

store
  .entity('mock')!
  .execute(
    'batch_update'
  );

let query = store.query('mock')
  .addFilter(
    'user-provided',
    {
      property: 'name',
      comparisson: 'like',
      value: 'Nic'
    }
  )
  .addFilter(
    'status-active',
    {
      property: 'status',
      comparisson: 'equal',
      value: 'active'
    }
  );


query.removeLimit();

let models = query.fetch();