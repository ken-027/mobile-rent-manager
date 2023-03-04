/** @format */

import moment from 'moment'

export const toSeconds = (seconds: number | undefined): string => {
  return typeof seconds === 'undefined'
    ? ''
    : moment.utc(seconds * 1000).format('ss')
}

export const toHour = (seconds: number | undefined): string => {
  return typeof seconds === 'undefined'
    ? ''
    : moment.utc(seconds * 1000).format('HH:mm')
}

export const toDateFormat = (date: Date): string => {
  return moment(date).format('hh:mm A - MMM DD YYYY')
}
