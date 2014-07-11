package com.example.vlccontroller;

import java.util.ArrayList;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.support.v4.app.ServiceCompat;
import android.webkit.WebView;

public class SttEngine {
public Activity act;
public Context mContext;
	public SttEngine(Context mtContext,Activity mActivity)
	{
		mContext=mtContext;
		act=mActivity;
		
	}

}
