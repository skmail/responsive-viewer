import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { DrawingTool, Element, Page, ImageElement } from '../types/draw'

export type State = {
  open: boolean
  pageIds: string[]
  pages: Record<string, Page>
  elements: Record<string, Element>
  drawingTool?: DrawingTool
  pageId: string
  elementId: string
  latestStyles: Partial<Element>
  pan: boolean
}

const initialState: State = {
  open: false,
  pageIds: [],
  pages: {},
  elements: {},
  elementId: '',
  pageId: '',
  drawingTool: undefined,
  latestStyles: {},
  pan: false,
}

export const slice = createSlice({
  name: 'draw',
  initialState,
  reducers: {
    setDrawingTool(state, action: PayloadAction<DrawingTool>) {
      state.drawingTool = action.payload
      state.pan = false
    },

    addElement(state, action: PayloadAction<Element>) {
      state.elements[action.payload.id] = action.payload
      state.pages[state.pageId].elements.push(action.payload.id)
      state.elementId = action.payload.id
      state.drawingTool = undefined
    },

    updateElement<T extends Element>(
      state: State,
      action: PayloadAction<{
        id: string
        props: Exclude<Partial<T>, 'id' | 'type'>
      }>
    ) {
      state.elements[action.payload.id] = {
        ...state.elements[action.payload.id],
        ...action.payload.props,
      }

      state.latestStyles = {
        ...state.latestStyles,
        ...action.payload.props,
      }
    },

    setSelectedElement(state, action: PayloadAction<string>) {
      if (state.elements[action.payload].locked) {
        state.elementId = ''
      } else {
        state.elementId = action.payload
      }
    },

    removeElement(state, action: PayloadAction<string>) {
      if (state.elementId === action.payload) {
        state.elementId = ''
      }
      state.pages[state.pageId].elements = state.pages[
        state.pageId
      ].elements.filter(id => id !== action.payload)
    },

    openDraw(state) {
      state.open = true
    },

    setDrawData(
      state,
      action: PayloadAction<{
        pageIds: string[]
        pages: Record<string, Page>
        elements: Record<string, Element>
      }>
    ) {
      state.pageIds = action.payload.pageIds
      state.pages = action.payload.pages
      state.elements = action.payload.elements
      state.pageId = state.pageIds[0]
    },
    closeDraw(state) {
      state.open = false
      state.elementId = ''
      state.pageId = ''
    },
    nextPage(state) {
      const pages = state.pageIds
      const index = pages.findIndex(id => id === state.pageId)
      if (index < pages.length - 1) {
        state.pageId = state.pageIds[index + 1]
        state.elementId = ''
      }
    },
    previousPage(state) {
      const pages = state.pageIds
      const index = pages.findIndex(id => id === state.pageId)
      if (index > 0) {
        state.pageId = state.pageIds[index - 1]
        state.elementId = ''
      }
    },
    togglePan(state) {
      state.pan = !state.pan
      state.drawingTool = undefined
    },
  },
})

export const {
  setDrawingTool,
  addElement,
  updateElement,
  setSelectedElement,
  removeElement,
  openDraw,
  closeDraw,
  setDrawData,
  nextPage,
  previousPage,
  togglePan,
} = slice.actions

export const select = (state: RootState) => state.draw

export const selectDrawingTool = (state: RootState) => select(state).drawingTool

export const selectSelectedElement = (state: RootState) =>
  select(state).elements[select(state).elementId]

export const selectDefaultImages = (state: RootState) => {
  return select(state).pageIds.map(id => {
    const page = select(state).pages[id]

    return {
      name: page.name,
      url: (select(state).elements[page.elements[0]] as ImageElement).src,
    }
  })
}

export const selectSelectedPage = (state: RootState) =>
  select(state).pages[select(state).pageId]

export const selectSelectedPageId = (state: RootState) => select(state).pageId

export const selectPageElementIds = (state: RootState) =>
  select(state).pages[selectSelectedPageId(state)]?.elements || []

export const selectElementById = (state: RootState, id: string) =>
  select(state).elements[id]

export const selectSelectedElementId = (state: RootState) =>
  select(state).elementId

export const selectLatestStyles = (state: RootState) =>
  select(state).latestStyles

export const selectIsDrawOpen = (state: RootState) => select(state).open
export const selectPan = (state: RootState) => select(state).pan

export const selectHasNextPage = (state: RootState) => {
  const pages = select(state).pageIds
  const selectedPageId = selectSelectedPageId(state)
  const index = pages.findIndex(id => id === selectedPageId)
  return index < pages.length - 1
}
export const selectHasPreviousPage = (state: RootState) => {
  const pages = select(state).pageIds
  const selectedPageId = selectSelectedPageId(state)
  const index = pages.findIndex(id => id === selectedPageId)
  return index > 0
}

export default slice.reducer
