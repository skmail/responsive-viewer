import queryString from 'query-string'
import devices from './devices'
import * as url from './utils/url'
import tabStorage from './utils/tabStorage'
import frameStorage from './utils/frameStorage'

let state = {}

const isAllowedToAction = tab => {
  if (!tab) {
    return false
  }
  return tabStorage.isExtension(tab.id)
}

let lastOpenedUrl

chrome.browserAction.onClicked.addListener(tab => {
  lastOpenedUrl = tab.url

  const onReady = () => {
    chrome.tabs.create({ url: 'index.html' })
  }

  if (!url.isLocal(tab.url)) {
    chrome.browsingData.remove(
      {},
      {
        serviceWorkers: true,
      },
      function() {
        onReady()
      }
    )
  } else {
    onReady()
  }
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (url.isExtension(tab.url)) {
    tabStorage.set(tabId, tab)
  } else {
    tabStorage.remove(tabId)
  }
})

chrome.tabs.onRemoved.addListener(tabId => {
  if (!tabStorage.has(tabId)) {
    return
  }
  tabStorage.remove(tabId)
})

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const isAllowed = isAllowedToAction(tabStorage.get(details.tabId))

    if (!isAllowed || details.parentFrameId !== 0) {
      return {
        cancel: false,
      }
    }

    chrome.browsingData.remove(
      {},
      {
        serviceWorkers: true,
      }
    )
    return {
      cancel: false,
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
)

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    const headers = details.responseHeaders

    const isAllowed = isAllowedToAction(tabStorage.get(details.tabId))

    if (!isAllowed || details.parentFrameId !== 0) {
      return { responseHeaders: headers }
    }

    const responseHeaders = headers.filter(header => {
      const name = header.name.toLowerCase()
      return (
        ['x-frame-options', 'content-security-policy', 'frame-options'].indexOf(
          name
        ) === -1
      )
    })

    const redirectUrl = headers.find(header => {
      return header.name.toLowerCase() === 'location'
    })

    if (redirectUrl) {
      chrome.browsingData.remove(
        {},
        {
          serviceWorkers: true,
        }
      )
    }

    return {
      responseHeaders,
    }
  },
  {
    urls: ['<all_urls>'],
    types: ['sub_frame', 'main_frame'],
  },
  ['blocking', 'responseHeaders']
)

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const isAllowed = isAllowedToAction(tabStorage.get(details.tabId))

    if (!isAllowed || details.parentFrameId !== 0) {
      return
    }

    const frame = frameStorage.get(details.tabId, details.frameId)

    if (!frame) {
      return {
        requestHeaders: details.requestHeaders,
      }
    }
    let userAgent = frame.userAgent

    const userAgents = state && state.userAgents ? state.userAgents : devices

    const value = userAgents.find(agent => agent.name === userAgent)

    if (value) {
      userAgent = value.value
    }

    details.requestHeaders.push({
      name: 'User-Agent',
      value: userAgent,
    })

    return { requestHeaders: details.requestHeaders }
  },
  { urls: ['<all_urls>'], types: ['sub_frame'] },
  ['blocking', 'requestHeaders']
)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'GET_TAB_URL') {
    const tabUrl = url.isLocal(lastOpenedUrl) ? null : lastOpenedUrl

    chrome.browsingData.remove(
      {},
      {
        serviceWorkers: true,
      },
      () =>
        sendResponse({
          tabUrl,
        })
    )
  }

  if (request.message === 'LOAD_STATE') {
    state = request.state
  }

  if (request.message === 'CAPTURE_SCREEN') {
    chrome.tabs.captureVisibleTab(null, {}, function(image) {
      sendResponse({
        image,
      })
    })
  }
  return true
})

chrome.webNavigation.onCompleted.addListener(function(details) {
  const isAllowed = isAllowedToAction(tabStorage.get(details.tabId))

  if (!isAllowed || details.frameId === 0) {
    return
  }

  chrome.tabs.executeScript(details.tabId, {
    file: 'syncedEvents.js',
    frameId: details.frameId,
    runAt: 'document_end',
  })
})

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  const isAllowed = isAllowedToAction(tabStorage.get(details.tabId))

  if (!isAllowed || details.frameId === 0) {
    return
  }

  if (details.parentFrameId === 0) {
    const parsed = queryString.parseUrl(details.url)

    let userAgent = parsed.query ? parsed.query.__userAgent__ : null

    if (userAgent) {
      frameStorage.set({
        ...details,
        userAgent,
      })
    }
  }
})
