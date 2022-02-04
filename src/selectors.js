export const getTabs = state => state.app.tabs

export const getSelectedTab = state => state.app.tab

export const getTab = (state, tabId) =>
  getTabs(state).find(tab => tab.name === tabId)

export const getScreens = state => state.app.screens

export const getScreensByTab = (state, name) => {
  let screens = getScreens(state)

  if (name !== 'default') {
    const tab = getTabs(state).find(tab => tab.name === name)
    screens = tab.screens.map(id => ({
      ...screens.find(screen => screen.id === id),
      visible: true,
    }))
  } else {
    screens = screens.filter(screen => screen.visible)
  }

  return screens
}

export const getSelectedTabIndex = state =>
  getTabs(state).findIndex(tab => tab.name === getSelectedTab(state))

export const getIsTabDialogOpened = state => state.layout.getIsTabDialogOpened

export const getTabDialog = state => state.layout.tabDialog
