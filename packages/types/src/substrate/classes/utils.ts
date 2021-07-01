/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { u64, u32, Null, Option, Text, bool } from '@polkadot/types';
import { nonEmptyStr } from '@darkpay/dark-utils'
import registry from '../registry';
import { SubstrateId } from '../..';

export class OptionId<T extends SubstrateId> extends Option<u64> {
  constructor (value?: T) {
    const textOrNull = value || new Null(registry)
    super(registry, 'u64', textOrNull)
  }
}

export class OptionBool<T extends boolean> extends Option<bool> {
  constructor (value?: T) {
    const boolOrNull = typeof value === 'boolean' ? value : new Null(registry)
    super(registry, 'bool', boolOrNull)
  }
}

type OptionTextType = string | Text | null;

export class OptionText extends Option<Text> {
  constructor (value?: OptionTextType) {
    const textOrNull = nonEmptyStr(value) ? value : new Null(registry)
    super(registry, 'Text', textOrNull)
  }
}

export class OptionOptionText extends Option<Option<Text>> {
  constructor (value?: OptionTextType) {
    super(registry, 'Option<Text>', new OptionText(value))
  }
}

export class OptionPrice<T extends u32> extends Option<u32> {
  constructor (value?: T) {
    const textOrNull = value || new Null(registry)
    super(registry, 'u32', textOrNull)
  }
}


export class OptionIpfsCid extends OptionText {}
