# Tellascape

App to facilitate to build your journey and share your photo/videos with followers

## Requirements

- we use [node.js](https://nodejs.org/en/) `lts/carbon`.

      	if you have [`nvm`](https://github.com/creationix/nvm) installed it should pick up the version from the `.nvmrc`
        file and do the rest for you.

- we use [yarn](https://yarnpkg.com/en/docs/install)

---

## 👋 Intro

This is a [React Native app](https://facebook.github.io/react-native/) for iOS and Android.

---

## 📖 Docs

- [Wiki Page]()

---

## 🚀 Getting Started

#### 1. Clone and Install

```bash
# Clone the repo
git clone https://tellascape_pardeep@bitbucket.org/tellascapedevelopers/tellascape.git

# Install node dependencies
yarn
```

#### 2. Run the _React Native_ App

```bash
# Start the React Native packager
yarn start

```

Instructions are shown in the terminal. You can select to open it in:

- An emulator (either iOS or Android)

for Ios you can either run

```bash
# for production
react-native run-ios
# or for debugging
react-native run-ios
```

---

## Versioning

We follow the principles of [Semantic Versioning](https://semver.org/) and the abilities of [`yarn`](https://yarnpkg.com/en/docs/cli/version) to bump version numbers during the development.

Android is configured to fetch the version number from the `package.json` during the gradle build process. For Ios there is a file `scripts/version-ios.sh` which will be automatically invoked whenever `yarn version` is triggered. its purpose is to customize the version data within the `ios/tellascape/Info.plist`.

so basically whenever a sprint is closed or a release is planed just run

    yarn version

---

---

## 🖼 Assets

we have script in `scripts/build-assets.js` for exporting, converting and installing the appicons, launchscript and vectoricons from the `assets/stylesheet.sketch` file.

    yarn assets

---

## 👊 Get in Touch

we use workplace for the internal communication.

- Tellascape LLC
  https://my.workplace.com/groups/2448586658797664/

---

## 📚 Libraries

### Node Libraries

- [react-native](https://facebook.github.io/react-native/)
- [react-redux](https://github.com/reactjs/react-redux)
- [styled-components](https://github.com/styled-components/styled-components)

### React Native Libraries - with native code

- [react-native-exception-handler](https://github.com/master-atul/react-native-exception-handler)
- [react-navigation](https://github.com/react-navigation/react-navigation)
- [react-navigation-drawer](https://www.npmjs.com/package/react-navigation-drawer)
- [react-navigation-stack](https://www.npmjs.com/package/react-navigation-stack)
- [react-navigation-tabs](https://www.npmjs.com/package/react-navigation-tabs)
- [react-native-restart](https://github.com/avishayil/react-native-restart)
- [gl-react](https://github.com/gre/gl-react/)
- [gl-react-image](https://github.com/gre/gl-react-image/)
- [gl-react-native](https://www.npmjs.com/package/gl-react-native/)
- [graham_scan](https://github.com/brian3kb/graham_scan_js/)
- [moment](https://www.npmjs.com/package/moment/)
- [lodash](https://github.com/lodash/lodash/)
- [react-native-camera](https://www.npmjs.com/package/react-native-camera/)
- [react-native-collapsible](https://www.npmjs.com/package/react-native-collapsible/)
- [react-native-confirmation-code-field](https://www.npmjs.com/package/react-native-confirmation-code-field/)
- [react-native-country-picker-modal](https://www.npmjs.com/package/react-native-country-picker-modal/)
- [react-native-device-info](https://www.npmjs.com/package/react-native-device-info/)
- [react-native-emoji-selector](https://www.npmjs.com/package/react-native-emoji-selector/)
- [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image/)
- [react-native-gesture-handler](https://github.com/facebook/react-native-fbsdk/)
- [react-native-get-location](https://www.npmjs.com/package/react-native-get-location/)
- [react-native-gifted-chat](https://www.npmjs.com/package/react-native-gifted-chat/)
- [react-native-image-crop-picker](https://github.com/ivpusic/react-native-image-crop-picker/)
- [react-native-image-progress](https://www.npmjs.com/package/react-native-image-progress/)
- [react-native-image-resizer](https://www.npmjs.com/package/react-native-image-resizer/) [Currently not used in the codebase]
- [react-native-img-cache](https://www.npmjs.com/package/react-native-img-cache/)
- [react-native-linear-gradient](https://www.npmjs.com/package/react-native-linear-gradient/)
- [react-native-maps](https://www.npmjs.com/package/react-native-maps/)
- [react-native-maps-super-cluster](https://www.npmjs.com/package/react-native-maps-super-cluster/)
- [react-native-masked-text](https://github.com/benhurott/react-native-masked-text/)
- [react-native-material-textfield](https://github.com/n4kz/react-native-material-textfield/)
- [react-native-modal](https://www.npmjs.com/package/react-native-modal/)
- [react-native-modal-datetime-picker](https://www.npmjs.com/package/react-native-modal-datetime-picker/)
- [react-native-modal-selector](https://www.npmjs.com/package/react-native-modal-selector/)
- [react-native-parallax-scroll-view](https://www.npmjs.com/package/react-native-parallax-scroll-view/)
- [react-native-phone-input](https://www.npmjs.com/package/react-native-phone-input/)
- [react-native-picker-select](https://www.npmjs.com/package/react-native-picker-select/)
- [react-native-popup-menu](https://www.npmjs.com/package/react-native-popup-menu/)
- [react-native-read-more-text](https://www.npmjs.com/package/react-native-read-more-text/)
- [react-native-reanimated](https://www.npmjs.com/package/react-native-reanimated/)
- [react-native-segmented-control-tab](https://www.npmjs.com/package/react-native-segmented-control-tab/)
- [react-native-switch](https://www.npmjs.com/package/react-native-switch/)
- [react-native-snap-carousel](https://www.npmjs.com/package/react-native-snap-carousel/)
- [react-native-video](https://www.npmjs.com/package/react-native-video/)
- [react-native-switch-selector](https://www.npmjs.com/package/react-native-switch-selector/)
- [react-native-walkthrough-tooltip](https://www.npmjs.com/package/react-native-walkthrough-tooltip/)
- [react-native-view-shot](https://www.npmjs.com/package/geolib/)
- [geolib](https://www.npmjs.com/package/geolib/)
- [react-native-firebase](https://www.npmjs.com/package/react-native-firebase)
- [apisauce](https://www.npmjs.com/package/apisauce)
- [turf](https://www.npmjs.com/package/@turf/turf)
- [react-native-maps](https://github.com/react-community/react-native-maps)

### React Native Libraries - without native code

- [react-native-debugger](https://github.com/jhen0409/react-native-debugger)
- [react-native-debugger-open](https://github.com/jhen0409/react-native-debugger/tree/master/npm-package)
- [react-native-keyboard-aware-scroll-view](https://github.com/wix/react-native-keyboard-aware-scrollview)
- [react-native-material-buttons](https://github.com/n4kz/react-native-material-buttons)
- [react-native-material-dropdown](https://github.com/n4kz/react-native-material-dropdown)
- [react-native-material-textfield](https://github.com/n4kz/react-native-material-textfield)
- [react-native-progress](https://github.com/oblador/react-native-progress)
- [react-native-snap-carousel](https://github.com/archriss/react-native-snap-carousel)
- [react-native-version-number](https://github.com/APSL/react-native-version-number)

### Development libraries

- [webfonts-generator](https://github.com/sunflowerdeath/webfonts-generator)
- [svgo](https://github.com/svg/svgo)

---

## 💡 Inspiration

- [Atomic Design Starter Kit](https://github.com/danilowoz/react-atomic-design/)

### Other Resources

- [Getting Started with React Native and Flow](https://medium.com/react-native-training/getting-started-with-react-native-and-flow-d40f55746809)

- [iOS - Creating a Distribution Certificate and .p12 File](https://support.magplus.com/hc/en-us/articles/203808748-iOS-Creating-a-Distribution-Certificate-and-p12-File)

* [Lottie React Native Tutorial](https://medium.com/react-native-training/lottie-react-native-tutorial-162d91840720)
* [Using Lottie with React Native](https://blog.prototypr.io/using-lottie-with-react-native-af7a8ea2c13c)
* [Expo](https://expo.io/)
* [Shields](https://shields.io/)
* [Native Directory](https://native.directory/)
* https://github.com/Dorian/snack-react-native-apps
* http://necolas.github.io/react-native-web/storybook/
* http://jkaufman.io/react-web-native-codesharing/
* http://www.awesome-react-native.com/
* https://github.com/FuYaoDe/react-native-app-intro
* https://medium.com/react-native-training/lottie-react-native-tutorial-162d91840720
* https://github.com/airbnb/lottie-react-native/blob/master/docs/api.md
* https://blog.prototypr.io/using-lottie-with-react-native-af7a8ea2c13c
* [Font Icons Workflow with Sketch and Grunt](https://medium.com/sketch-app-sources/font-icons-workflow-with-sketch-and-grunt-16b161d97c5e)
* [Progressive Web App Splash Screens](https://medium.com/@applification/progressive-web-app-splash-screens-80340b45d210)
* [React Native Google Map with react-native-maps](https://codeburst.io/react-native-google-map-with-react-native-maps-572e3d3eee14)
* []()

### Boilerplates

- https://github.com/optimizely/React-Native-Base-Test-App

#### Launchscreens

https://developer.apple.com/ios/human-interface-guidelines/icons-and-images/launch-screen/

Device Portrait size Landscape size

iPhone X 1125px × 2436px 2436px × 1125px

iPhone 8 Plus 1242px × 2208px 2208px × 1242px

iPhone 8 750px × 1334px 1334px × 750px

iPhone 7 Plus 1242px × 2208px 2208px × 1242px

iPhone 7 750px × 1334px 1334px × 750px

iPhone 6s Plus 1242px × 2208px 2208px × 1242px

iPhone 6s 750px × 1334px 1334px × 750px

iPhone SE 640px × 1136px 1136px × 640px

https://developer.apple.com/ios/human-interface-guidelines/overview/themes/#//apple_ref/doc/uid/TP40006556-CH27-SW1

#### Known Issues to update packages

Issue Name: Warning for Object type
Package name : react-native-switch-selector
We use this library in view event page it has props name "options" required pass array but in mistake library have PropTyps.object so this warning appear
https://github.com/App2Sales/react-native-switch-selector/pull/63/commits/4d0217b8ce4a979c45d06cd7a641dc91d5fcce1c
