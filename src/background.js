const queryString = require('query-string')
import { loadState } from './utils/state'
import devices from './devices'
const parse = require('url-parse')

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

  if (!isLocalUrl(lastOpenedUrl)) {
    chrome.browsingData.remove(
      {
        origins: getOrigins(lastOpenedUrl),
      },
      {
        serviceWorkers: true,
      },
      function() {
        chrome.tabs.create({ url: 'index.html' })
      }
    )
  } else {
    chrome.tabs.create({ url: 'index.html' })
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

    if (!isAllowed) {
      return { responseHeaders: headers }
    }

    chrome.browsingData.removeServiceWorkers(
      {
        origins: getOrigins(info.url),
      },
      function() {}
    )

    return {
      responseHeaders: headers.filter(header => {
        const name = header.name.toLowerCase()
        return (
          ['x-frame-options', 'content-security-policy'].indexOf(name) === -1
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

    const state = loadState()

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
  return true
})
