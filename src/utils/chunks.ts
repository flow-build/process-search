export function chunkArray<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    return []
  }
  return array.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / size)
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []
    }
    resultArray[chunkIndex].push(item)
    return resultArray
  }, [] as T[][])
}
