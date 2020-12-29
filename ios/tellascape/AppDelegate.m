/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
@import Firebase;
#import "AppDelegate.h"
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <React/RCTLinkingManager.h>
#import "RNSplashScreen.h"
#import "RNFirebaseLinks.h"
#import <React/RCTEventEmitter.h>
#import "BridgeEvents.h"

@import GoogleMaps;
static NSString *const CUSTOM_URL_SCHEME = @"tellascape";

@implementation AppDelegate {
  RCTBridge *rootBridge;
}
  

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  if ([FIRApp defaultApp] == nil) {
    [FIROptions defaultOptions].deepLinkURLScheme = CUSTOM_URL_SCHEME;
    [FIRApp configure];
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    if (![defaults boolForKey:@"notFirstRun"]) {
      [defaults setBool:YES forKey:@"notFirstRun"];
      [defaults synchronize];
      [[FIRAuth auth] signOut:NULL];
    }
  }

  self.moduleRegistryAdapter = [[UMModuleRegistryAdapter alloc] initWithModuleRegistryProvider:[[UMModuleRegistryProvider alloc] init]];
  rootBridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:rootBridge
                                                   moduleName:@"tellascape"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // You can skip this line if you have the latest version of the SDK installed
  [[FBSDKApplicationDelegate sharedInstance] application:application
    didFinishLaunchingWithOptions:launchOptions];
  [GMSServices provideAPIKey:@"AIzaSyCE3VRS-dgnebns7EnRDT4OAZSooLLh3y4"];

  [RNSplashScreen show];
  return YES;
}

- (BOOL)application:(UIApplication *)application
continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:
#if defined(__IPHONE_12_0) && (__IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_12_0)
(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> *_Nullable))restorationHandler {
#else
    (nonnull void (^)(NSArray *_Nullable))restorationHandler {
#endif  // __IPHONE_12_0
      
      
  BOOL handled = [[FIRDynamicLinks dynamicLinks] handleUniversalLink:userActivity.webpageURL completion:^(FIRDynamicLink * _Nullable dynamicLink, NSError * _Nullable error) {
    
    BridgeEvents * events = [[BridgeEvents alloc] init];
    [events setBridge:self->rootBridge];
    [events onDetectDynamic: dynamicLink.url.absoluteString];
  }];
      
  return handled;
}
  
- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge
{
  NSArray<id<RCTBridgeModule>> *extraModules = [_moduleRegistryAdapter extraModulesForBridge:bridge];
  // You can inject any extra modules that you would like here, more information at:
  // https://facebook.github.io/react-native/docs/native-modules-ios.html#dependency-injection
  return extraModules;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

  
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handled =  [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options];
  // Add any custom logic here.
    return handled || [RCTLinkingManager application:application openURL:url options:options];
}
@end
