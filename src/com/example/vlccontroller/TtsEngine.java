package com.example.vlccontroller;

import java.util.Locale;

import android.content.Context;
import android.content.Intent;
import android.speech.RecognizerIntent;
import android.speech.RecognizerResultsIntent;
import android.speech.tts.TextToSpeech;
import android.webkit.WebView;
import android.app.Activity;
import android.speech.tts.TextToSpeech.OnInitListener;

public class TtsEngine implements OnInitListener {
	public TextToSpeech tts;
	public Activity act;
	Context mContext;
	SttEngine st;
	public TtsEngine(Context context,Activity a)
	{
		mContext=context;
		act=a;
		tts= new TextToSpeech(mContext,this);
		tts.setSpeechRate(1);
		tts.setLanguage(Locale.ENGLISH);
		st=new SttEngine(mContext, act);
	}
	@Override
	public void onInit(int status) {
		// TODO Auto-generated method stub
		try {
			MainActivity.startListener();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
