package com.ts.Tellascape;

import com.ts.Tellascape.generated.BasePackageList;
import android.app.Application;
import android.content.Context;
import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
import org.unimodules.core.interfaces.SingletonModule;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.cameraroll.CameraRollPackage;

import com.reactnativecommunity.geolocation.GeolocationPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;


import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
//import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import com.brentvatne.react.ReactVideoPackage;

import androidx.multidex.MultiDexApplication;

public class MainApplication extends MultiDexApplication implements ReactApplication {

    private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(new BasePackageList().getPackageList(), Arrays.<SingletonModule>asList());

    private final ReactNativeHost mReactNativeHost =
        new ReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                @SuppressWarnings("UnnecessaryLocalVariable")
                List<ReactPackage> packages = new PackageList(this).getPackages();
                // Packages that cannot be autolinked yet can be added manually here, for example:
                // packages.add(new MyReactNativePackage());
                packages.add(new RNFirebaseAuthPackage());
                packages.add(new RNFirebaseMessagingPackage());
                packages.add(new RNFirebaseNotificationsPackage());
                packages.add(new RNFirebaseDatabasePackage());
                packages.add(new RNFirebaseLinksPackage());
                packages.add(new ReactVideoPackage());
                packages.add(new NativePackages());

                // Add unimodules
                List<ReactPackage> unimodules = Arrays.<ReactPackage>asList(
                    new ModuleRegistryAdapter(mModuleRegistryProvider)
                );
                packages.addAll(unimodules);

                return packages;
            }

            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
