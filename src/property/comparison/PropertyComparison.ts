export type PropertyComparison =
  // equal
  | 'equal'
  | 'eq'
  | '='
  | '=='

  // is
  | "is"

  // not equal
  | 'neq'
  | 'not equal'
  | '<>'
  | '!='

  // like
  | 'like'
  | '=~'

  // not like
  | 'not like'
  | '!=~'

  // lesser than
  | '<'
  | 'lt'
  | 'lesser than'

  // greater than
  | '>'
  | 'gt'
  | 'greater than'

  // lesser than or equal to
  | '<='
  | 'lte'
  | 'lesser than or equal to'

  // greater than or equal to
  | '>='
  | 'gte'
  | 'greater than or equal to'

  // included
  | 'in'
  | 'included in'
  | 'contained in'

  // not included
  | 'not in'
  | 'not included in'
  | 'not contained in'


  ;