/** @format */

export type brand = {
  id: number
  name: string
  image: string
}

const brands: brand[] = [
  { id: 0, name: 'Samsung', image: require('../assets/samsung.png') },
  { id: 1, name: 'Vivo', image: require('../assets/vivo.png') },
  { id: 2, name: 'Xiaomi', image: require('../assets/xiaomi.png') },
  { id: 3, name: 'Huawei', image: require('../assets/huawei.png') },
  { id: 4, name: 'Realme', image: require('../assets/realme.png') },
  { id: 5, name: 'Oppo', image: require('../assets/oppo.png') },
]

export default brands
