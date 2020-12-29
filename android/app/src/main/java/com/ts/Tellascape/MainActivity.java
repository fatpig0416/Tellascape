package com.ts.Tellascape;
// package com.splashexample;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.dynamiclinks.FirebaseDynamicLinks;
import com.google.firebase.dynamiclinks.PendingDynamicLinkData;

import org.devio.rn.splashscreen.SplashScreen;

import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;

import javax.annotation.Nullable;

public class MainActivity extends ReactActivity {
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "tellascape";
  }
  
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this,true);  // here
    FirebaseDynamicLinks.getInstance()
            .getDynamicLink(getIntent())
            .addOnSuccessListener(this, new OnSuccessListener<PendingDynamicLinkData>() {
              @Override
              public void onSuccess(PendingDynamicLinkData pendingDynamicLinkData) {
                // Get deep link from result (may be null if no link is found)
                Uri deepLink = null;
                if (pendingDynamicLinkData != null) {
                  deepLink = pendingDynamicLinkData.getLink();

                  String stringUri = deepLink != null ? deepLink.toString() : "";
                  if (!stringUri.equals("")) {
                      WritableMap params = new WritableNativeMap();
                      params.putString("url", stringUri);
                      getReactInstanceManager()
                              .getCurrentReactContext()
                              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                              .emit("onDetectDynamicLink", params);
                  }
                }
              }
            })
            .addOnFailureListener(this, new OnFailureListener() {
              @Override
              public void onFailure(@NonNull Exception e) {
                Log.w("Tellacafe", "getDynamicLink:onFailure", e);
              }
            });
    super.onCreate(savedInstanceState);
  }
}
