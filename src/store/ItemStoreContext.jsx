import { createContext, useContext, useState, useCallback } from 'react'
import { menuItems as BASE_ITEMS, categories as BASE_CATS } from '../data/menuData'

const LS_KEY = 'pixelguard_store'

function loadStore() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {} }
  catch { return {} }
}
function saveStore(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

const ItemStoreContext = createContext(null)

export function ItemStoreProvider({ children }) {
  const [store, setStore] = useState(loadStore)

  const persist = useCallback((next) => {
    setStore(next)
    saveStore(next)
  }, [])

  // ── Items ──────────────────────────────────────────────────────
  const allItems = [
    ...BASE_ITEMS,
    ...(store.customItems || []),
  ]
    .filter(item => !(store.deletedIds || []).includes(item.id))
    .map(item => ({
      ...item,
      price:       store.prices?.[item.id]       ?? item.price,
      image:       store.images?.[item.id]       ?? item.image,
      name:        store.names?.[item.id]        ?? item.name,
      description: store.descriptions?.[item.id] ?? item.description,
      badge:       store.badges?.[item.id] !== undefined ? store.badges[item.id] : item.badge,
      details:     store.details?.[item.id]      ?? item.details,
      status:      store.statuses?.[item.id]     ?? 'available',
    }))

  function setItemStatus(id, status) {
    persist({ ...store, statuses: { ...(store.statuses || {}), [id]: status } })
  }

  function updateItem(id, fields) {
    const next = { ...store }
    if (fields.price       !== undefined) next.prices       = { ...(next.prices || {}),       [id]: fields.price }
    if (fields.name        !== undefined) next.names        = { ...(next.names || {}),        [id]: fields.name }
    if (fields.description !== undefined) next.descriptions = { ...(next.descriptions || {}), [id]: fields.description }
    if (fields.image       !== undefined) next.images       = { ...(next.images || {}),       [id]: fields.image }
    if (fields.badge       !== undefined) next.badges       = { ...(next.badges || {}),       [id]: fields.badge }
    if (fields.details     !== undefined) next.details      = { ...(next.details || {}),      [id]: fields.details }
    if (next.customItems) {
      next.customItems = next.customItems.map(ci => ci.id === id ? { ...ci, ...fields } : ci)
    }
    persist(next)
  }

  function addItem(item) {
    const id = `custom_${Date.now()}`
    const newItem = {
      ...item, id, status: 'available',
      details: item.details || { fullDesc: item.description, ingredients: [], calories: 0, prepTime: '—', allergens: [], volume: '—', temp: '—' },
    }
    persist({ ...store, customItems: [...(store.customItems || []), newItem] })
  }

  function deleteItem(id) {
    const next = { ...store }
    if (String(id).startsWith('custom_')) {
      next.customItems = (next.customItems || []).filter(ci => ci.id !== id)
    } else {
      next.deletedIds = [...(next.deletedIds || []), id]
    }
    persist(next)
  }

  // ── Categories ─────────────────────────────────────────────────
  const allCategories = (() => {
    const deleted = store.deletedCategoryIds || []
    const overrides = store.categoryOverrides || {}
    const custom = store.customCategories || []
    const order = store.categoryOrder || null

    const base = BASE_CATS
      .filter(c => !deleted.includes(c.id))
      .map(c => ({ ...c, ...overrides[c.id], isBase: true }))

    const merged = [...base, ...custom.map(c => ({ ...c, isBase: false }))]

    if (order) {
      const indexed = Object.fromEntries(merged.map(c => [c.id, c]))
      const ordered = order.map(id => indexed[id]).filter(Boolean)
      const rest = merged.filter(c => !order.includes(c.id))
      return [...ordered, ...rest]
    }
    return merged
  })()

  function addCategory(cat) {
    const id = `cat_${Date.now()}`
    const newCat = { ...cat, id, isBase: false }
    persist({ ...store, customCategories: [...(store.customCategories || []), newCat] })
  }

  function updateCategory(id, fields) {
    const next = { ...store }
    const isBase = BASE_CATS.some(c => c.id === id)
    if (isBase) {
      next.categoryOverrides = { ...(next.categoryOverrides || {}), [id]: { ...(next.categoryOverrides?.[id] || {}), ...fields } }
    } else {
      next.customCategories = (next.customCategories || []).map(c => c.id === id ? { ...c, ...fields } : c)
    }
    persist(next)
  }

  function deleteCategory(id) {
    const next = { ...store }
    const isBase = BASE_CATS.some(c => c.id === id)
    if (isBase) {
      next.deletedCategoryIds = [...(next.deletedCategoryIds || []), id]
    } else {
      next.customCategories = (next.customCategories || []).filter(c => c.id !== id)
    }
    // remove from order too
    if (next.categoryOrder) next.categoryOrder = next.categoryOrder.filter(oid => oid !== id)
    persist(next)
  }

  function moveCategoryUp(id) {
    const ids = allCategories.map(c => c.id)
    const i = ids.indexOf(id)
    if (i <= 0) return
    const next = [...ids]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    persist({ ...store, categoryOrder: next })
  }

  function moveCategoryDown(id) {
    const ids = allCategories.map(c => c.id)
    const i = ids.indexOf(id)
    if (i === -1 || i >= ids.length - 1) return
    const next = [...ids]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    persist({ ...store, categoryOrder: next })
  }

  function resetStore() { persist({}) }

  return (
    <ItemStoreContext.Provider value={{
      allItems, setItemStatus, updateItem, addItem, deleteItem,
      allCategories, addCategory, updateCategory, deleteCategory, moveCategoryUp, moveCategoryDown,
      resetStore,
    }}>
      {children}
    </ItemStoreContext.Provider>
  )
}

export function useItemStore() {
  return useContext(ItemStoreContext)
}
