/** @format */

import { useEffect, useState } from 'react'
import Realm from 'realm'

const useFetch = <T>(service: any, dependency: any[] = []) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [connection, setConnection] = useState<Realm>()
  const [data, setData] = useState<T>()

  useEffect(() => {
    const runAsync = async () => {
      setLoading(true)
      const responseData = await service
      setData(responseData.data as T)
      setConnection(responseData.connection)
      setLoading(false)
    }

    runAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependency)

  return { loading, data, connection }
}

export default useFetch
