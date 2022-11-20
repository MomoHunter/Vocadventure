export let savestate = null
export let appDyn = null
export let appConst = null
export let gameDyn = null
export let gameConst = null

export function initStores (newSavestate, newAppDyn, newAppConst, newGameDyn, newGameConst) {
  savestate = newSavestate
  appDyn = newAppDyn
  appConst = newAppConst
  gameDyn = newGameDyn
  gameConst = newGameConst
}