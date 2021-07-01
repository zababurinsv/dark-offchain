import { PostData, SpaceData, AnyAccountId, ProfileData } from '@subsocial/types/src';
import { FindPostsQuery, FindSpacesQuery } from '../../src/utils/types';
export declare function findPosts({ ids }: FindPostsQuery): Promise<PostData[]>;
export declare function findProfiles(ids: AnyAccountId[]): Promise<ProfileData[]>;
export declare function findSpaces({ ids }: FindSpacesQuery): Promise<SpaceData[]>;
