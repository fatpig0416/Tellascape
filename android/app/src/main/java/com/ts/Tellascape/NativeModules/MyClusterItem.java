package com.ts.Tellascape.NativeModules;

import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.clustering.ClusterItem;

public class MyClusterItem implements ClusterItem {

    public String tag;
    private LatLng position;
    private Integer index;
    public String markerIcon;
    public Double markerIconDimension;

    public MyClusterItem(String g, LatLng pos, String mIco, Double mIcoDim, Integer i){
        tag = g;
        position =pos;
        index = i;
        markerIcon = mIco;
        markerIconDimension = mIcoDim;
    }

    @Override
    public LatLng getPosition() {
        return position;
    }

    @Override
    public String getTitle() {
        return null;
    }

    @Override
    public String getSnippet() {
        return null;
    }

    public Integer getIndex() {
        return index;
    }

    public String getTag(){
        return tag;
    }

    public String getMarkerIcon() { return markerIcon; }

    public Double getMarkerIconDimension() { return markerIconDimension; }
}

