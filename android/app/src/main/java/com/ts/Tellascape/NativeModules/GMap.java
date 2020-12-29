package com.ts.Tellascape.NativeModules;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.clustering.Cluster;
import com.google.maps.android.clustering.ClusterItem;
import com.google.maps.android.clustering.ClusterManager;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;


public class GMap extends ViewGroupManager<MapView> implements OnMapReadyCallback {

    private GoogleMap googleMap;
    private ClusterManager mClusterManager;
    private ThemedReactContext context;

    public void gotoLocation(@Nullable final ReadableArray args, float zoom) {
        LatLng latLng = new LatLng(args.getDouble(0), args.getDouble(1));
        googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(latLng, zoom));
    }

    public void setMapType(@Nullable final ReadableArray args) {
        googleMap.setMapType(args.getInt(0));
    }

    public WritableMap generateMapParams(String key, LatLng value) {
        WritableMap params = new WritableNativeMap();
        params.putDouble("latitude", value.latitude);
        params.putDouble("longitude", value.longitude);
        return params;
    }

    public void refreshMap() {
        mClusterManager.clearItems();
        mClusterManager.cluster();
    }

    @Nonnull
    @Override
    public String getName() {
        return "GMap";
    }

    @Nonnull
    @Override
    protected MapView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        context = reactContext;
        MapView view = new MapView(reactContext);
        view.onCreate(null);
        view.onResume();
        view.getMapAsync(this);

        return view;
    }

    @Override
    public void onMapReady(GoogleMap gmap) {
        googleMap = gmap;
        mClusterManager = new ClusterManager<MyClusterItem>(context, googleMap);
        Utils.sendEvent(context, "onMapReady", null);
        googleMap.setOnCameraIdleListener(mClusterManager);
        googleMap.getUiSettings().setMyLocationButtonEnabled(false);
        googleMap.setMyLocationEnabled(true);
        googleMap.setOnMarkerClickListener(mClusterManager);
        googleMap.setOnInfoWindowClickListener(mClusterManager);

        mClusterManager.setRenderer(new MyMarkerClusterRender(context, googleMap, mClusterManager));

        mClusterManager.setOnClusterClickListener(new ClusterManager.OnClusterClickListener() {
            @Override
            public boolean onClusterClick(Cluster cluster) {

                LatLng clusterPos = new LatLng(cluster.getPosition().latitude, cluster.getPosition().longitude);
                float newZoom = googleMap.getCameraPosition().zoom + 4;
                if (newZoom > googleMap.getMaxZoomLevel())
                    newZoom = googleMap.getMaxZoomLevel();
                googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(clusterPos, newZoom));

                return true;
            }
        });

        mClusterManager.setOnClusterItemClickListener(new ClusterManager.OnClusterItemClickListener() {
            @Override
            public boolean onClusterItemClick(ClusterItem clusterItem) {
                Utils.sendEvent(context, "onMarkerPress", generateMapParams("marker", clusterItem.getPosition()));
                return true;
            }
        });
    }

    public void addMarker(@Nullable final ReadableArray args) {
        MyClusterItem ci = new MyClusterItem(
                args.getString(0),
                new LatLng(args.getDouble(1),
                        args.getDouble(2)),
                args.getString(3),
                args.getDouble(4),
                args.getInt(5)
        );

        mClusterManager.addItem(ci);
        mClusterManager.cluster();
    }

    // Receives commands from JavaScript using UIManager.dispatchViewManagerCommand
    @Override
    public void receiveCommand(MapView view, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(view, commandId, args);
        switch (commandId) {
            case 0:
                addMarker(args);
                break;
            case 1:
                gotoLocation(args, 15.0f);
                break;
            case 2:
                setMapType(args);
                break;
            case 3:
                refreshMap();
                break;
            case 4:
                gotoLocation(args, 8.0f); // initial region
                break;
        }

    }
}
