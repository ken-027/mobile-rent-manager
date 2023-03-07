/** @format */

const coinToSeconds = (rentPerHour: number, coins: number) => {
  const secondsInHour = 3600 / rentPerHour
  return coins * secondsInHour
}

export default coinToSeconds
