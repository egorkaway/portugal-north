export const HOME_STATIONS_PAGE_SIZE = 30;

export type PaginatedResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  rangeFrom: number;
  rangeTo: number;
  total: number;
};

export function paginate<T>(
  items: T[],
  page: number,
  pageSize = HOME_STATIONS_PAGE_SIZE,
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return {
    items: pageItems,
    currentPage,
    totalPages,
    rangeFrom: total === 0 ? 0 : start + 1,
    rangeTo: start + pageItems.length,
    total,
  };
}
