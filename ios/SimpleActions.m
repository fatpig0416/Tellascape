//
//  SimpleAction.m
//  tellascape
//
//  Created by admin on 11/30/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "SimpleActions.h"
#import "RNFirebaseLinks.h"

@implementation SimpleActions


RCT_EXPORT_MODULE();

//exports a method parseDynamicLink to javascript
RCT_EXPORT_METHOD(parseDynamicLink: (NSURL*) dynamicUrl :(RCTResponseSenderBlock) successCallback : (RCTResponseErrorBlock) errorCallback) {
  [[FIRDynamicLinks dynamicLinks] resolveShortLink: dynamicUrl completion:^(NSURL * _Nullable url, NSError * _Nullable error) {
    if (error != nil) {
      errorCallback(error.localizedDescription);
    } else {
                
      NSArray *params = [[NSArray alloc] init];
      params = [[url query] componentsSeparatedByString:@"&"];
      if (params.count > 0) {
        NSString *deep_link_id = params[0];
        params = [deep_link_id componentsSeparatedByString:@"="];
        if (params.count > 0) {
          successCallback(@[params[1]]);
        }
      }
    }
   
  }];
}

@end
