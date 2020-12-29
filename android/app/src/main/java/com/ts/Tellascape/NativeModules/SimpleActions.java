package com.ts.Tellascape.NativeModules;

import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.dynamiclinks.FirebaseDynamicLinks;
import com.google.firebase.dynamiclinks.PendingDynamicLinkData;

import java.util.concurrent.Executor;

import javax.annotation.Nullable;

public class SimpleActions extends ReactContextBaseJavaModule {
    public SimpleActions(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "SimpleActions";
    }

    @ReactMethod
    public void parseDynamicLink(String dynamicLink, Callback successCallback, Callback errorCallback) {
        Uri uri = Uri.parse(dynamicLink);
        FirebaseDynamicLinks.getInstance().getDynamicLink(uri).addOnSuccessListener(getCurrentActivity(), new OnSuccessListener<PendingDynamicLinkData>() {
            @Override
            public void onSuccess(PendingDynamicLinkData pendingDynamicLinkData) {
                // Get deep link from result (may be null if no link is found)
                Uri deepLink = null;
                if (pendingDynamicLinkData != null) {
                    deepLink = pendingDynamicLinkData.getLink();

                    String stringUri = deepLink != null ? deepLink.toString() : "";
                    successCallback.invoke(stringUri);
                }
            }
        })
                .addOnFailureListener(getCurrentActivity(), new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        errorCallback.invoke(e.getMessage());
                    }
                });
    }
}
