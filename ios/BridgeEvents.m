//
//  BridgeEvents.m
//  tellascape
//
//  Created by admin on 11/28/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "BridgeEvents.h"

@implementation BridgeEvents

RCT_EXPORT_MODULE();

+ (id)allocWithZone:(NSZone *)zone {
    static BridgeEvents *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onDetectDynamicLink"];
}

- (void)onDetectDynamic: (NSString *) url {
  [self sendEventWithName:@"onDetectDynamicLink" body: url];
}
@end
