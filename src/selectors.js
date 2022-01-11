export const getTabs = state => state.app.tabs

export const getSelectedTab = state => state.app.tab

export const getTab = (state, tabId) =>
  getTabs(state).find(tab => tab.name === tabId)
export const getScreens = state => state.app.screens

export const getScreensByTab = (state, name) => {
  if (name === 'default') {
    return getScreens(state)
  }
  const tab = getTabs(state).find(tab => tab.name === name)

  const screens = []

  for (let screen of getScreens(state)) {
    if (tab.screens.includes(screen.id)) {
      screens.push({
        ...screen,
        visible: true,
      })
    }
  }

  return screens
}

export const getSelectedTabIndex = state =>
  getTabs(state).findIndex(tab => tab.name === getSelectedTab(state))

export const getIsTabDialogOpened = state => state.layout.getIsTabDialogOpened

export const getTabDialog = state => state.layout.tabDialog
