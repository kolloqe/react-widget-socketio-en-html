import React from 'react';
import ReactDOM from 'react-dom/client';
import KolloqeChatWidget from './webchat/KolloqeChatWidget';

let element_id = undefined;
let root = undefined;
let props = {};

try {
  element_id = window?.kolloqe_webchat_id;
  props = window?.kolloqeProps[element_id];
  root = ReactDOM.createRoot(document.getElementById(String(element_id)));
} catch (err) {
  console.error("failed to retrieve the props");
}

root.render(
  <React.StrictMode>
    <div id="kolloqe-widget-container">
      <KolloqeChatWidget
        position={props?.position}
        positionProps={props?.positionProps}
        title={props?.title}
        subtitle={props?.subtitle}
        defaultLang={props?.defaultLang}
        avatar={props?.avatar}
        avatarType={props?.avatarType}
        avatarLink={props?.avatarLink}
        socketURL={props?.socketURL}
        initPayload={props?.initPayload}
        reconnectTimeout={props?.reconnectTimeout}
        widgetOptions={props?.widgetOptions}
        fullscreenButton={props?.fullscreenButton}
        langSwitch={props?.langSwitch}
        moreOptions={props?.moreOptions}
        widgetOptionsPosition={props?.widgetOptionsPosition}
        hideWhenNotConnected={props?.hideWhenNotConnected}
        displayUnreadCount={props?.displayUnreadCount}
        showMessageDate={props?.showMessageDate}
        persistSession={props?.persistSession}
        triggerIntents={props?.triggerIntents}
        enableURLs={props?.enableURLs}
        disablePreviousQuickReplies={props?.disablePreviousQuickReplies}
        indicatorDelay={props?.indicatorDelay}
        indicatorType={props?.indicatorType}
        enableShortcuts={props?.enableShortcuts}
        shortcutKey={props?.shortcutKey} />
    </div>
  </React.StrictMode>
);
