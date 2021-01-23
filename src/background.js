import queryString from 'query-string'
import devices from './devices'

import * as url from './utils/url'

const frames = {}

chrome.browserAction.onClicked.addListener(tab => {
  let state = {}

  chrome.tabs.executeScript({
    file: 'init.js',
  })

  chrome.tabs.insertCSS({
    file: 'static/css/main.css',
  })

  chrome.tabs.executeScript({
    file: 'static/js/main.js',
  })

  const tabHostname = url.extractHostname(tab.url)

  const onHeadersReceived = function(details) {
    const headers = details.responseHeaders

    if (details.frameId === 0) {
      return {
        responseHeaders: headers,
      }
    }

    const responseHeaders = headers.filter(header => {
      const name = header.name.toLowerCase()
      return (
        ['x-frame-options', 'content-security-policy', 'frame-options'].indexOf(
          name
        ) === -1
      )
    })

    return {
      responseHeaders,
    }
  }

  const onWebNavigationComplete = function(details) {
    if (tab.id !== details.tabId) {
      return
    }

    if (details.url === 'about:blank') {
      return
    }

    if (details.frameId === 0) {
      return
    }

    if (url.extractHostname(details.url) !== tabHostname) {
      return
    }

    chrome.tabs.executeScript(details.tabId, {
      file: 'syncedEvents.js',
      frameId: details.frameId,
      runAt: 'document_start',
    })
  }

  const onBeforeNavigate = function(details) {
    if (details.frameId === 0) {
      chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived)
      chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeaders)

      chrome.webNavigation.onCompleted.removeListener(onWebNavigationComplete)

      chrome.webNavigation.onCommitted.removeListener(onBeforeNavigate)
      chrome.runtime.onMessage.removeListener(onMessages)
    }
  }

  const onMessages = function(request, sender, sendResponse) {
    if (sender.tab.id !== tab.id) {
      return
    }

    switch (request.message) {
      case 'GET_TAB_URL':
        sendResponse({
          tabUrl: tab.url,
        })
        break

      case 'CAPTURE_SCREEN':
        chrome.tabs.captureVisibleTab(null, {}, function(image) {
          console.log('image captured', image)
          sendResponse({
            image,
          })
        })
        break

      case 'SET_FRAME_ID':
        frames[sender.frameId] = request.frameId
        break

      case 'LOAD_STATE':
        state = request.state
        break
      default:
        // do nothing.
        break
    }

    return true
  }

  const onBeforeSendHeaders = function(details) {
    if (details.tabId !== tab.id || tab.frameId === 0) {
      return {
        requestHeaders: details.requestHeaders,
      }
    }

    if (!frames[details.frameId]) {
      const parsed = queryString.parseUrl(details.url)
      if (parsed && parsed.query && parsed.query._RSSID_) {
        frames[details.frameId] = parsed.query._RSSID_
      }
    }

    const screenId = frames[details.frameId]

    const screen = state.screens.find(screen => screen.id === screenId)

    if (!screenId || !screen) {
      return {
        requestHeaders: details.requestHeaders,
      }
    }

    let userAgent = screen.userAgent

    const userAgents = state && state.userAgents ? state.userAgents : devices

    const value = userAgents.find(agent => agent.name === userAgent)

    if (value) {
      userAgent = value.value
    }

    details.requestHeaders = details.requestHeaders.filter(
      header => header.name !== 'User-Agent'
    )

    details.requestHeaders.push({
      name: 'User-Agent',
      value: userAgent,
    })

    return { requestHeaders: details.requestHeaders }
  }

  chrome.webRequest.onHeadersReceived.addListener(
    onHeadersReceived,
    {
      urls: ['<all_urls>'],
      types: ['sub_frame'],
      tabId: tab.id,
    },
    ['blocking', 'responseHeaders', 'extraHeaders']
  )

  chrome.webNavigation.onCompleted.addListener(onWebNavigationComplete)

  chrome.webNavigation.onCommitted.addListener(onBeforeNavigate)

  chrome.runtime.onMessage.addListener(onMessages)

  chrome.webRequest.onBeforeSendHeaders.addListener(
    onBeforeSendHeaders,
    { urls: ['<all_urls>'], types: ['sub_frame'], tabId: tab.id },
    ['blocking', 'requestHeaders']
  )
})
