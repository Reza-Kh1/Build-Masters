const pagination = (count: number, page: number, limit: number) => {
  const allPage = Math.ceil(count / limit);
  const nextPage = Number(page) + 1;
  const prevPage = Number(page) - 1;
  const pagination: {
    allPage: number;
    nextPage?: number;
    prevPage?: number;
  } = {
    allPage: allPage,
  };
  if (nextPage <= allPage) {
    pagination.nextPage = nextPage;
  }
  if (prevPage > 0) {
    pagination.prevPage = prevPage;
  }
  return pagination;
};
export = pagination;
