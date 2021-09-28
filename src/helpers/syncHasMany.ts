/* eslint-disable @typescript-eslint/no-explicit-any */
const syncHasMany = async (sourceRepository: any, relationName: any, sourceId: any) => {
  try {
    const data = await sourceRepository[relationName].find(sourceId)
    return data
  } catch (error) {
    console.error(error)
  }
}

export default syncHasMany
