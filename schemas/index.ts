import srs from './search.json';
import lus from './list.json';
import c from './custom.json';
import cu from './custom_update.json';
import cr from './create_review.json';

export const SearchResultSchema = srs;
export * from './interfaces';
export const ListUpdateSchema = lus;
export const CustomGameSchema = c;
export const CustomGameUpdateSchema = cu;
export const CreateReviewSchema = cr;
