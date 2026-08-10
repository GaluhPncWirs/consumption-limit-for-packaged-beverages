import {
  endAt,
  orderBy,
  query,
  startAt,
  type CollectionReference,
  type Query,
} from "firebase/firestore";

interface SearchConfig {
  keyword?: string;
  field: string;
  transform?: (keyword: string) => string;
}

interface SearchDataParams {
  collectionRef: CollectionReference;
  search?: SearchConfig;
}

export function searchData({ collectionRef, search }: SearchDataParams): Query {
  const keyword = search?.keyword?.trim();

  if (!search || !keyword) {
    return query(collectionRef);
  }

  const transform =
    search.transform ?? ((keyword: string) => keyword.toLowerCase());

  const searchValue = transform(keyword);

  return query(
    collectionRef,
    orderBy(search.field, "asc"),
    startAt(searchValue),
    endAt(`${searchValue}\uf8ff`),
  );
}
