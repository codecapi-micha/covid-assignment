export const getStartOfDayUTC = (originalDate) => {
  const date = new Date(originalDate.valueOf())
  date.setUTCHours(0)
  date.setUTCMinutes(0)
  date.setUTCSeconds(0)
  date.setUTCMilliseconds(0)
  return date
}

export const getISODateTimeString = (date) => {
  return date.toISOString().replace(/\.[0-9]{3}/, '')
}
