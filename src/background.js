const queryString = require('query-string')
import devices from './devices'
const parse = require('url-parse')

let state = {}

const getOrigins = url => {
  const hostname = parse(lastOpenedUrl).hostname
  return [`https://${hostname}`, `http://${hostname}`]
}

const isLocalUrl = url => {
  return (
    String(url).startsWith('chrome://') ||
    String(url).startsWith('chrome-extension://')
  )
}

const isAllowedToAction = initiator => {
  return String(initiator).startsWith(chrome.runtime.getURL('/').trim('/'))
}

let lastOpenedUrl

chrome.browserAction.onClicked.addListener(tab => {
  lastOpenedUrl = tab.url
  const onReady = () => {
    chrome.tabs.create({ url: 'index.html' })
  }
  if (!isLocalUrl(lastOpenedUrl)) {
    onReady()
  } else {
    onReady()
  }
})

const tabStorage = {}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  tabStorage[changeInfo.tabId] = {
    url: tab.url,
  }
})

chrome.tabs.onActivated.addListener(function(activeInfo) {
  // how to fetch tab url using activeInfo.tabid
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    tabStorage[activeInfo.tabId] = {
      url: tab.url,
    }
  })
})

chrome.tabs.onRemoved.addListener(tab => {
  const tabId = tab.tabId
  if (!tabStorage.hasOwnProperty(tabId)) {
    return
  }
  tabStorage[tabId] = null
})

chrome.webRequest.onHeadersReceived.addListener(
  function(info) {
    const headers = info.responseHeaders

    const isAllowed = isAllowedToAction(tabStorage[info.tabId].url)

    if (!isAllowed || info.parentFrameId !== 0) {
      return { responseHeaders: headers }
    }

    return {
      responseHeaders: headers.filter(header => {
        const name = header.name.toLowerCase()
        return (
          [
            'x-frame-options',
            'content-security-policy',
            'frame-options',
          ].indexOf(name) === -1
        )
      }),
    }
  },
  {
    urls: ['<all_urls>'],
    types: ['sub_frame'],
  },
  ['blocking', 'responseHeaders']
)

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const isAllowed = isAllowedToAction(tabStorage[details.tabId].url)

    if (!isAllowed) {
      return
    }

    const parsed = queryString.parseUrl(details.url)

    let userAgent = parsed.query ? parsed.query.__userAgent__ : null

    if (!userAgent) {
      return {
        requestHeaders: details.requestHeaders,
      }
    }

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
    sendResponse({
      tabUrl: isLocalUrl(lastOpenedUrl) ? null : lastOpenedUrl,
    })
  }

  if (request.message === 'LOAD_STATE') {
    state = request.state
  }
  return true
})

chrome.webNavigation.onCompleted.addListener(function(details) {
  chrome.tabs.executeScript(details.tabId, {
    file: 'syncedEvents.js',
    frameId: details.frameId,
    runAt: 'document_end',
  })
})
