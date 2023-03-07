package com.mobilerentermanager;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
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
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
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
    // initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  // private static void initializeFlipper(
  //   Context context, ReactInstanceManager reactInstanceManager) {
  //   if (BuildConfig.DEBUG) {
  //     try {
  //       /*
  //        We use reflection here to pick up the class that initializes
  //        Flipper, since Flipper library is not available in release mode
  //       */
  //       Class<?> aClass = Class.forName("com.example.ReactNativeFlipper");
  //       aClass
  //           .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
  //           .invoke(null, context, reactInstanceManager);
  //     } catch (ClassNotFoundException e) {
  //       e.printStackTrace();
  //     } catch (NoSuchMethodException e) {
  //       e.printStackTrace();
  //     } catch (IllegalAccessException e) {
  //       e.printStackTrace();
  //     } catch (InvocationTargetException e) {
  //       e.printStackTrace();
  //     }
  //   }
  // }
}
