export function getIdFromNodeId(nodeId: string): string {
  return JSON.parse(window.atob(nodeId))[3]
}
