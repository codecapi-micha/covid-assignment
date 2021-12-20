export const sortByKey = (key) => {
  return (a, b) => {
    return a[key].toString().localeCompare(b[key].toString())
  }
}
