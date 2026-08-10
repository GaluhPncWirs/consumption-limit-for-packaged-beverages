import type { CollectionReference, Query } from "firebase/firestore";

export interface SearchConfig {
  keyword?: string;
  field: string;
  transform?: (keyword: string) => string;
}

export interface SearchDataParams {
  collectionRef: CollectionReference;
  search?: SearchConfig;
}

export function searchData({ collectionRef, search }: SearchDataParams): Query {
  let query: any = collectionRef;

  // ===========================
  // Search
  // ===========================

  const keyword = search?.keyword?.trim();

  if (search && keyword) {
    const transform =
      search.transform ?? ((keyword: string) => keyword.toLowerCase());

    const searchValue = transform(keyword);

    query = query
      .orderBy(search.field)
      .startAt(searchValue)
      .endAt(`${searchValue}\uf8ff`);
  }

  return query as Query;
}
