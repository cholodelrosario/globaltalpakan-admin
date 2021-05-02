/*
export function someMutation (state) {
}
*/
export function setSelectedGame (state,payload) {
    state.selectedGameData = payload
}

export function unsetSelectedGame (state,payload) {
    state.selectedGameData = null
}