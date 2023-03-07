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

export const toDateTimeFormat = (date: Date): string => {
  return moment(date).format('hh:mm A - MMM DD YYYY')
}

export const toDateFormat = (date: Date): string => {
  return moment(date).format('MMMM DD YYYY')
}

export const dateDiffToSecond = (dateStarted: Date): number => {
  return moment(new Date()).diff(moment(new Date(dateStarted)), 'seconds')
}

export const dateAddDay = (dateValue: Date, interval: number = 1): Date => {
  return moment(dateValue).add(interval, 'days').toDate()
}

export const dateSubDay = (dateValue: Date, interval: number = 1): Date => {
  return moment(dateValue).subtract(interval, 'days').toDate()
}

export const dateEqual = (date1: Date, date2: Date): boolean => {
  return moment(date1).isSame(date2, 'dates')
}
