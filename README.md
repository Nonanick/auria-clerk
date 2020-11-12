# Auria-Clerk
---------------

A way to define and handle data on untrusted environments consistently

# Goal
-------
Create an easy way to define data structures that define their to integrity details, serialization / deserialization, persistence methods, query rules, and mutations( procedures ) that can be used with any kind of API strategy;

With such agnostic way to declare how data should be and what it should do, facilitate building tools that consume such representation and actually implement them;


## App Requirements
--------------------

* Entity

1. [ ] Draw how a data structure (called Entity) shall behave;
1.1 [ ] Specify a 'identifier', a property which holds an unique value, present in every model of said entity;
1.2 [ ] Describe a property, co-related to a "single-value", a property should describe its role inside the ;entity, its associated with a 'type' who can serialize/deserialize a complex value representation into the raw JS types avaliable ("primitives");
1.3 [ ] Procedures to the entity, an entity should detail all of the manipulations that can occur to itself or its models, these procedures are tightly related to the 'archive' (a way to represent various persistence strategies);
1.4 [ ] Proxies, all procedures can be intercepted on its request / response flow, for now proxies are designed to handle only procedures but as an additional feature ( or by demand ) entity lyfecycle might be introduced and if that happens some lyfecycles could be proxied;
1.5 [ ] Hooks, hooks are functions that are triggered after a sucessful procedure, if a request proxy or the procedure itself fails this function won't be called, just like proxies when/if entity lyfecycle is introduced there will be hooks to it;
1.6 [ ] Relations, describe the entity relationship with other entities (??? - still thinking how this should be introduced since i don't want to bind the entity system to SQL languages and allow NoSQL adapters to store reltions in different and meaningfull ways), anyway related data is something that will exists (y);
1.7 [ ] Validation, function that validate a model, called before each procedure ensures data integrity at model level ( best way to validate properties that depend on other values to be recognized as 'correct/valid');
1.8 [ ] Filtering, add a 'default' filtering to the entity, this filtering is applyed on EVERY query to said entity;
1.9 [ ] Ordering, add a default ordering to the models fetched, caution when using, ordergin in SQL db is one of the most expensive ops;

```typescript
const Entity : IEntity = {

  // unique identifier for entity
  name : 'entity',

  // property that uniquely identifies one model
  identifier : {
    name : '_id',
    type : FixedLengthString(21),
  },
  
  // other properties from the entity
  properties : {
    name : {
      type : String,
      required : true,
      descriptive : true
    },
    birthday : {
      type : Date
    },
    like_mangos : {
      type : Boolean,
      default : () => Math.random() > 0,5
    },
  },

  // 'default' filters to be used while querying
  filter : {
    // special filter, cant be removed from further queries
    $lock : {
      'no-young-people' : {
        property : 'birthday',
        comparison: 'lesser than',
        value : '01/01/2000'
      }
    },
    // can be removed by 'key' or calling 'noDefaultFilters()'
    'only-fetch-who-like-mangos' : {
      property : 'like_mangos',
      comparison : 'equal',
      value : true
    },
  },

  // natural ordering of the models
  order : {
    by : 'birthday',
    direction : 'asc'
  },

  procedures : {
    model : {
      'create' : MySQL.Create, // An archive adapter, create the model in the mysql db
      'update' : MySQL.Update, // An archive adapter, update the model in the mysql db
      'delete' : MySQL.Delete, // An archive adapter, delete the model from the mysql db
      
      // Not like this for now, checking if its pleasent { 
      'new' : {
        execute: MySQL.NewProcedure, 
        proxyRequest : [],
        proxyResponse: []
      }
      // } , so so...
    },
    entity : {
      'batchInsert' : MySQL.BatchInsert,
      'batchUpdate' : MySQL.BatchUpdate,
      'batchDelete' : MySQL.BatchDelete,
    }
  },

  // a bit verbose for now... add $proxy inside procedure declartion?
  proxy : {
    procedure : {
      model : {
        'create' : { 
            // No youngling
            request:  (request) => request.model.birthday < '01/01/2000' 
              ? new AppError('really dislike youngling') 
              : request,
            // Everybody will eventually like mangos
            response: (response) => response.model.like_mangos = true
        },
      },
    },
  },
  
  // When comitting values to the archive or mutating them, validate the model state first!
  validate(model : Model) : Maybe<true> | MaybePromise<true> {
    return Math.random() > 0.5 ? Promise.resolve(true) : new AppError('unlucky model');
  },

}
```

Even if the above is a bit large it could be broke into smaller files, the thing is, all the wiring to actually query and mutate the entity will be handled by clerk

When feeding from an REST Api, for example, this allows to populate a model with body params applying all the rules of sanitization / serializations intended for each field

* Property 

1. [ ] Define how a property should be and behave
1.2 [ ] Specify its Type, allowing the implementation of sanitization, validation, serialization/deserialization of values of high level of abstracion to its primitive counterpart, by handing the property such responsabilities allows the fine-grained control of how values inside a model should behave / be;
1.3 [ ] Proxies, intervene on the get / set of values modifying them when needed;
1.4 [ ] Common validations such as required, unique are part of the property decription;
1.5 [ ] Descriptive? a way to help visualization tools which properties actually describe the row
1.6 [ ] Private? a way to declare to the consumers that this property have sensitive information, 
query handlers should not return these propertis unless explicit told, API's should not send them back unless intentional;
1.7 [ ] Default, when commiting a set of data as an model undefined properties can acquire a default value before being processed, (e.g. required fields with default values never fail unless teh default function itself fails)

* Procedure

** Entity Procedure

1. [ ] Define a mutation that will revolve the entity itself, by rule of thumb if it does not strictly apply to a single model of the entity it should be and entity procedure, (e.g bulk update, insert, deletes, index creation, and so on);

** Model Procedure

1. [ ] Define a mutation that will revolve around the model of one entity, model procedures should only affect the model itself;

** Common

1. [ ] Request / Response, just like most fluxes in verity, mutations occur following this flow:

>> Procedure flux:
>> Requester asks for entity to perform procedure => request creation => request proxies => procedure(request) => response proxies => final response => response returned to requester

If the procedure(request) step is successfull it shall also fire all the hooks attached to the requested procedure, the request contains the context of the desired procedure and the targeted entity, the response shall have both states (previous and new) of the procedure target;





