import queryString from 'query-string'
import devices from './devices'

import * as url from './utils/url'

const frames = {}

const injectContents = tab => {
  chrome.tabs.executeScript(tab.id, {
    file: 'init.js',
  })

  chrome.tabs.insertCSS(tab.id, {
    file: 'static/css/main.css',
  })

  chrome.tabs.executeScript(tab.id, {
    file: 'static/js/main.js',
  })
}
const start = tab => {
  let state = {}

  let started = false

  const extractHostname = new RegExp('^(?:f|ht)tp(?:s)?://([^/]+)', 'im')

  const pattern = /^file:/.test(tab.url)
    ? tab.url
    : tab.url.match(extractHostname)[0] + '/*'

  console.log(chrome.contentSettings.javascript)
  chrome.contentSettings.javascript.set(
    { primaryPattern: pattern, setting: 'block' },
    function(details) {
      chrome.tabs.executeScript(tab.id, {
        code: 'window.location.reload()',
      })
    }
  )

  const tabHostname = url.extractHostname(tab.url)

  const onHeadersReceived = function(details) {
    return {
      responseHeaders: details.responseHeaders.filter(header => {
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
  }

  const onWebNavigationError = details => {
    chrome.contentSettings.javascript.clear({}, function(details) {})
  }
  const onWebNavigationComplete = function(details) {
    if (tab.id !== details.tabId) {
      return
    }

    if (details.url === 'about:blank') {
      return
    }

    if (details.frameId === 0) {
      if (started === false) {
        started = true
        chrome.contentSettings.javascript.clear({}, function(details) {
          injectContents(tab)
        })

        return
      }
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
    if (details.frameId === 0 && started === true) {
      chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived)
      chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeaders)

      chrome.webNavigation.onCompleted.removeListener(onWebNavigationComplete)

      chrome.webNavigation.onCommitted.removeListener(onBeforeNavigate)

      chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest)

      chrome.runtime.onMessage.removeListener(onMessages)

      chrome.webNavigation.onErrorOccurred.removeListener(onWebNavigationError)
    }
  }

  const onBeforeRequest = details => {
    if (details.frameId === 0) {
      return {
        cancel: true,
      }
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
          sendResponse({
            image,
          })
        })
        break

      case 'WAIT':
        setTimeout(() => {
          sendResponse({})
        }, request.time)
        break

      case 'SET_FRAME_ID':
        frames[sender.frameId] = request.frameId

        chrome.tabs.sendMessage(
          tab.id,
          {
            message: 'SET_FRAME',
            screenId: sender.frameId,
            tabId: tab.id,
            chromeFrameId: request.frameId,
          },
          () => {}
        )

        break

      case 'LOAD_STATE':
        state = request.state
        break
      default:
        // do nothing.
        sendResponse({})
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
      types: ['main_frame', 'sub_frame'],
      tabId: tab.id,
    },
    ['blocking', 'responseHeaders', 'extraHeaders']
  )
  chrome.webRequest.onBeforeRequest.addListener(
    onBeforeRequest,
    {
      urls: ['<all_urls>'],
      types: [
        'stylesheet',
        'script',
        'image',
        'font',
        'object',
        'xmlhttprequest',
        'ping',
        'csp_report',
        'media',
        'websocket',
      ],
      tabId: tab.id,
    },
    ['blocking']
  )

  chrome.webNavigation.onErrorOccurred.addListener(onWebNavigationError)
  chrome.webNavigation.onCompleted.addListener(onWebNavigationComplete)

  chrome.webNavigation.onCommitted.addListener(onBeforeNavigate)

  chrome.runtime.onMessage.addListener(onMessages)

  chrome.webRequest.onBeforeSendHeaders.addListener(
    onBeforeSendHeaders,
    { urls: ['<all_urls>'], types: ['sub_frame'], tabId: tab.id },
    ['blocking', 'requestHeaders']
  )
}
chrome.browserAction.onClicked.addListener(tab => {
  start(tab)
})
