///<reference types="chrome"/>
import { State } from '../reducers/app'

import * as url from '../utils/url'

const frames = new Map()
const screens = new Map()

const injectContents = (tab: chrome.tabs.Tab) => {
  if (!tab.id) {
    return
  }
  chrome.tabs.executeScript(tab.id, {
    file: 'static/js/init.js',
  })

  chrome.tabs.executeScript(tab.id, {
    file: 'static/js/main.js',
  })
}
const start = (tab: chrome.tabs.Tab) => {
  let state: State

  let started = false

  if (!tab.id || !tab.url) {
    return
  }
  const extractHostname = new RegExp('^(?:f|ht)tp(?:s)?://([^/]+)', 'im')

  const pattern = /^file:/.test(tab.url)
    ? tab.url
    : tab.url.match(extractHostname)?.[0] + '/*'

  chrome.tabs.executeScript(
    tab.id,
    {
      code: 'window.location.reload()',
    },
    result => {
      if (result) {
        chrome.contentSettings.javascript.set({
          primaryPattern: pattern,
          setting: 'block',
        })
      }
    }
  )

  const tabHostname = url.extractHostname(tab.url)

  const onHeadersReceived = function(
    details: chrome.webRequest.WebResponseHeadersDetails
  ) {
    return {
      responseHeaders: details.responseHeaders?.filter(header => {
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

  const onWebNavigationError = () => {
    chrome.contentSettings.javascript.clear({})
  }

  const onWebNavigationComplete = function(
    details: chrome.webNavigation.WebNavigationFramedCallbackDetails
  ) {
    if (tab.id !== details.tabId) {
      return
    }

    if (details.url === 'about:blank') {
      return
    }

    if (details.frameId === 0) {
      if (started === false) {
        started = true
        chrome.contentSettings.javascript.clear({}, () => injectContents(tab))
        return
      }
      return
    }

    if (url.extractHostname(details.url) !== tabHostname) {
      return
    }

    chrome.tabs.executeScript(details.tabId, {
      file: 'static/js/inject.js',
      frameId: details.frameId,
      runAt: 'document_start',
    })
  }

  const onBeforeNavigate = function(
    details: chrome.webNavigation.WebNavigationTransitionCallbackDetails
  ) {
    if (details.frameId === 0 && started === true) {
      chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived)
      chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeaders)

      chrome.webNavigation.onCompleted.removeListener(onWebNavigationComplete)

      chrome.webNavigation.onCommitted.removeListener(onBeforeNavigate)

      chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest)

      chrome.runtime.onMessage.removeListener(onMessages)

      chrome.webNavigation.onErrorOccurred.removeListener(onWebNavigationError)
    } else if (details.frameId !== 0) {
      const screenId = screens.get(frames.get(details.frameId))

      if (screenId) {
        chrome.tabs.sendMessage(
          details.tabId,
          {
            message: 'FRAME_REFRESHED',
            screenId,
          },
          () => {}
        )
      }
    }
  }

  const onBeforeRequest = (
    details: chrome.webRequest.WebRequestBodyDetails
  ) => {
    if (details.frameId === 0) {
      return {
        cancel: true,
      }
    }
  }

  const onMessages = function(
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) {
    if (!sender.tab || !tab.id || sender.tab.id !== tab.id) {
      return
    }

    switch (message.message) {
      case 'GET_TAB_URL':
        sendResponse({
          tabUrl: tab.url,
        })
        break

      case 'CAPTURE_SCREEN':
        chrome.tabs.captureVisibleTab(function(image) {
          sendResponse({
            image,
          })
        })
        break

      case 'WAIT':
        setTimeout(() => {
          sendResponse({})
        }, message.time)
        break

      case 'SET_FRAME_ID':
        frames.set(sender.frameId, message.frameId)
        break

      case 'LOAD_STATE':
        state = message.state
        break
      case 'SCREEN_IDENTIFIED':
        screens.set(message.frameId, message.screenId)
        break
      default:
        // do nothing.
        sendResponse({})
        break
    }

    return true
  }

  const onBeforeSendHeaders = function(
    details: chrome.webRequest.WebRequestHeadersDetails
  ) {
    const screenId = frames.get(details.frameId)

    const screen = state.screens.find(screen => screen.id === screenId)

    if (!screenId || !screen) {
      return {
        requestHeaders: details.requestHeaders,
      }
    }

    let userAgent = screen.userAgent

    const userAgents = state.userAgents

    const value = userAgents.find(agent => agent.name === userAgent)

    if (value) {
      userAgent = value.value
    }

    details.requestHeaders = details.requestHeaders?.filter(
      header => header.name !== 'User-Agent'
    )

    details.requestHeaders?.push({
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
