package com.weddlysmartdesign.guestmobile;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

public class MainActivity extends Activity {
    private static final int PICK_CENTER = 1001;
    private static final int PICK_UPLOAD = 1002;
    private static final String CENTER_NAME = "guest_mobile_center.html";
    private FrameLayout root;
    private WebView webView;
    private ValueCallback<Uri[]> uploadCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(245,239,231));
        setContentView(root);
        if (centerFile().exists()) showCenter();
        else showFirstImport();
    }

    private File centerFile() {
        return new File(getFilesDir(), CENTER_NAME);
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private GradientDrawable rounded(int color, int radiusDp) {
        GradientDrawable d = new GradientDrawable();
        d.setColor(color);
        d.setCornerRadius(dp(radiusDp));
        return d;
    }

    private void showFirstImport() {
        root.removeAllViews();
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(28), dp(36), dp(28), dp(28));
        box.setGravity(Gravity.CENTER_VERTICAL);
        root.addView(box, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        TextView brand = new TextView(this);
        brand.setText("GUEST · WeddlySmartDesign");
        brand.setTextSize(15);
        brand.setLetterSpacing(.12f);
        brand.setTextColor(Color.rgb(128,105,92));
        box.addView(brand);

        TextView title = new TextView(this);
        title.setText("Tu centro de trabajo GUEST");
        title.setTextSize(34);
        title.setTextColor(Color.rgb(68,56,49));
        title.setPadding(0, dp(18), 0, dp(12));
        box.addView(title);

        TextView body = new TextView(this);
        body.setText("Solo la primera vez: selecciona el archivo GUEST_MOBILE_CENTER_V2.html que has descargado. La app lo guardará dentro del teléfono y, a partir de ahí, entrarás siempre desde este icono.");
        body.setTextSize(18);
        body.setLineSpacing(0, 1.25f);
        body.setTextColor(Color.rgb(100,88,80));
        box.addView(body);

        Button importBtn = new Button(this);
        importBtn.setText("Elegir GUEST Mobile Center");
        importBtn.setTextSize(17);
        importBtn.setTextColor(Color.WHITE);
        importBtn.setAllCaps(false);
        importBtn.setBackground(rounded(Color.rgb(75,64,57), 18));
        LinearLayout.LayoutParams ip = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(62));
        ip.topMargin = dp(30);
        box.addView(importBtn, ip);
        importBtn.setOnClickListener(v -> pickCenter());
    }

    private void pickCenter() {
        Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("text/html");
        i.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"text/html", "text/plain", "application/xhtml+xml"});
        startActivityForResult(i, PICK_CENTER);
    }

    private void importCenter(Uri uri) throws Exception {
        try (InputStream in = getContentResolver().openInputStream(uri);
             FileOutputStream out = new FileOutputStream(centerFile(), false)) {
            if (in == null) throw new IllegalStateException("No se pudo abrir el archivo.");
            byte[] buf = new byte[64 * 1024];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
        }
    }

    private void configureWebView() {
        webView = new WebView(this);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (uploadCallback != null) uploadCallback.onReceiveValue(null);
                uploadCallback = callback;
                try {
                    startActivityForResult(params.createIntent(), PICK_UPLOAD);
                    return true;
                } catch (Exception e) {
                    uploadCallback = null;
                    Toast.makeText(MainActivity.this,
                            "No se pudo abrir el selector de archivos.", Toast.LENGTH_LONG).show();
                    return false;
                }
            }
        });
    }

    private void showCenter() {
        root.removeAllViews();
        configureWebView();
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        webView.loadUrl(Uri.fromFile(centerFile()).toString());

        TextView tools = new TextView(this);
        tools.setText("⋮");
        tools.setGravity(Gravity.CENTER);
        tools.setTextSize(28);
        tools.setTextColor(Color.WHITE);
        tools.setBackground(rounded(Color.argb(225,75,64,57), 24));
        FrameLayout.LayoutParams tp = new FrameLayout.LayoutParams(dp(48), dp(48),
                Gravity.TOP | Gravity.END);
        tp.setMargins(0, dp(54), dp(10), 0);
        root.addView(tools, tp);
        tools.setElevation(dp(12));
        tools.setOnClickListener(v -> showNativeMenu());
    }

    private void showNativeMenu() {
        String[] options = new String[]{"Recargar", "Actualizar centro", "Cerrar app"};
        new AlertDialog.Builder(this)
                .setTitle("GUEST Mobile Center")
                .setItems(options, (dialog, which) -> {
                    if (which == 0 && webView != null) webView.reload();
                    else if (which == 1) pickCenter();
                    else if (which == 2) finish();
                })
                .show();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_CENTER) {
            if (resultCode == RESULT_OK && data != null && data.getData() != null) {
                try {
                    importCenter(data.getData());
                    Toast.makeText(this, "Centro GUEST guardado en la app.",
                            Toast.LENGTH_SHORT).show();
                    showCenter();
                } catch (Exception e) {
                    Toast.makeText(this, "No se pudo importar: " + e.getMessage(),
                            Toast.LENGTH_LONG).show();
                }
            }
            return;
        }
        if (requestCode == PICK_UPLOAD) {
            if (uploadCallback == null) return;
            Uri[] result = null;
            if (resultCode == RESULT_OK && data != null) {
                if (data.getClipData() != null) {
                    int count = data.getClipData().getItemCount();
                    result = new Uri[count];
                    for (int i = 0; i < count; i++) {
                        result[i] = data.getClipData().getItemAt(i).getUri();
                    }
                } else if (data.getData() != null) {
                    result = new Uri[]{data.getData()};
                }
            }
            uploadCallback.onReceiveValue(result);
            uploadCallback = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
}
