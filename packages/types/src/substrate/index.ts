import * as InterfaceTypes from './interfaceRegistry';
import definitions from './interfaces/darkdot/definitions';

export { InterfaceTypes };
export const types = definitions.types;
export { types as registryTypes } from './preparedTypes'
export { registerDarkdotTypes } from './register'
export type PalletName = 'ocwModule' | 'permissions' | 'products' | 'orderings'| 'profileFollows' | 'profiles' | 'reactions' | 'roles' | 'scores' | 'storefrontFollows' | 'storefrontOwnership' | 'storefronts' | 'utils'

export * from './interfaces/utils'
export * as classes from './classes'
