export function getIdFromNodeId(nodeId: string): string {
  return JSON.parse(atob(nodeId))[3]
}
