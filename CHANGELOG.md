# react-widget-socketio-en-html Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/) starting with version 1.0.0

## [1.0.1] - 2022-07-28

### Bugfixes

- fixed a bug in handling language shortcut enabling/disabling prop passing

## [1.0.0] - 2022-07-28

### Features

- Fully supports socket.io channels in Rasa bots (Rasa open-source version 2.8.x)
- Fully customizable including avatar, title, subtitle, message placeholder and more
- Customizable options pane attachable either on top or bottom of the chat widget
- Individual options in the option pane can be hidden via props
- Fully supports English. Check [Kolloqe](https://kolloqe.github.io) out which is a product that uses the chatwidget which has been extended through supporting code-switching between Sinhala (Si) and English (En)
- Supports rich responses including text, text + URLs, URLs, Images, Buttons (Quick Replies), and Cards (Carousels)
- Button behavior is fully configurable
- Offers support to specify various button types including Action buttons, Resonse buttons, Link buttons, and Dummy Buttons both in Quick Replies and Carousel buttons
- Clear chat ability
- Text-based avatar support
- Session persistence support

### Deprecations and Removals

- Dropped support for code-switching between Sinhala and English from the initial test version since it is a feature attached with Kolloqe, a propriotary conversational AI platform
