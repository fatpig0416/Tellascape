//
//  BridgeEvents.h
//  tellascape
//
//  Created by admin on 11/28/20.
//  Copyright © 2020 Facebook. All rights reserved.
//
#import <React/RCTEventEmitter.h>
#import <React/RCTEventDispatcher.h>

NS_ASSUME_NONNULL_BEGIN

@interface BridgeEvents : RCTEventEmitter <RCTBridgeModule>
- (void)onDetectDynamic : (NSString *) url;
@end

NS_ASSUME_NONNULL_END
