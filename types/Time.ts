type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type YYYY = `202${zeroToNine}`
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`
type DD = `${0}${oneToNine}` | `${1 | 2}${zeroToNine}` | `3${0 | 1}`
type hours = `0${zeroToNine}` | `1${zeroToNine}` | `2${0 | 1 | 2 | 3 | 4}`
type minutes =
  | `0${zeroToNine}`
  | `1${zeroToNine}`
  | `2${zeroToNine}`
  | `3${zeroToNine}`
  | `4${zeroToNine}`
  | `5${zeroToNine}`
type seconds =
  | `0${zeroToNine}`
  | `1${zeroToNine}`
  | `2${zeroToNine}`
  | `3${zeroToNine}`
  | `4${zeroToNine}`
  | `5${zeroToNine}`

export type TimeStamp = `${YYYY}${MM}${DD} ${hours}${minutes}${seconds}`
