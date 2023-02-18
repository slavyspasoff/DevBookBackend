interface Q {
  page?: string
  items?: string
}

const getPagination = (q: Q) => {
  let skip = 0
  let limit = 20
  if (q.page) skip = (Number(q.page) - 1) * Number(q.items)
  if (q.items) limit = Number(q.items)

  return { skip, limit }
}

export { getPagination }
