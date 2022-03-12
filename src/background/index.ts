///<reference types="chrome"/>
import { State } from '../reducers/app'
import { Device } from '../types'
import { getPrefixedMessage } from '../utils/getPrefixedMessage'

import * as url from '../utils/url'

const replaceHeader = (
  headers: chrome.webRequest.HttpHeader[],
  name: string,
  value: string
) => {
  return [
    ...headers.filter(header => header.name !== value),
    {
      name,
      value,
    },
  ]
}

const injectContents = (tab: chrome.tabs.Tab) => {
  if (!tab.id) {
    return
  }
  chrome.tabs.executeScript(tab.id, {
    file: 'static/js/init.js',

    runAt: 'document_start',
  })

  chrome.tabs.executeScript(tab.id, {
    file: 'static/js/main.js',

    runAt: 'document_start',
  })
}

const start = (tab: chrome.tabs.Tab) => {
  let state: State
  let started = false

  const getScreenUserAgent = (screen: Device) => {
    let userAgent = screen.userAgent

    const userAgents = state.userAgents

    const value = userAgents.find(agent => agent.name === userAgent)

    if (value) {
      userAgent = value.value
    }

    return userAgent
  }

  const screens = new Map()

  if (!tab.id || !tab.url) {
    return
  }

  chrome.tabs.executeScript(
    tab.id,
    {
      code: 'window.location.reload()',
    },
    result => {}
  )

  const tabHostname = url.extractHostname(tab.url)

  const onHeadersReceived = function(
    details: chrome.webRequest.WebResponseHeadersDetails
  ) {
    const responseHeaders = [...(details.responseHeaders || [])]

    if (tab.id !== details.tabId) {
      return { responseHeaders }
    }

    if (details.frameId === 0) {
      responseHeaders.push({ name: 'Content-Type', value: 'image/png' })
    }
    return {
      responseHeaders: responseHeaders?.filter(header => {
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

  const onWebNavigationComplete = function(
    details: chrome.webNavigation.WebNavigationFramedCallbackDetails
  ) {
    if (tab.id !== details.tabId || details.url === 'about:blank') {
      return
    }

    if (details.frameId === 0) {
      if (started === false) {
        started = true
        injectContents(tab)
      }
      return
    }

    if (url.extractHostname(details.url) !== tabHostname) {
      return
    }
    if (!screens.get(details.frameId)) {
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
    if (details.tabId !== tab.id) {
      return
    }
    if (details.frameId !== 0) {
      if (details.url.startsWith('about:blank?screenId=')) {
        const screenId = new URL(details.url).searchParams.get('screenId')
        screens.set(details.frameId, screenId)
        chrome.tabs.sendMessage(
          details.tabId,
          {
            message: getPrefixedMessage('FRAME_CONNECTED'),
            frameId: details.frameId,
            screenId,
          },
          () => {}
        )
        return
      }
      const screenId = screens.get(details.frameId)
      if (screenId) {
        chrome.tabs.sendMessage(
          details.tabId,
          {
            message: getPrefixedMessage('FRAME_REFRESHED'),
            screenId,
          },
          () => {}
        )
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
      case getPrefixedMessage('GET_TAB_URL'):
        sendResponse({
          tabUrl: tab.url,
        })
        break

      case getPrefixedMessage('CAPTURE_SCREEN'):
        chrome.tabs.captureVisibleTab(
          tab.windowId,
          {
            format: 'png',
          },
          function(image) {
            sendResponse({
              image,
            })
          }
        )
        break

      case getPrefixedMessage('WAIT'):
        setTimeout(() => {
          sendResponse({})
        }, message.time)
        break

      case getPrefixedMessage('LOAD_STATE'):
        state = message.state
        break

      case getPrefixedMessage('GET_SCREEN_ID'):
        sendResponse({
          screenId: screens.get(sender.frameId),
          ok: true,
        })
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
    if (details.tabId !== tab.id) {
      return
    }
    const screenId = screens.get(details.frameId)
    if (!screenId) {
      return
    }
    const screen = state.screens.find(screen => screen.id === screenId)

    if (!screen) {
      return
    }
    let headers = [...(details.requestHeaders || [])]

    headers = replaceHeader(headers, 'User-Agent', getScreenUserAgent(screen))

    return { requestHeaders: headers }
  }

  const onBeforeRequest = (
    details: chrome.webRequest.WebRequestBodyDetails
  ) => {
    if (!started || details.tabId !== tab.id) {
      return
    }

    chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived)
    chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeaders)

    chrome.webNavigation.onCompleted.removeListener(onWebNavigationComplete)

    chrome.webNavigation.onCommitted.removeListener(onBeforeNavigate)

    chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest)

    chrome.runtime.onMessage.removeListener(onMessages)
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

  chrome.webNavigation.onCompleted.addListener(onWebNavigationComplete)

  chrome.webNavigation.onCommitted.addListener(onBeforeNavigate)

  chrome.runtime.onMessage.addListener(onMessages)

  chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, {
    urls: ['<all_urls>'],
    types: ['main_frame'],
    tabId: tab.id,
  })

  chrome.webRequest.onBeforeSendHeaders.addListener(
    onBeforeSendHeaders,
    { urls: ['<all_urls>'], types: ['sub_frame'], tabId: tab.id },
    ['blocking', 'requestHeaders']
  )
}

chrome.browserAction.onClicked.addListener(tab => {
  start(tab)
})
