/** @format */

export type device = {
  id: string
  model: string
  brand: brand
  pricePerHour: number
  deleted: boolean | null
}

export type brand = {
  id: number
  name: string
  image: string
}

export type user = {
  id: string
  coins: number
  seconds: number
  name: string
}

export type rent = {
  device: device
  user: user
  dateAdded: Date | null
  id: string
  status: 'started' | 'stopped' | 'paused'
}
