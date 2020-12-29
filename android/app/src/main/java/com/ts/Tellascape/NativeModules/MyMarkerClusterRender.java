package com.ts.Tellascape.NativeModules;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.DisplayMetrics;
import android.view.LayoutInflater;
import android.view.View;

import androidx.core.content.res.ResourcesCompat;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.maps.android.clustering.Cluster;
import com.google.maps.android.clustering.ClusterManager;
import com.google.maps.android.clustering.view.DefaultClusterRenderer;
import com.google.maps.android.ui.IconGenerator;
import com.ts.Tellascape.R;

import java.lang.reflect.Field;

public class MyMarkerClusterRender extends DefaultClusterRenderer<MyClusterItem> {
    public Context mContext;

    private IconGenerator mIconGenerator;

    public MyMarkerClusterRender(Context context, GoogleMap map, ClusterManager<MyClusterItem> clusterManager) {
        super(context, map, clusterManager);
        mContext = context;
        mIconGenerator = new IconGenerator(mContext);
    }

    public static int getResId(String resName, Class<?> c) {
        try {
            Field idField = c.getDeclaredField(resName);
            return idField.getInt(idField);
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    @Override
    protected void onBeforeClusterItemRendered(MyClusterItem item, MarkerOptions markerOptions) {
        int resID = getResId(item.getMarkerIcon(), R.drawable.class); // or other resource class
        BitmapDrawable bitmapdraw = (BitmapDrawable) ResourcesCompat.getDrawable(mContext.getResources(), resID, null);
        Bitmap b = bitmapdraw.getBitmap();

        // get device width
        DisplayMetrics displayMetrics = mContext.getResources().getDisplayMetrics();
        int iconDim = (int)(displayMetrics.widthPixels * item.getMarkerIconDimension() / 100);

        Bitmap smallMarker = Bitmap.createScaledBitmap(b, iconDim, iconDim, false);
        markerOptions.icon(BitmapDescriptorFactory.fromBitmap(smallMarker));
    }

    @Override
    protected void onBeforeClusterRendered(Cluster<MyClusterItem> cluster, MarkerOptions markerOptions) {
        Drawable marker = mContext.getResources().getDrawable(R.drawable.bg_transparent);
        mIconGenerator.setBackground(marker);

        LayoutInflater myInflater = (LayoutInflater)mContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View contentView = myInflater.inflate(R.layout.clusterview, null, false);
        mIconGenerator.setContentView(contentView);
        Bitmap icon = mIconGenerator.makeIcon(String.valueOf(cluster.getSize()));
        markerOptions.icon(BitmapDescriptorFactory.fromBitmap(icon));

    }
}
