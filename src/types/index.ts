/** @format */

export type device = {
  id: string
  model: string
  brand: number
  pricePerHour: number
  deleted: Date | null
  color: number
  available: boolean
}

export type brand = {
  id: number
  name: string
  image: string
}

export type user = {
  id: string
  name: string
}

export type status = 'started' | 'stopped' | 'paused' | 'removed'

export type rent = {
  device: device | null
  user: user
  dateAdded: Date
  dateUpdated: Date
  id?: string
  seconds: number
  coins: number
  status: status
}

export type log = {
  device: device
  user: user
  dateAdded: Date
  id?: string
  seconds: number
  coins: number
  status: status
}

export type color = {
  id: number
  value: string
  name: string
}

export type returnData = {
  data: unknown
  connection: unknown
}
