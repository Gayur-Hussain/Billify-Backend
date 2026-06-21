export const validate = (schema) => (req, res, next) => {
  schema.parse({
    body: req.body,
    params: req.params,
    query: req.query
  })
  next()
}
