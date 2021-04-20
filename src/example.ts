const User : IEntity = {
  name : 'string',
  properties : {
    username : {
      type : 'string',
      required : true,
      validations : [ MinLength(4), MaxLength(20) ],
      sanitize : [ OnlyAllowTheseChars('A-z0-9@._-')]
    }
  },
  validations : {
    IsUnique('username'), 
  },
  proxy : {
    'request:create' : [ CreateIDOnCreation ],
    'response:create' : [ TranslateAfterCreation ],
    'request:update' : 
  }
}

// -> Dependency Injector


const Store = new Storage();

Store.addTo(MongoArchive, ...);

const UserEntity = Archive.Entity(User);

UserEntity.proxy('request:create', PopulateIDProperty('_id'));
UserEntity.on('create', NotifyWhenUserIsCreated);

UserEntity.InsertMany(UserEntity, [ User1, User2, ...Users]);
