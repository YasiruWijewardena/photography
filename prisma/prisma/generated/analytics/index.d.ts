
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ProfileViewEvent
 * 
 */
export type ProfileViewEvent = $Result.DefaultSelection<Prisma.$ProfileViewEventPayload>
/**
 * Model AlbumViewEvent
 * 
 */
export type AlbumViewEvent = $Result.DefaultSelection<Prisma.$AlbumViewEventPayload>
/**
 * Model PhotoViewEvent
 * 
 */
export type PhotoViewEvent = $Result.DefaultSelection<Prisma.$PhotoViewEventPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ProfileViewEvents
 * const profileViewEvents = await prisma.profileViewEvent.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ProfileViewEvents
   * const profileViewEvents = await prisma.profileViewEvent.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.profileViewEvent`: Exposes CRUD operations for the **ProfileViewEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfileViewEvents
    * const profileViewEvents = await prisma.profileViewEvent.findMany()
    * ```
    */
  get profileViewEvent(): Prisma.ProfileViewEventDelegate<ExtArgs>;

  /**
   * `prisma.albumViewEvent`: Exposes CRUD operations for the **AlbumViewEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AlbumViewEvents
    * const albumViewEvents = await prisma.albumViewEvent.findMany()
    * ```
    */
  get albumViewEvent(): Prisma.AlbumViewEventDelegate<ExtArgs>;

  /**
   * `prisma.photoViewEvent`: Exposes CRUD operations for the **PhotoViewEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PhotoViewEvents
    * const photoViewEvents = await prisma.photoViewEvent.findMany()
    * ```
    */
  get photoViewEvent(): Prisma.PhotoViewEventDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.0.1
   * Query Engine version: 5dbef10bdbfb579e07d35cc85fb1518d357cb99e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ProfileViewEvent: 'ProfileViewEvent',
    AlbumViewEvent: 'AlbumViewEvent',
    PhotoViewEvent: 'PhotoViewEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    analyticsDb?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "profileViewEvent" | "albumViewEvent" | "photoViewEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ProfileViewEvent: {
        payload: Prisma.$ProfileViewEventPayload<ExtArgs>
        fields: Prisma.ProfileViewEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileViewEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileViewEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewEventPayload>
          }
          findFirst: {
            args: Prisma.ProfileViewEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileViewEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewEventPayload>
          }
          findMany: {
            args: Prisma.ProfileViewEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewEventPayload>[]
          }
          create: {
            args: Prisma.ProfileViewEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewEventPayload>
          }
          createMany: {
            args: Prisma.ProfileViewEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProfileViewEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewEventPayload>
          }
          update: {
            args: Prisma.ProfileViewEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewEventPayload>
          }
          deleteMany: {
            args: Prisma.ProfileViewEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileViewEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProfileViewEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileViewEventPayload>
          }
          aggregate: {
            args: Prisma.ProfileViewEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfileViewEvent>
          }
          groupBy: {
            args: Prisma.ProfileViewEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileViewEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileViewEventCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileViewEventCountAggregateOutputType> | number
          }
        }
      }
      AlbumViewEvent: {
        payload: Prisma.$AlbumViewEventPayload<ExtArgs>
        fields: Prisma.AlbumViewEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlbumViewEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumViewEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlbumViewEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumViewEventPayload>
          }
          findFirst: {
            args: Prisma.AlbumViewEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumViewEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlbumViewEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumViewEventPayload>
          }
          findMany: {
            args: Prisma.AlbumViewEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumViewEventPayload>[]
          }
          create: {
            args: Prisma.AlbumViewEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumViewEventPayload>
          }
          createMany: {
            args: Prisma.AlbumViewEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AlbumViewEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumViewEventPayload>
          }
          update: {
            args: Prisma.AlbumViewEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumViewEventPayload>
          }
          deleteMany: {
            args: Prisma.AlbumViewEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlbumViewEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AlbumViewEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumViewEventPayload>
          }
          aggregate: {
            args: Prisma.AlbumViewEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlbumViewEvent>
          }
          groupBy: {
            args: Prisma.AlbumViewEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlbumViewEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlbumViewEventCountArgs<ExtArgs>
            result: $Utils.Optional<AlbumViewEventCountAggregateOutputType> | number
          }
        }
      }
      PhotoViewEvent: {
        payload: Prisma.$PhotoViewEventPayload<ExtArgs>
        fields: Prisma.PhotoViewEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PhotoViewEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoViewEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PhotoViewEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoViewEventPayload>
          }
          findFirst: {
            args: Prisma.PhotoViewEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoViewEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PhotoViewEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoViewEventPayload>
          }
          findMany: {
            args: Prisma.PhotoViewEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoViewEventPayload>[]
          }
          create: {
            args: Prisma.PhotoViewEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoViewEventPayload>
          }
          createMany: {
            args: Prisma.PhotoViewEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PhotoViewEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoViewEventPayload>
          }
          update: {
            args: Prisma.PhotoViewEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoViewEventPayload>
          }
          deleteMany: {
            args: Prisma.PhotoViewEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PhotoViewEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PhotoViewEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoViewEventPayload>
          }
          aggregate: {
            args: Prisma.PhotoViewEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePhotoViewEvent>
          }
          groupBy: {
            args: Prisma.PhotoViewEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<PhotoViewEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.PhotoViewEventCountArgs<ExtArgs>
            result: $Utils.Optional<PhotoViewEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model ProfileViewEvent
   */

  export type AggregateProfileViewEvent = {
    _count: ProfileViewEventCountAggregateOutputType | null
    _avg: ProfileViewEventAvgAggregateOutputType | null
    _sum: ProfileViewEventSumAggregateOutputType | null
    _min: ProfileViewEventMinAggregateOutputType | null
    _max: ProfileViewEventMaxAggregateOutputType | null
  }

  export type ProfileViewEventAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    profileUserId: number | null
  }

  export type ProfileViewEventSumAggregateOutputType = {
    id: number | null
    userId: number | null
    profileUserId: number | null
  }

  export type ProfileViewEventMinAggregateOutputType = {
    id: number | null
    userId: number | null
    anonymousId: string | null
    profileUserId: number | null
    createdAt: Date | null
  }

  export type ProfileViewEventMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    anonymousId: string | null
    profileUserId: number | null
    createdAt: Date | null
  }

  export type ProfileViewEventCountAggregateOutputType = {
    id: number
    userId: number
    anonymousId: number
    profileUserId: number
    createdAt: number
    _all: number
  }


  export type ProfileViewEventAvgAggregateInputType = {
    id?: true
    userId?: true
    profileUserId?: true
  }

  export type ProfileViewEventSumAggregateInputType = {
    id?: true
    userId?: true
    profileUserId?: true
  }

  export type ProfileViewEventMinAggregateInputType = {
    id?: true
    userId?: true
    anonymousId?: true
    profileUserId?: true
    createdAt?: true
  }

  export type ProfileViewEventMaxAggregateInputType = {
    id?: true
    userId?: true
    anonymousId?: true
    profileUserId?: true
    createdAt?: true
  }

  export type ProfileViewEventCountAggregateInputType = {
    id?: true
    userId?: true
    anonymousId?: true
    profileUserId?: true
    createdAt?: true
    _all?: true
  }

  export type ProfileViewEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileViewEvent to aggregate.
     */
    where?: ProfileViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileViewEvents to fetch.
     */
    orderBy?: ProfileViewEventOrderByWithRelationInput | ProfileViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileViewEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProfileViewEvents
    **/
    _count?: true | ProfileViewEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProfileViewEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProfileViewEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileViewEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileViewEventMaxAggregateInputType
  }

  export type GetProfileViewEventAggregateType<T extends ProfileViewEventAggregateArgs> = {
        [P in keyof T & keyof AggregateProfileViewEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfileViewEvent[P]>
      : GetScalarType<T[P], AggregateProfileViewEvent[P]>
  }




  export type ProfileViewEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileViewEventWhereInput
    orderBy?: ProfileViewEventOrderByWithAggregationInput | ProfileViewEventOrderByWithAggregationInput[]
    by: ProfileViewEventScalarFieldEnum[] | ProfileViewEventScalarFieldEnum
    having?: ProfileViewEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileViewEventCountAggregateInputType | true
    _avg?: ProfileViewEventAvgAggregateInputType
    _sum?: ProfileViewEventSumAggregateInputType
    _min?: ProfileViewEventMinAggregateInputType
    _max?: ProfileViewEventMaxAggregateInputType
  }

  export type ProfileViewEventGroupByOutputType = {
    id: number
    userId: number | null
    anonymousId: string | null
    profileUserId: number
    createdAt: Date
    _count: ProfileViewEventCountAggregateOutputType | null
    _avg: ProfileViewEventAvgAggregateOutputType | null
    _sum: ProfileViewEventSumAggregateOutputType | null
    _min: ProfileViewEventMinAggregateOutputType | null
    _max: ProfileViewEventMaxAggregateOutputType | null
  }

  type GetProfileViewEventGroupByPayload<T extends ProfileViewEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileViewEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileViewEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileViewEventGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileViewEventGroupByOutputType[P]>
        }
      >
    >


  export type ProfileViewEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    anonymousId?: boolean
    profileUserId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["profileViewEvent"]>


  export type ProfileViewEventSelectScalar = {
    id?: boolean
    userId?: boolean
    anonymousId?: boolean
    profileUserId?: boolean
    createdAt?: boolean
  }


  export type $ProfileViewEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProfileViewEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number | null
      anonymousId: string | null
      profileUserId: number
      createdAt: Date
    }, ExtArgs["result"]["profileViewEvent"]>
    composites: {}
  }

  type ProfileViewEventGetPayload<S extends boolean | null | undefined | ProfileViewEventDefaultArgs> = $Result.GetResult<Prisma.$ProfileViewEventPayload, S>

  type ProfileViewEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProfileViewEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProfileViewEventCountAggregateInputType | true
    }

  export interface ProfileViewEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProfileViewEvent'], meta: { name: 'ProfileViewEvent' } }
    /**
     * Find zero or one ProfileViewEvent that matches the filter.
     * @param {ProfileViewEventFindUniqueArgs} args - Arguments to find a ProfileViewEvent
     * @example
     * // Get one ProfileViewEvent
     * const profileViewEvent = await prisma.profileViewEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileViewEventFindUniqueArgs>(args: SelectSubset<T, ProfileViewEventFindUniqueArgs<ExtArgs>>): Prisma__ProfileViewEventClient<$Result.GetResult<Prisma.$ProfileViewEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProfileViewEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProfileViewEventFindUniqueOrThrowArgs} args - Arguments to find a ProfileViewEvent
     * @example
     * // Get one ProfileViewEvent
     * const profileViewEvent = await prisma.profileViewEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileViewEventFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileViewEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileViewEventClient<$Result.GetResult<Prisma.$ProfileViewEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProfileViewEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewEventFindFirstArgs} args - Arguments to find a ProfileViewEvent
     * @example
     * // Get one ProfileViewEvent
     * const profileViewEvent = await prisma.profileViewEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileViewEventFindFirstArgs>(args?: SelectSubset<T, ProfileViewEventFindFirstArgs<ExtArgs>>): Prisma__ProfileViewEventClient<$Result.GetResult<Prisma.$ProfileViewEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProfileViewEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewEventFindFirstOrThrowArgs} args - Arguments to find a ProfileViewEvent
     * @example
     * // Get one ProfileViewEvent
     * const profileViewEvent = await prisma.profileViewEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileViewEventFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileViewEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileViewEventClient<$Result.GetResult<Prisma.$ProfileViewEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProfileViewEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfileViewEvents
     * const profileViewEvents = await prisma.profileViewEvent.findMany()
     * 
     * // Get first 10 ProfileViewEvents
     * const profileViewEvents = await prisma.profileViewEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileViewEventWithIdOnly = await prisma.profileViewEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileViewEventFindManyArgs>(args?: SelectSubset<T, ProfileViewEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileViewEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProfileViewEvent.
     * @param {ProfileViewEventCreateArgs} args - Arguments to create a ProfileViewEvent.
     * @example
     * // Create one ProfileViewEvent
     * const ProfileViewEvent = await prisma.profileViewEvent.create({
     *   data: {
     *     // ... data to create a ProfileViewEvent
     *   }
     * })
     * 
     */
    create<T extends ProfileViewEventCreateArgs>(args: SelectSubset<T, ProfileViewEventCreateArgs<ExtArgs>>): Prisma__ProfileViewEventClient<$Result.GetResult<Prisma.$ProfileViewEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProfileViewEvents.
     * @param {ProfileViewEventCreateManyArgs} args - Arguments to create many ProfileViewEvents.
     * @example
     * // Create many ProfileViewEvents
     * const profileViewEvent = await prisma.profileViewEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileViewEventCreateManyArgs>(args?: SelectSubset<T, ProfileViewEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProfileViewEvent.
     * @param {ProfileViewEventDeleteArgs} args - Arguments to delete one ProfileViewEvent.
     * @example
     * // Delete one ProfileViewEvent
     * const ProfileViewEvent = await prisma.profileViewEvent.delete({
     *   where: {
     *     // ... filter to delete one ProfileViewEvent
     *   }
     * })
     * 
     */
    delete<T extends ProfileViewEventDeleteArgs>(args: SelectSubset<T, ProfileViewEventDeleteArgs<ExtArgs>>): Prisma__ProfileViewEventClient<$Result.GetResult<Prisma.$ProfileViewEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProfileViewEvent.
     * @param {ProfileViewEventUpdateArgs} args - Arguments to update one ProfileViewEvent.
     * @example
     * // Update one ProfileViewEvent
     * const profileViewEvent = await prisma.profileViewEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileViewEventUpdateArgs>(args: SelectSubset<T, ProfileViewEventUpdateArgs<ExtArgs>>): Prisma__ProfileViewEventClient<$Result.GetResult<Prisma.$ProfileViewEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProfileViewEvents.
     * @param {ProfileViewEventDeleteManyArgs} args - Arguments to filter ProfileViewEvents to delete.
     * @example
     * // Delete a few ProfileViewEvents
     * const { count } = await prisma.profileViewEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileViewEventDeleteManyArgs>(args?: SelectSubset<T, ProfileViewEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfileViewEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfileViewEvents
     * const profileViewEvent = await prisma.profileViewEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileViewEventUpdateManyArgs>(args: SelectSubset<T, ProfileViewEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProfileViewEvent.
     * @param {ProfileViewEventUpsertArgs} args - Arguments to update or create a ProfileViewEvent.
     * @example
     * // Update or create a ProfileViewEvent
     * const profileViewEvent = await prisma.profileViewEvent.upsert({
     *   create: {
     *     // ... data to create a ProfileViewEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfileViewEvent we want to update
     *   }
     * })
     */
    upsert<T extends ProfileViewEventUpsertArgs>(args: SelectSubset<T, ProfileViewEventUpsertArgs<ExtArgs>>): Prisma__ProfileViewEventClient<$Result.GetResult<Prisma.$ProfileViewEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProfileViewEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewEventCountArgs} args - Arguments to filter ProfileViewEvents to count.
     * @example
     * // Count the number of ProfileViewEvents
     * const count = await prisma.profileViewEvent.count({
     *   where: {
     *     // ... the filter for the ProfileViewEvents we want to count
     *   }
     * })
    **/
    count<T extends ProfileViewEventCountArgs>(
      args?: Subset<T, ProfileViewEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileViewEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfileViewEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfileViewEventAggregateArgs>(args: Subset<T, ProfileViewEventAggregateArgs>): Prisma.PrismaPromise<GetProfileViewEventAggregateType<T>>

    /**
     * Group by ProfileViewEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileViewEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfileViewEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileViewEventGroupByArgs['orderBy'] }
        : { orderBy?: ProfileViewEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfileViewEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileViewEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProfileViewEvent model
   */
  readonly fields: ProfileViewEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfileViewEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileViewEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProfileViewEvent model
   */ 
  interface ProfileViewEventFieldRefs {
    readonly id: FieldRef<"ProfileViewEvent", 'Int'>
    readonly userId: FieldRef<"ProfileViewEvent", 'Int'>
    readonly anonymousId: FieldRef<"ProfileViewEvent", 'String'>
    readonly profileUserId: FieldRef<"ProfileViewEvent", 'Int'>
    readonly createdAt: FieldRef<"ProfileViewEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProfileViewEvent findUnique
   */
  export type ProfileViewEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileViewEvent
     */
    select?: ProfileViewEventSelect<ExtArgs> | null
    /**
     * Filter, which ProfileViewEvent to fetch.
     */
    where: ProfileViewEventWhereUniqueInput
  }

  /**
   * ProfileViewEvent findUniqueOrThrow
   */
  export type ProfileViewEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileViewEvent
     */
    select?: ProfileViewEventSelect<ExtArgs> | null
    /**
     * Filter, which ProfileViewEvent to fetch.
     */
    where: ProfileViewEventWhereUniqueInput
  }

  /**
   * ProfileViewEvent findFirst
   */
  export type ProfileViewEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileViewEvent
     */
    select?: ProfileViewEventSelect<ExtArgs> | null
    /**
     * Filter, which ProfileViewEvent to fetch.
     */
    where?: ProfileViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileViewEvents to fetch.
     */
    orderBy?: ProfileViewEventOrderByWithRelationInput | ProfileViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileViewEvents.
     */
    cursor?: ProfileViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileViewEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileViewEvents.
     */
    distinct?: ProfileViewEventScalarFieldEnum | ProfileViewEventScalarFieldEnum[]
  }

  /**
   * ProfileViewEvent findFirstOrThrow
   */
  export type ProfileViewEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileViewEvent
     */
    select?: ProfileViewEventSelect<ExtArgs> | null
    /**
     * Filter, which ProfileViewEvent to fetch.
     */
    where?: ProfileViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileViewEvents to fetch.
     */
    orderBy?: ProfileViewEventOrderByWithRelationInput | ProfileViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileViewEvents.
     */
    cursor?: ProfileViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileViewEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileViewEvents.
     */
    distinct?: ProfileViewEventScalarFieldEnum | ProfileViewEventScalarFieldEnum[]
  }

  /**
   * ProfileViewEvent findMany
   */
  export type ProfileViewEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileViewEvent
     */
    select?: ProfileViewEventSelect<ExtArgs> | null
    /**
     * Filter, which ProfileViewEvents to fetch.
     */
    where?: ProfileViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileViewEvents to fetch.
     */
    orderBy?: ProfileViewEventOrderByWithRelationInput | ProfileViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProfileViewEvents.
     */
    cursor?: ProfileViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileViewEvents.
     */
    skip?: number
    distinct?: ProfileViewEventScalarFieldEnum | ProfileViewEventScalarFieldEnum[]
  }

  /**
   * ProfileViewEvent create
   */
  export type ProfileViewEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileViewEvent
     */
    select?: ProfileViewEventSelect<ExtArgs> | null
    /**
     * The data needed to create a ProfileViewEvent.
     */
    data: XOR<ProfileViewEventCreateInput, ProfileViewEventUncheckedCreateInput>
  }

  /**
   * ProfileViewEvent createMany
   */
  export type ProfileViewEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProfileViewEvents.
     */
    data: ProfileViewEventCreateManyInput | ProfileViewEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfileViewEvent update
   */
  export type ProfileViewEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileViewEvent
     */
    select?: ProfileViewEventSelect<ExtArgs> | null
    /**
     * The data needed to update a ProfileViewEvent.
     */
    data: XOR<ProfileViewEventUpdateInput, ProfileViewEventUncheckedUpdateInput>
    /**
     * Choose, which ProfileViewEvent to update.
     */
    where: ProfileViewEventWhereUniqueInput
  }

  /**
   * ProfileViewEvent updateMany
   */
  export type ProfileViewEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProfileViewEvents.
     */
    data: XOR<ProfileViewEventUpdateManyMutationInput, ProfileViewEventUncheckedUpdateManyInput>
    /**
     * Filter which ProfileViewEvents to update
     */
    where?: ProfileViewEventWhereInput
  }

  /**
   * ProfileViewEvent upsert
   */
  export type ProfileViewEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileViewEvent
     */
    select?: ProfileViewEventSelect<ExtArgs> | null
    /**
     * The filter to search for the ProfileViewEvent to update in case it exists.
     */
    where: ProfileViewEventWhereUniqueInput
    /**
     * In case the ProfileViewEvent found by the `where` argument doesn't exist, create a new ProfileViewEvent with this data.
     */
    create: XOR<ProfileViewEventCreateInput, ProfileViewEventUncheckedCreateInput>
    /**
     * In case the ProfileViewEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileViewEventUpdateInput, ProfileViewEventUncheckedUpdateInput>
  }

  /**
   * ProfileViewEvent delete
   */
  export type ProfileViewEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileViewEvent
     */
    select?: ProfileViewEventSelect<ExtArgs> | null
    /**
     * Filter which ProfileViewEvent to delete.
     */
    where: ProfileViewEventWhereUniqueInput
  }

  /**
   * ProfileViewEvent deleteMany
   */
  export type ProfileViewEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileViewEvents to delete
     */
    where?: ProfileViewEventWhereInput
  }

  /**
   * ProfileViewEvent without action
   */
  export type ProfileViewEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileViewEvent
     */
    select?: ProfileViewEventSelect<ExtArgs> | null
  }


  /**
   * Model AlbumViewEvent
   */

  export type AggregateAlbumViewEvent = {
    _count: AlbumViewEventCountAggregateOutputType | null
    _avg: AlbumViewEventAvgAggregateOutputType | null
    _sum: AlbumViewEventSumAggregateOutputType | null
    _min: AlbumViewEventMinAggregateOutputType | null
    _max: AlbumViewEventMaxAggregateOutputType | null
  }

  export type AlbumViewEventAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    albumId: number | null
  }

  export type AlbumViewEventSumAggregateOutputType = {
    id: number | null
    userId: number | null
    albumId: number | null
  }

  export type AlbumViewEventMinAggregateOutputType = {
    id: number | null
    userId: number | null
    anonymousId: string | null
    albumId: number | null
    createdAt: Date | null
  }

  export type AlbumViewEventMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    anonymousId: string | null
    albumId: number | null
    createdAt: Date | null
  }

  export type AlbumViewEventCountAggregateOutputType = {
    id: number
    userId: number
    anonymousId: number
    albumId: number
    createdAt: number
    _all: number
  }


  export type AlbumViewEventAvgAggregateInputType = {
    id?: true
    userId?: true
    albumId?: true
  }

  export type AlbumViewEventSumAggregateInputType = {
    id?: true
    userId?: true
    albumId?: true
  }

  export type AlbumViewEventMinAggregateInputType = {
    id?: true
    userId?: true
    anonymousId?: true
    albumId?: true
    createdAt?: true
  }

  export type AlbumViewEventMaxAggregateInputType = {
    id?: true
    userId?: true
    anonymousId?: true
    albumId?: true
    createdAt?: true
  }

  export type AlbumViewEventCountAggregateInputType = {
    id?: true
    userId?: true
    anonymousId?: true
    albumId?: true
    createdAt?: true
    _all?: true
  }

  export type AlbumViewEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlbumViewEvent to aggregate.
     */
    where?: AlbumViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumViewEvents to fetch.
     */
    orderBy?: AlbumViewEventOrderByWithRelationInput | AlbumViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlbumViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumViewEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AlbumViewEvents
    **/
    _count?: true | AlbumViewEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlbumViewEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlbumViewEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlbumViewEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlbumViewEventMaxAggregateInputType
  }

  export type GetAlbumViewEventAggregateType<T extends AlbumViewEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAlbumViewEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlbumViewEvent[P]>
      : GetScalarType<T[P], AggregateAlbumViewEvent[P]>
  }




  export type AlbumViewEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlbumViewEventWhereInput
    orderBy?: AlbumViewEventOrderByWithAggregationInput | AlbumViewEventOrderByWithAggregationInput[]
    by: AlbumViewEventScalarFieldEnum[] | AlbumViewEventScalarFieldEnum
    having?: AlbumViewEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlbumViewEventCountAggregateInputType | true
    _avg?: AlbumViewEventAvgAggregateInputType
    _sum?: AlbumViewEventSumAggregateInputType
    _min?: AlbumViewEventMinAggregateInputType
    _max?: AlbumViewEventMaxAggregateInputType
  }

  export type AlbumViewEventGroupByOutputType = {
    id: number
    userId: number | null
    anonymousId: string | null
    albumId: number
    createdAt: Date
    _count: AlbumViewEventCountAggregateOutputType | null
    _avg: AlbumViewEventAvgAggregateOutputType | null
    _sum: AlbumViewEventSumAggregateOutputType | null
    _min: AlbumViewEventMinAggregateOutputType | null
    _max: AlbumViewEventMaxAggregateOutputType | null
  }

  type GetAlbumViewEventGroupByPayload<T extends AlbumViewEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlbumViewEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlbumViewEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlbumViewEventGroupByOutputType[P]>
            : GetScalarType<T[P], AlbumViewEventGroupByOutputType[P]>
        }
      >
    >


  export type AlbumViewEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    anonymousId?: boolean
    albumId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["albumViewEvent"]>


  export type AlbumViewEventSelectScalar = {
    id?: boolean
    userId?: boolean
    anonymousId?: boolean
    albumId?: boolean
    createdAt?: boolean
  }


  export type $AlbumViewEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AlbumViewEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number | null
      anonymousId: string | null
      albumId: number
      createdAt: Date
    }, ExtArgs["result"]["albumViewEvent"]>
    composites: {}
  }

  type AlbumViewEventGetPayload<S extends boolean | null | undefined | AlbumViewEventDefaultArgs> = $Result.GetResult<Prisma.$AlbumViewEventPayload, S>

  type AlbumViewEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AlbumViewEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AlbumViewEventCountAggregateInputType | true
    }

  export interface AlbumViewEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AlbumViewEvent'], meta: { name: 'AlbumViewEvent' } }
    /**
     * Find zero or one AlbumViewEvent that matches the filter.
     * @param {AlbumViewEventFindUniqueArgs} args - Arguments to find a AlbumViewEvent
     * @example
     * // Get one AlbumViewEvent
     * const albumViewEvent = await prisma.albumViewEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlbumViewEventFindUniqueArgs>(args: SelectSubset<T, AlbumViewEventFindUniqueArgs<ExtArgs>>): Prisma__AlbumViewEventClient<$Result.GetResult<Prisma.$AlbumViewEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AlbumViewEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AlbumViewEventFindUniqueOrThrowArgs} args - Arguments to find a AlbumViewEvent
     * @example
     * // Get one AlbumViewEvent
     * const albumViewEvent = await prisma.albumViewEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlbumViewEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AlbumViewEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlbumViewEventClient<$Result.GetResult<Prisma.$AlbumViewEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AlbumViewEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumViewEventFindFirstArgs} args - Arguments to find a AlbumViewEvent
     * @example
     * // Get one AlbumViewEvent
     * const albumViewEvent = await prisma.albumViewEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlbumViewEventFindFirstArgs>(args?: SelectSubset<T, AlbumViewEventFindFirstArgs<ExtArgs>>): Prisma__AlbumViewEventClient<$Result.GetResult<Prisma.$AlbumViewEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AlbumViewEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumViewEventFindFirstOrThrowArgs} args - Arguments to find a AlbumViewEvent
     * @example
     * // Get one AlbumViewEvent
     * const albumViewEvent = await prisma.albumViewEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlbumViewEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AlbumViewEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlbumViewEventClient<$Result.GetResult<Prisma.$AlbumViewEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AlbumViewEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumViewEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AlbumViewEvents
     * const albumViewEvents = await prisma.albumViewEvent.findMany()
     * 
     * // Get first 10 AlbumViewEvents
     * const albumViewEvents = await prisma.albumViewEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const albumViewEventWithIdOnly = await prisma.albumViewEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlbumViewEventFindManyArgs>(args?: SelectSubset<T, AlbumViewEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumViewEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AlbumViewEvent.
     * @param {AlbumViewEventCreateArgs} args - Arguments to create a AlbumViewEvent.
     * @example
     * // Create one AlbumViewEvent
     * const AlbumViewEvent = await prisma.albumViewEvent.create({
     *   data: {
     *     // ... data to create a AlbumViewEvent
     *   }
     * })
     * 
     */
    create<T extends AlbumViewEventCreateArgs>(args: SelectSubset<T, AlbumViewEventCreateArgs<ExtArgs>>): Prisma__AlbumViewEventClient<$Result.GetResult<Prisma.$AlbumViewEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AlbumViewEvents.
     * @param {AlbumViewEventCreateManyArgs} args - Arguments to create many AlbumViewEvents.
     * @example
     * // Create many AlbumViewEvents
     * const albumViewEvent = await prisma.albumViewEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlbumViewEventCreateManyArgs>(args?: SelectSubset<T, AlbumViewEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AlbumViewEvent.
     * @param {AlbumViewEventDeleteArgs} args - Arguments to delete one AlbumViewEvent.
     * @example
     * // Delete one AlbumViewEvent
     * const AlbumViewEvent = await prisma.albumViewEvent.delete({
     *   where: {
     *     // ... filter to delete one AlbumViewEvent
     *   }
     * })
     * 
     */
    delete<T extends AlbumViewEventDeleteArgs>(args: SelectSubset<T, AlbumViewEventDeleteArgs<ExtArgs>>): Prisma__AlbumViewEventClient<$Result.GetResult<Prisma.$AlbumViewEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AlbumViewEvent.
     * @param {AlbumViewEventUpdateArgs} args - Arguments to update one AlbumViewEvent.
     * @example
     * // Update one AlbumViewEvent
     * const albumViewEvent = await prisma.albumViewEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlbumViewEventUpdateArgs>(args: SelectSubset<T, AlbumViewEventUpdateArgs<ExtArgs>>): Prisma__AlbumViewEventClient<$Result.GetResult<Prisma.$AlbumViewEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AlbumViewEvents.
     * @param {AlbumViewEventDeleteManyArgs} args - Arguments to filter AlbumViewEvents to delete.
     * @example
     * // Delete a few AlbumViewEvents
     * const { count } = await prisma.albumViewEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlbumViewEventDeleteManyArgs>(args?: SelectSubset<T, AlbumViewEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AlbumViewEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumViewEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AlbumViewEvents
     * const albumViewEvent = await prisma.albumViewEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlbumViewEventUpdateManyArgs>(args: SelectSubset<T, AlbumViewEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AlbumViewEvent.
     * @param {AlbumViewEventUpsertArgs} args - Arguments to update or create a AlbumViewEvent.
     * @example
     * // Update or create a AlbumViewEvent
     * const albumViewEvent = await prisma.albumViewEvent.upsert({
     *   create: {
     *     // ... data to create a AlbumViewEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AlbumViewEvent we want to update
     *   }
     * })
     */
    upsert<T extends AlbumViewEventUpsertArgs>(args: SelectSubset<T, AlbumViewEventUpsertArgs<ExtArgs>>): Prisma__AlbumViewEventClient<$Result.GetResult<Prisma.$AlbumViewEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AlbumViewEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumViewEventCountArgs} args - Arguments to filter AlbumViewEvents to count.
     * @example
     * // Count the number of AlbumViewEvents
     * const count = await prisma.albumViewEvent.count({
     *   where: {
     *     // ... the filter for the AlbumViewEvents we want to count
     *   }
     * })
    **/
    count<T extends AlbumViewEventCountArgs>(
      args?: Subset<T, AlbumViewEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlbumViewEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AlbumViewEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumViewEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlbumViewEventAggregateArgs>(args: Subset<T, AlbumViewEventAggregateArgs>): Prisma.PrismaPromise<GetAlbumViewEventAggregateType<T>>

    /**
     * Group by AlbumViewEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumViewEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlbumViewEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlbumViewEventGroupByArgs['orderBy'] }
        : { orderBy?: AlbumViewEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlbumViewEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlbumViewEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AlbumViewEvent model
   */
  readonly fields: AlbumViewEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AlbumViewEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlbumViewEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AlbumViewEvent model
   */ 
  interface AlbumViewEventFieldRefs {
    readonly id: FieldRef<"AlbumViewEvent", 'Int'>
    readonly userId: FieldRef<"AlbumViewEvent", 'Int'>
    readonly anonymousId: FieldRef<"AlbumViewEvent", 'String'>
    readonly albumId: FieldRef<"AlbumViewEvent", 'Int'>
    readonly createdAt: FieldRef<"AlbumViewEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AlbumViewEvent findUnique
   */
  export type AlbumViewEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumViewEvent
     */
    select?: AlbumViewEventSelect<ExtArgs> | null
    /**
     * Filter, which AlbumViewEvent to fetch.
     */
    where: AlbumViewEventWhereUniqueInput
  }

  /**
   * AlbumViewEvent findUniqueOrThrow
   */
  export type AlbumViewEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumViewEvent
     */
    select?: AlbumViewEventSelect<ExtArgs> | null
    /**
     * Filter, which AlbumViewEvent to fetch.
     */
    where: AlbumViewEventWhereUniqueInput
  }

  /**
   * AlbumViewEvent findFirst
   */
  export type AlbumViewEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumViewEvent
     */
    select?: AlbumViewEventSelect<ExtArgs> | null
    /**
     * Filter, which AlbumViewEvent to fetch.
     */
    where?: AlbumViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumViewEvents to fetch.
     */
    orderBy?: AlbumViewEventOrderByWithRelationInput | AlbumViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlbumViewEvents.
     */
    cursor?: AlbumViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumViewEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlbumViewEvents.
     */
    distinct?: AlbumViewEventScalarFieldEnum | AlbumViewEventScalarFieldEnum[]
  }

  /**
   * AlbumViewEvent findFirstOrThrow
   */
  export type AlbumViewEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumViewEvent
     */
    select?: AlbumViewEventSelect<ExtArgs> | null
    /**
     * Filter, which AlbumViewEvent to fetch.
     */
    where?: AlbumViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumViewEvents to fetch.
     */
    orderBy?: AlbumViewEventOrderByWithRelationInput | AlbumViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlbumViewEvents.
     */
    cursor?: AlbumViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumViewEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlbumViewEvents.
     */
    distinct?: AlbumViewEventScalarFieldEnum | AlbumViewEventScalarFieldEnum[]
  }

  /**
   * AlbumViewEvent findMany
   */
  export type AlbumViewEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumViewEvent
     */
    select?: AlbumViewEventSelect<ExtArgs> | null
    /**
     * Filter, which AlbumViewEvents to fetch.
     */
    where?: AlbumViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumViewEvents to fetch.
     */
    orderBy?: AlbumViewEventOrderByWithRelationInput | AlbumViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AlbumViewEvents.
     */
    cursor?: AlbumViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumViewEvents.
     */
    skip?: number
    distinct?: AlbumViewEventScalarFieldEnum | AlbumViewEventScalarFieldEnum[]
  }

  /**
   * AlbumViewEvent create
   */
  export type AlbumViewEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumViewEvent
     */
    select?: AlbumViewEventSelect<ExtArgs> | null
    /**
     * The data needed to create a AlbumViewEvent.
     */
    data: XOR<AlbumViewEventCreateInput, AlbumViewEventUncheckedCreateInput>
  }

  /**
   * AlbumViewEvent createMany
   */
  export type AlbumViewEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AlbumViewEvents.
     */
    data: AlbumViewEventCreateManyInput | AlbumViewEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AlbumViewEvent update
   */
  export type AlbumViewEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumViewEvent
     */
    select?: AlbumViewEventSelect<ExtArgs> | null
    /**
     * The data needed to update a AlbumViewEvent.
     */
    data: XOR<AlbumViewEventUpdateInput, AlbumViewEventUncheckedUpdateInput>
    /**
     * Choose, which AlbumViewEvent to update.
     */
    where: AlbumViewEventWhereUniqueInput
  }

  /**
   * AlbumViewEvent updateMany
   */
  export type AlbumViewEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AlbumViewEvents.
     */
    data: XOR<AlbumViewEventUpdateManyMutationInput, AlbumViewEventUncheckedUpdateManyInput>
    /**
     * Filter which AlbumViewEvents to update
     */
    where?: AlbumViewEventWhereInput
  }

  /**
   * AlbumViewEvent upsert
   */
  export type AlbumViewEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumViewEvent
     */
    select?: AlbumViewEventSelect<ExtArgs> | null
    /**
     * The filter to search for the AlbumViewEvent to update in case it exists.
     */
    where: AlbumViewEventWhereUniqueInput
    /**
     * In case the AlbumViewEvent found by the `where` argument doesn't exist, create a new AlbumViewEvent with this data.
     */
    create: XOR<AlbumViewEventCreateInput, AlbumViewEventUncheckedCreateInput>
    /**
     * In case the AlbumViewEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlbumViewEventUpdateInput, AlbumViewEventUncheckedUpdateInput>
  }

  /**
   * AlbumViewEvent delete
   */
  export type AlbumViewEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumViewEvent
     */
    select?: AlbumViewEventSelect<ExtArgs> | null
    /**
     * Filter which AlbumViewEvent to delete.
     */
    where: AlbumViewEventWhereUniqueInput
  }

  /**
   * AlbumViewEvent deleteMany
   */
  export type AlbumViewEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlbumViewEvents to delete
     */
    where?: AlbumViewEventWhereInput
  }

  /**
   * AlbumViewEvent without action
   */
  export type AlbumViewEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumViewEvent
     */
    select?: AlbumViewEventSelect<ExtArgs> | null
  }


  /**
   * Model PhotoViewEvent
   */

  export type AggregatePhotoViewEvent = {
    _count: PhotoViewEventCountAggregateOutputType | null
    _avg: PhotoViewEventAvgAggregateOutputType | null
    _sum: PhotoViewEventSumAggregateOutputType | null
    _min: PhotoViewEventMinAggregateOutputType | null
    _max: PhotoViewEventMaxAggregateOutputType | null
  }

  export type PhotoViewEventAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    photoId: number | null
  }

  export type PhotoViewEventSumAggregateOutputType = {
    id: number | null
    userId: number | null
    photoId: number | null
  }

  export type PhotoViewEventMinAggregateOutputType = {
    id: number | null
    userId: number | null
    anonymousId: string | null
    photoId: number | null
    createdAt: Date | null
  }

  export type PhotoViewEventMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    anonymousId: string | null
    photoId: number | null
    createdAt: Date | null
  }

  export type PhotoViewEventCountAggregateOutputType = {
    id: number
    userId: number
    anonymousId: number
    photoId: number
    createdAt: number
    _all: number
  }


  export type PhotoViewEventAvgAggregateInputType = {
    id?: true
    userId?: true
    photoId?: true
  }

  export type PhotoViewEventSumAggregateInputType = {
    id?: true
    userId?: true
    photoId?: true
  }

  export type PhotoViewEventMinAggregateInputType = {
    id?: true
    userId?: true
    anonymousId?: true
    photoId?: true
    createdAt?: true
  }

  export type PhotoViewEventMaxAggregateInputType = {
    id?: true
    userId?: true
    anonymousId?: true
    photoId?: true
    createdAt?: true
  }

  export type PhotoViewEventCountAggregateInputType = {
    id?: true
    userId?: true
    anonymousId?: true
    photoId?: true
    createdAt?: true
    _all?: true
  }

  export type PhotoViewEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PhotoViewEvent to aggregate.
     */
    where?: PhotoViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhotoViewEvents to fetch.
     */
    orderBy?: PhotoViewEventOrderByWithRelationInput | PhotoViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PhotoViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhotoViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhotoViewEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PhotoViewEvents
    **/
    _count?: true | PhotoViewEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PhotoViewEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PhotoViewEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PhotoViewEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PhotoViewEventMaxAggregateInputType
  }

  export type GetPhotoViewEventAggregateType<T extends PhotoViewEventAggregateArgs> = {
        [P in keyof T & keyof AggregatePhotoViewEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhotoViewEvent[P]>
      : GetScalarType<T[P], AggregatePhotoViewEvent[P]>
  }




  export type PhotoViewEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoViewEventWhereInput
    orderBy?: PhotoViewEventOrderByWithAggregationInput | PhotoViewEventOrderByWithAggregationInput[]
    by: PhotoViewEventScalarFieldEnum[] | PhotoViewEventScalarFieldEnum
    having?: PhotoViewEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PhotoViewEventCountAggregateInputType | true
    _avg?: PhotoViewEventAvgAggregateInputType
    _sum?: PhotoViewEventSumAggregateInputType
    _min?: PhotoViewEventMinAggregateInputType
    _max?: PhotoViewEventMaxAggregateInputType
  }

  export type PhotoViewEventGroupByOutputType = {
    id: number
    userId: number | null
    anonymousId: string | null
    photoId: number
    createdAt: Date
    _count: PhotoViewEventCountAggregateOutputType | null
    _avg: PhotoViewEventAvgAggregateOutputType | null
    _sum: PhotoViewEventSumAggregateOutputType | null
    _min: PhotoViewEventMinAggregateOutputType | null
    _max: PhotoViewEventMaxAggregateOutputType | null
  }

  type GetPhotoViewEventGroupByPayload<T extends PhotoViewEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PhotoViewEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PhotoViewEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhotoViewEventGroupByOutputType[P]>
            : GetScalarType<T[P], PhotoViewEventGroupByOutputType[P]>
        }
      >
    >


  export type PhotoViewEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    anonymousId?: boolean
    photoId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["photoViewEvent"]>


  export type PhotoViewEventSelectScalar = {
    id?: boolean
    userId?: boolean
    anonymousId?: boolean
    photoId?: boolean
    createdAt?: boolean
  }


  export type $PhotoViewEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PhotoViewEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number | null
      anonymousId: string | null
      photoId: number
      createdAt: Date
    }, ExtArgs["result"]["photoViewEvent"]>
    composites: {}
  }

  type PhotoViewEventGetPayload<S extends boolean | null | undefined | PhotoViewEventDefaultArgs> = $Result.GetResult<Prisma.$PhotoViewEventPayload, S>

  type PhotoViewEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PhotoViewEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PhotoViewEventCountAggregateInputType | true
    }

  export interface PhotoViewEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PhotoViewEvent'], meta: { name: 'PhotoViewEvent' } }
    /**
     * Find zero or one PhotoViewEvent that matches the filter.
     * @param {PhotoViewEventFindUniqueArgs} args - Arguments to find a PhotoViewEvent
     * @example
     * // Get one PhotoViewEvent
     * const photoViewEvent = await prisma.photoViewEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PhotoViewEventFindUniqueArgs>(args: SelectSubset<T, PhotoViewEventFindUniqueArgs<ExtArgs>>): Prisma__PhotoViewEventClient<$Result.GetResult<Prisma.$PhotoViewEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PhotoViewEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PhotoViewEventFindUniqueOrThrowArgs} args - Arguments to find a PhotoViewEvent
     * @example
     * // Get one PhotoViewEvent
     * const photoViewEvent = await prisma.photoViewEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PhotoViewEventFindUniqueOrThrowArgs>(args: SelectSubset<T, PhotoViewEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PhotoViewEventClient<$Result.GetResult<Prisma.$PhotoViewEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PhotoViewEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoViewEventFindFirstArgs} args - Arguments to find a PhotoViewEvent
     * @example
     * // Get one PhotoViewEvent
     * const photoViewEvent = await prisma.photoViewEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PhotoViewEventFindFirstArgs>(args?: SelectSubset<T, PhotoViewEventFindFirstArgs<ExtArgs>>): Prisma__PhotoViewEventClient<$Result.GetResult<Prisma.$PhotoViewEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PhotoViewEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoViewEventFindFirstOrThrowArgs} args - Arguments to find a PhotoViewEvent
     * @example
     * // Get one PhotoViewEvent
     * const photoViewEvent = await prisma.photoViewEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PhotoViewEventFindFirstOrThrowArgs>(args?: SelectSubset<T, PhotoViewEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__PhotoViewEventClient<$Result.GetResult<Prisma.$PhotoViewEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PhotoViewEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoViewEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PhotoViewEvents
     * const photoViewEvents = await prisma.photoViewEvent.findMany()
     * 
     * // Get first 10 PhotoViewEvents
     * const photoViewEvents = await prisma.photoViewEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const photoViewEventWithIdOnly = await prisma.photoViewEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PhotoViewEventFindManyArgs>(args?: SelectSubset<T, PhotoViewEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoViewEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PhotoViewEvent.
     * @param {PhotoViewEventCreateArgs} args - Arguments to create a PhotoViewEvent.
     * @example
     * // Create one PhotoViewEvent
     * const PhotoViewEvent = await prisma.photoViewEvent.create({
     *   data: {
     *     // ... data to create a PhotoViewEvent
     *   }
     * })
     * 
     */
    create<T extends PhotoViewEventCreateArgs>(args: SelectSubset<T, PhotoViewEventCreateArgs<ExtArgs>>): Prisma__PhotoViewEventClient<$Result.GetResult<Prisma.$PhotoViewEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PhotoViewEvents.
     * @param {PhotoViewEventCreateManyArgs} args - Arguments to create many PhotoViewEvents.
     * @example
     * // Create many PhotoViewEvents
     * const photoViewEvent = await prisma.photoViewEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PhotoViewEventCreateManyArgs>(args?: SelectSubset<T, PhotoViewEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PhotoViewEvent.
     * @param {PhotoViewEventDeleteArgs} args - Arguments to delete one PhotoViewEvent.
     * @example
     * // Delete one PhotoViewEvent
     * const PhotoViewEvent = await prisma.photoViewEvent.delete({
     *   where: {
     *     // ... filter to delete one PhotoViewEvent
     *   }
     * })
     * 
     */
    delete<T extends PhotoViewEventDeleteArgs>(args: SelectSubset<T, PhotoViewEventDeleteArgs<ExtArgs>>): Prisma__PhotoViewEventClient<$Result.GetResult<Prisma.$PhotoViewEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PhotoViewEvent.
     * @param {PhotoViewEventUpdateArgs} args - Arguments to update one PhotoViewEvent.
     * @example
     * // Update one PhotoViewEvent
     * const photoViewEvent = await prisma.photoViewEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PhotoViewEventUpdateArgs>(args: SelectSubset<T, PhotoViewEventUpdateArgs<ExtArgs>>): Prisma__PhotoViewEventClient<$Result.GetResult<Prisma.$PhotoViewEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PhotoViewEvents.
     * @param {PhotoViewEventDeleteManyArgs} args - Arguments to filter PhotoViewEvents to delete.
     * @example
     * // Delete a few PhotoViewEvents
     * const { count } = await prisma.photoViewEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PhotoViewEventDeleteManyArgs>(args?: SelectSubset<T, PhotoViewEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PhotoViewEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoViewEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PhotoViewEvents
     * const photoViewEvent = await prisma.photoViewEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PhotoViewEventUpdateManyArgs>(args: SelectSubset<T, PhotoViewEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PhotoViewEvent.
     * @param {PhotoViewEventUpsertArgs} args - Arguments to update or create a PhotoViewEvent.
     * @example
     * // Update or create a PhotoViewEvent
     * const photoViewEvent = await prisma.photoViewEvent.upsert({
     *   create: {
     *     // ... data to create a PhotoViewEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PhotoViewEvent we want to update
     *   }
     * })
     */
    upsert<T extends PhotoViewEventUpsertArgs>(args: SelectSubset<T, PhotoViewEventUpsertArgs<ExtArgs>>): Prisma__PhotoViewEventClient<$Result.GetResult<Prisma.$PhotoViewEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PhotoViewEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoViewEventCountArgs} args - Arguments to filter PhotoViewEvents to count.
     * @example
     * // Count the number of PhotoViewEvents
     * const count = await prisma.photoViewEvent.count({
     *   where: {
     *     // ... the filter for the PhotoViewEvents we want to count
     *   }
     * })
    **/
    count<T extends PhotoViewEventCountArgs>(
      args?: Subset<T, PhotoViewEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhotoViewEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PhotoViewEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoViewEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PhotoViewEventAggregateArgs>(args: Subset<T, PhotoViewEventAggregateArgs>): Prisma.PrismaPromise<GetPhotoViewEventAggregateType<T>>

    /**
     * Group by PhotoViewEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoViewEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PhotoViewEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhotoViewEventGroupByArgs['orderBy'] }
        : { orderBy?: PhotoViewEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PhotoViewEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhotoViewEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PhotoViewEvent model
   */
  readonly fields: PhotoViewEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PhotoViewEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PhotoViewEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PhotoViewEvent model
   */ 
  interface PhotoViewEventFieldRefs {
    readonly id: FieldRef<"PhotoViewEvent", 'Int'>
    readonly userId: FieldRef<"PhotoViewEvent", 'Int'>
    readonly anonymousId: FieldRef<"PhotoViewEvent", 'String'>
    readonly photoId: FieldRef<"PhotoViewEvent", 'Int'>
    readonly createdAt: FieldRef<"PhotoViewEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PhotoViewEvent findUnique
   */
  export type PhotoViewEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoViewEvent
     */
    select?: PhotoViewEventSelect<ExtArgs> | null
    /**
     * Filter, which PhotoViewEvent to fetch.
     */
    where: PhotoViewEventWhereUniqueInput
  }

  /**
   * PhotoViewEvent findUniqueOrThrow
   */
  export type PhotoViewEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoViewEvent
     */
    select?: PhotoViewEventSelect<ExtArgs> | null
    /**
     * Filter, which PhotoViewEvent to fetch.
     */
    where: PhotoViewEventWhereUniqueInput
  }

  /**
   * PhotoViewEvent findFirst
   */
  export type PhotoViewEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoViewEvent
     */
    select?: PhotoViewEventSelect<ExtArgs> | null
    /**
     * Filter, which PhotoViewEvent to fetch.
     */
    where?: PhotoViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhotoViewEvents to fetch.
     */
    orderBy?: PhotoViewEventOrderByWithRelationInput | PhotoViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PhotoViewEvents.
     */
    cursor?: PhotoViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhotoViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhotoViewEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PhotoViewEvents.
     */
    distinct?: PhotoViewEventScalarFieldEnum | PhotoViewEventScalarFieldEnum[]
  }

  /**
   * PhotoViewEvent findFirstOrThrow
   */
  export type PhotoViewEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoViewEvent
     */
    select?: PhotoViewEventSelect<ExtArgs> | null
    /**
     * Filter, which PhotoViewEvent to fetch.
     */
    where?: PhotoViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhotoViewEvents to fetch.
     */
    orderBy?: PhotoViewEventOrderByWithRelationInput | PhotoViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PhotoViewEvents.
     */
    cursor?: PhotoViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhotoViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhotoViewEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PhotoViewEvents.
     */
    distinct?: PhotoViewEventScalarFieldEnum | PhotoViewEventScalarFieldEnum[]
  }

  /**
   * PhotoViewEvent findMany
   */
  export type PhotoViewEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoViewEvent
     */
    select?: PhotoViewEventSelect<ExtArgs> | null
    /**
     * Filter, which PhotoViewEvents to fetch.
     */
    where?: PhotoViewEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhotoViewEvents to fetch.
     */
    orderBy?: PhotoViewEventOrderByWithRelationInput | PhotoViewEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PhotoViewEvents.
     */
    cursor?: PhotoViewEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhotoViewEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhotoViewEvents.
     */
    skip?: number
    distinct?: PhotoViewEventScalarFieldEnum | PhotoViewEventScalarFieldEnum[]
  }

  /**
   * PhotoViewEvent create
   */
  export type PhotoViewEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoViewEvent
     */
    select?: PhotoViewEventSelect<ExtArgs> | null
    /**
     * The data needed to create a PhotoViewEvent.
     */
    data: XOR<PhotoViewEventCreateInput, PhotoViewEventUncheckedCreateInput>
  }

  /**
   * PhotoViewEvent createMany
   */
  export type PhotoViewEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PhotoViewEvents.
     */
    data: PhotoViewEventCreateManyInput | PhotoViewEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PhotoViewEvent update
   */
  export type PhotoViewEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoViewEvent
     */
    select?: PhotoViewEventSelect<ExtArgs> | null
    /**
     * The data needed to update a PhotoViewEvent.
     */
    data: XOR<PhotoViewEventUpdateInput, PhotoViewEventUncheckedUpdateInput>
    /**
     * Choose, which PhotoViewEvent to update.
     */
    where: PhotoViewEventWhereUniqueInput
  }

  /**
   * PhotoViewEvent updateMany
   */
  export type PhotoViewEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PhotoViewEvents.
     */
    data: XOR<PhotoViewEventUpdateManyMutationInput, PhotoViewEventUncheckedUpdateManyInput>
    /**
     * Filter which PhotoViewEvents to update
     */
    where?: PhotoViewEventWhereInput
  }

  /**
   * PhotoViewEvent upsert
   */
  export type PhotoViewEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoViewEvent
     */
    select?: PhotoViewEventSelect<ExtArgs> | null
    /**
     * The filter to search for the PhotoViewEvent to update in case it exists.
     */
    where: PhotoViewEventWhereUniqueInput
    /**
     * In case the PhotoViewEvent found by the `where` argument doesn't exist, create a new PhotoViewEvent with this data.
     */
    create: XOR<PhotoViewEventCreateInput, PhotoViewEventUncheckedCreateInput>
    /**
     * In case the PhotoViewEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PhotoViewEventUpdateInput, PhotoViewEventUncheckedUpdateInput>
  }

  /**
   * PhotoViewEvent delete
   */
  export type PhotoViewEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoViewEvent
     */
    select?: PhotoViewEventSelect<ExtArgs> | null
    /**
     * Filter which PhotoViewEvent to delete.
     */
    where: PhotoViewEventWhereUniqueInput
  }

  /**
   * PhotoViewEvent deleteMany
   */
  export type PhotoViewEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PhotoViewEvents to delete
     */
    where?: PhotoViewEventWhereInput
  }

  /**
   * PhotoViewEvent without action
   */
  export type PhotoViewEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoViewEvent
     */
    select?: PhotoViewEventSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProfileViewEventScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    anonymousId: 'anonymousId',
    profileUserId: 'profileUserId',
    createdAt: 'createdAt'
  };

  export type ProfileViewEventScalarFieldEnum = (typeof ProfileViewEventScalarFieldEnum)[keyof typeof ProfileViewEventScalarFieldEnum]


  export const AlbumViewEventScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    anonymousId: 'anonymousId',
    albumId: 'albumId',
    createdAt: 'createdAt'
  };

  export type AlbumViewEventScalarFieldEnum = (typeof AlbumViewEventScalarFieldEnum)[keyof typeof AlbumViewEventScalarFieldEnum]


  export const PhotoViewEventScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    anonymousId: 'anonymousId',
    photoId: 'photoId',
    createdAt: 'createdAt'
  };

  export type PhotoViewEventScalarFieldEnum = (typeof PhotoViewEventScalarFieldEnum)[keyof typeof PhotoViewEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const ProfileViewEventOrderByRelevanceFieldEnum: {
    anonymousId: 'anonymousId'
  };

  export type ProfileViewEventOrderByRelevanceFieldEnum = (typeof ProfileViewEventOrderByRelevanceFieldEnum)[keyof typeof ProfileViewEventOrderByRelevanceFieldEnum]


  export const AlbumViewEventOrderByRelevanceFieldEnum: {
    anonymousId: 'anonymousId'
  };

  export type AlbumViewEventOrderByRelevanceFieldEnum = (typeof AlbumViewEventOrderByRelevanceFieldEnum)[keyof typeof AlbumViewEventOrderByRelevanceFieldEnum]


  export const PhotoViewEventOrderByRelevanceFieldEnum: {
    anonymousId: 'anonymousId'
  };

  export type PhotoViewEventOrderByRelevanceFieldEnum = (typeof PhotoViewEventOrderByRelevanceFieldEnum)[keyof typeof PhotoViewEventOrderByRelevanceFieldEnum]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type ProfileViewEventWhereInput = {
    AND?: ProfileViewEventWhereInput | ProfileViewEventWhereInput[]
    OR?: ProfileViewEventWhereInput[]
    NOT?: ProfileViewEventWhereInput | ProfileViewEventWhereInput[]
    id?: IntFilter<"ProfileViewEvent"> | number
    userId?: IntNullableFilter<"ProfileViewEvent"> | number | null
    anonymousId?: StringNullableFilter<"ProfileViewEvent"> | string | null
    profileUserId?: IntFilter<"ProfileViewEvent"> | number
    createdAt?: DateTimeFilter<"ProfileViewEvent"> | Date | string
  }

  export type ProfileViewEventOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    anonymousId?: SortOrderInput | SortOrder
    profileUserId?: SortOrder
    createdAt?: SortOrder
    _relevance?: ProfileViewEventOrderByRelevanceInput
  }

  export type ProfileViewEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ProfileViewEventWhereInput | ProfileViewEventWhereInput[]
    OR?: ProfileViewEventWhereInput[]
    NOT?: ProfileViewEventWhereInput | ProfileViewEventWhereInput[]
    userId?: IntNullableFilter<"ProfileViewEvent"> | number | null
    anonymousId?: StringNullableFilter<"ProfileViewEvent"> | string | null
    profileUserId?: IntFilter<"ProfileViewEvent"> | number
    createdAt?: DateTimeFilter<"ProfileViewEvent"> | Date | string
  }, "id">

  export type ProfileViewEventOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    anonymousId?: SortOrderInput | SortOrder
    profileUserId?: SortOrder
    createdAt?: SortOrder
    _count?: ProfileViewEventCountOrderByAggregateInput
    _avg?: ProfileViewEventAvgOrderByAggregateInput
    _max?: ProfileViewEventMaxOrderByAggregateInput
    _min?: ProfileViewEventMinOrderByAggregateInput
    _sum?: ProfileViewEventSumOrderByAggregateInput
  }

  export type ProfileViewEventScalarWhereWithAggregatesInput = {
    AND?: ProfileViewEventScalarWhereWithAggregatesInput | ProfileViewEventScalarWhereWithAggregatesInput[]
    OR?: ProfileViewEventScalarWhereWithAggregatesInput[]
    NOT?: ProfileViewEventScalarWhereWithAggregatesInput | ProfileViewEventScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ProfileViewEvent"> | number
    userId?: IntNullableWithAggregatesFilter<"ProfileViewEvent"> | number | null
    anonymousId?: StringNullableWithAggregatesFilter<"ProfileViewEvent"> | string | null
    profileUserId?: IntWithAggregatesFilter<"ProfileViewEvent"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ProfileViewEvent"> | Date | string
  }

  export type AlbumViewEventWhereInput = {
    AND?: AlbumViewEventWhereInput | AlbumViewEventWhereInput[]
    OR?: AlbumViewEventWhereInput[]
    NOT?: AlbumViewEventWhereInput | AlbumViewEventWhereInput[]
    id?: IntFilter<"AlbumViewEvent"> | number
    userId?: IntNullableFilter<"AlbumViewEvent"> | number | null
    anonymousId?: StringNullableFilter<"AlbumViewEvent"> | string | null
    albumId?: IntFilter<"AlbumViewEvent"> | number
    createdAt?: DateTimeFilter<"AlbumViewEvent"> | Date | string
  }

  export type AlbumViewEventOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    anonymousId?: SortOrderInput | SortOrder
    albumId?: SortOrder
    createdAt?: SortOrder
    _relevance?: AlbumViewEventOrderByRelevanceInput
  }

  export type AlbumViewEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AlbumViewEventWhereInput | AlbumViewEventWhereInput[]
    OR?: AlbumViewEventWhereInput[]
    NOT?: AlbumViewEventWhereInput | AlbumViewEventWhereInput[]
    userId?: IntNullableFilter<"AlbumViewEvent"> | number | null
    anonymousId?: StringNullableFilter<"AlbumViewEvent"> | string | null
    albumId?: IntFilter<"AlbumViewEvent"> | number
    createdAt?: DateTimeFilter<"AlbumViewEvent"> | Date | string
  }, "id">

  export type AlbumViewEventOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    anonymousId?: SortOrderInput | SortOrder
    albumId?: SortOrder
    createdAt?: SortOrder
    _count?: AlbumViewEventCountOrderByAggregateInput
    _avg?: AlbumViewEventAvgOrderByAggregateInput
    _max?: AlbumViewEventMaxOrderByAggregateInput
    _min?: AlbumViewEventMinOrderByAggregateInput
    _sum?: AlbumViewEventSumOrderByAggregateInput
  }

  export type AlbumViewEventScalarWhereWithAggregatesInput = {
    AND?: AlbumViewEventScalarWhereWithAggregatesInput | AlbumViewEventScalarWhereWithAggregatesInput[]
    OR?: AlbumViewEventScalarWhereWithAggregatesInput[]
    NOT?: AlbumViewEventScalarWhereWithAggregatesInput | AlbumViewEventScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AlbumViewEvent"> | number
    userId?: IntNullableWithAggregatesFilter<"AlbumViewEvent"> | number | null
    anonymousId?: StringNullableWithAggregatesFilter<"AlbumViewEvent"> | string | null
    albumId?: IntWithAggregatesFilter<"AlbumViewEvent"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AlbumViewEvent"> | Date | string
  }

  export type PhotoViewEventWhereInput = {
    AND?: PhotoViewEventWhereInput | PhotoViewEventWhereInput[]
    OR?: PhotoViewEventWhereInput[]
    NOT?: PhotoViewEventWhereInput | PhotoViewEventWhereInput[]
    id?: IntFilter<"PhotoViewEvent"> | number
    userId?: IntNullableFilter<"PhotoViewEvent"> | number | null
    anonymousId?: StringNullableFilter<"PhotoViewEvent"> | string | null
    photoId?: IntFilter<"PhotoViewEvent"> | number
    createdAt?: DateTimeFilter<"PhotoViewEvent"> | Date | string
  }

  export type PhotoViewEventOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    anonymousId?: SortOrderInput | SortOrder
    photoId?: SortOrder
    createdAt?: SortOrder
    _relevance?: PhotoViewEventOrderByRelevanceInput
  }

  export type PhotoViewEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PhotoViewEventWhereInput | PhotoViewEventWhereInput[]
    OR?: PhotoViewEventWhereInput[]
    NOT?: PhotoViewEventWhereInput | PhotoViewEventWhereInput[]
    userId?: IntNullableFilter<"PhotoViewEvent"> | number | null
    anonymousId?: StringNullableFilter<"PhotoViewEvent"> | string | null
    photoId?: IntFilter<"PhotoViewEvent"> | number
    createdAt?: DateTimeFilter<"PhotoViewEvent"> | Date | string
  }, "id">

  export type PhotoViewEventOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    anonymousId?: SortOrderInput | SortOrder
    photoId?: SortOrder
    createdAt?: SortOrder
    _count?: PhotoViewEventCountOrderByAggregateInput
    _avg?: PhotoViewEventAvgOrderByAggregateInput
    _max?: PhotoViewEventMaxOrderByAggregateInput
    _min?: PhotoViewEventMinOrderByAggregateInput
    _sum?: PhotoViewEventSumOrderByAggregateInput
  }

  export type PhotoViewEventScalarWhereWithAggregatesInput = {
    AND?: PhotoViewEventScalarWhereWithAggregatesInput | PhotoViewEventScalarWhereWithAggregatesInput[]
    OR?: PhotoViewEventScalarWhereWithAggregatesInput[]
    NOT?: PhotoViewEventScalarWhereWithAggregatesInput | PhotoViewEventScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PhotoViewEvent"> | number
    userId?: IntNullableWithAggregatesFilter<"PhotoViewEvent"> | number | null
    anonymousId?: StringNullableWithAggregatesFilter<"PhotoViewEvent"> | string | null
    photoId?: IntWithAggregatesFilter<"PhotoViewEvent"> | number
    createdAt?: DateTimeWithAggregatesFilter<"PhotoViewEvent"> | Date | string
  }

  export type ProfileViewEventCreateInput = {
    userId?: number | null
    anonymousId?: string | null
    profileUserId: number
    createdAt?: Date | string
  }

  export type ProfileViewEventUncheckedCreateInput = {
    id?: number
    userId?: number | null
    anonymousId?: string | null
    profileUserId: number
    createdAt?: Date | string
  }

  export type ProfileViewEventUpdateInput = {
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    profileUserId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileViewEventUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    profileUserId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileViewEventCreateManyInput = {
    id?: number
    userId?: number | null
    anonymousId?: string | null
    profileUserId: number
    createdAt?: Date | string
  }

  export type ProfileViewEventUpdateManyMutationInput = {
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    profileUserId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileViewEventUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    profileUserId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumViewEventCreateInput = {
    userId?: number | null
    anonymousId?: string | null
    albumId: number
    createdAt?: Date | string
  }

  export type AlbumViewEventUncheckedCreateInput = {
    id?: number
    userId?: number | null
    anonymousId?: string | null
    albumId: number
    createdAt?: Date | string
  }

  export type AlbumViewEventUpdateInput = {
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    albumId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumViewEventUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    albumId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumViewEventCreateManyInput = {
    id?: number
    userId?: number | null
    anonymousId?: string | null
    albumId: number
    createdAt?: Date | string
  }

  export type AlbumViewEventUpdateManyMutationInput = {
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    albumId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumViewEventUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    albumId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoViewEventCreateInput = {
    userId?: number | null
    anonymousId?: string | null
    photoId: number
    createdAt?: Date | string
  }

  export type PhotoViewEventUncheckedCreateInput = {
    id?: number
    userId?: number | null
    anonymousId?: string | null
    photoId: number
    createdAt?: Date | string
  }

  export type PhotoViewEventUpdateInput = {
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    photoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoViewEventUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    photoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoViewEventCreateManyInput = {
    id?: number
    userId?: number | null
    anonymousId?: string | null
    photoId: number
    createdAt?: Date | string
  }

  export type PhotoViewEventUpdateManyMutationInput = {
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    photoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoViewEventUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    anonymousId?: NullableStringFieldUpdateOperationsInput | string | null
    photoId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProfileViewEventOrderByRelevanceInput = {
    fields: ProfileViewEventOrderByRelevanceFieldEnum | ProfileViewEventOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProfileViewEventCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    anonymousId?: SortOrder
    profileUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProfileViewEventAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    profileUserId?: SortOrder
  }

  export type ProfileViewEventMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    anonymousId?: SortOrder
    profileUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProfileViewEventMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    anonymousId?: SortOrder
    profileUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProfileViewEventSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    profileUserId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type AlbumViewEventOrderByRelevanceInput = {
    fields: AlbumViewEventOrderByRelevanceFieldEnum | AlbumViewEventOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AlbumViewEventCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    anonymousId?: SortOrder
    albumId?: SortOrder
    createdAt?: SortOrder
  }

  export type AlbumViewEventAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    albumId?: SortOrder
  }

  export type AlbumViewEventMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    anonymousId?: SortOrder
    albumId?: SortOrder
    createdAt?: SortOrder
  }

  export type AlbumViewEventMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    anonymousId?: SortOrder
    albumId?: SortOrder
    createdAt?: SortOrder
  }

  export type AlbumViewEventSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    albumId?: SortOrder
  }

  export type PhotoViewEventOrderByRelevanceInput = {
    fields: PhotoViewEventOrderByRelevanceFieldEnum | PhotoViewEventOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PhotoViewEventCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    anonymousId?: SortOrder
    photoId?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoViewEventAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrder
  }

  export type PhotoViewEventMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    anonymousId?: SortOrder
    photoId?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoViewEventMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    anonymousId?: SortOrder
    photoId?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoViewEventSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrder
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}