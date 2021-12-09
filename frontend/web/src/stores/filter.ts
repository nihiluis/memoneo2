import create from "zustand"
import {
  GOAL_OVERVIEW_CONNECTION,
  SIDEBAR_GOAL_CONNECTION,
} from "../constants/connections"

type FilterMap = { [key: string]: unknown[] }

interface FilterStore {
  filters: FilterMap
  getFilters(key: string): unknown[]
  _unneeded_setFilter(key: string, value: unknown[]): void
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: {
    [SIDEBAR_GOAL_CONNECTION]: [
      {
        order_by: { title: "asc" },
      },
    ],
    [GOAL_OVERVIEW_CONNECTION]: [
      {
        order_by: { created_at: "desc" },
        where: { archived: { _in: [false] } },
      },
      {
        order_by: { created_at: "desc" },
        where: { archived: { _in: [false, true] } },
      },
    ],
  },
  getFilters(key: string): unknown[] {
    const self = get()
    if (!self.filters.hasOwnProperty(key)) {
      return []
    }

    return self.filters[key]
  },
  _unneeded_setFilter(key: string, value: any) {
    const newFilters = { ...get().filters }
    newFilters[key] = value

    set({ filters: newFilters })
  },
}))
