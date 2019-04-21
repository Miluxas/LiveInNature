export const initialState = { searchString: '' }

export function reducer(state = initialState, action) {
  if (action.type === "SET_SEARCH_STRING") {
      console.log(action)
    return { ...state, searchString: action.searchString }
  }
  return state
}