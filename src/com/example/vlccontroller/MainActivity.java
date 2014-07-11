package com.example.vlccontroller;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;

import com.example.vlccontroller.R;

import android.R.string;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Handler;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.util.Base64;
import android.view.KeyEvent;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;


public class MainActivity extends Activity {
	 static WebView webview;
	 static Context mContext;
	 static Activity mActivity;
	 static String url="";
	 static HashMap<String, String> map;
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			mContext=this;
			mActivity=this;
			setContentView(R.layout.activity_main);
			webview = (WebView)findViewById(R.id.webviewviz);
			webview.getSettings().setJavaScriptEnabled(true);
			webview.addJavascriptInterface(new JavascriptInterface(this,this), "jarviz");
			webview.setWebChromeClient(new WebChromeClient());
			ConnectivityManager cm = (ConnectivityManager) mContext.getSystemService(Context.CONNECTIVITY_SERVICE);
		    NetworkInfo net= cm.getActiveNetworkInfo();
			webview.loadUrl("file:///android_asset/index.htm");
			getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);
		}
		public static void startListener() throws InterruptedException
		{
			webview.loadUrl("javascript:readyEvent()");
			new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                	Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        			intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        		    intent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, mContext.getPackageName());
        		    intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
        		    mActivity.startActivityForResult(intent, 123);
                }
            }, 5000);
		}
		@Override
		protected void onActivityResult(int requestCode, int resultCode, Intent data) {
			if(requestCode==123)
			{
				if(resultCode == RESULT_OK){
					ArrayList<String> textMatchList = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
					if(textMatchList.get(0).equalsIgnoreCase("password"))
						webview.loadUrl("javascript:loginSuccess()");
					else
						webview.loadUrl("javascript:loginFail()");
				}
			}
		}
		@Override
		public void onDestroy()
		{ 
			super.onDestroy();
		}
		@Override
	    public boolean onKeyDown(int keyCode, KeyEvent event) {
	        if(event.getAction() == KeyEvent.ACTION_DOWN){
	            switch(keyCode)
	            {
	            case KeyEvent.KEYCODE_BACK:
	                if(webview.canGoBack()){
	                	webview.goBack();
	                }else{
	                    finish();
	                }
	                return true;
	            case KeyEvent.KEYCODE_VOLUME_UP:
	                	webview.loadUrl("javascript:increaseVolume()");
	                return true;
	            case KeyEvent.KEYCODE_VOLUME_DOWN:
	            	webview.loadUrl("javascript:decreaseVolume()");
	                return true;
	            }

	        }
	        return super.onKeyDown(keyCode, event);
	    }
	}
