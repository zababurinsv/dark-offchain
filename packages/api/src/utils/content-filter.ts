import { CommonContent } from '@darkpay/dark-types'
import { ContentFilter } from './types'
import { isEmptyObj, notDef } from '@darkpay/dark-utils'

type HasContent = {
  content?: CommonContent
}

type Props<T> = ContentFilter & {
  structs: T[],
}

export const isEmptyIpfsContent = (struct?: HasContent) => notDef(struct) || isEmptyObj(struct.content)

export const notEmptyIpfsContent = (struct?: HasContent) => !isEmptyIpfsContent(struct)

export function contentFilter<T extends HasContent> ({ structs, withContentOnly }: Props<T>): T[] {

  if (withContentOnly) {
    return structs.filter(notEmptyIpfsContent)
  }

  return structs
}
