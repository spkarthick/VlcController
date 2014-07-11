package com.example.vlccontroller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.Socket;
import java.net.URL;
import java.net.UnknownHostException;

import android.app.Activity;
import android.content.Context;
import android.speech.tts.TextToSpeech;
import android.util.Base64;
import android.widget.Toast;

public class JavascriptInterface {
	Context mContext;
	public Activity act;
	TtsEngine mTts;
    /** Instantiate the interface and set the context */
	JavascriptInterface(Context c,Activity a) {
        mContext = c;
        act=a;
    }
	@android.webkit.JavascriptInterface
    public void makeToast(String msg)
    {
    	Toast.makeText(mContext, msg,Toast.LENGTH_SHORT).show();
    }
	@android.webkit.JavascriptInterface
    public void initSpeech()
	{
		mTts = new TtsEngine(mContext,act);
	}

	@android.webkit.JavascriptInterface
    public static void sendCommand(String data)
	{
		Socket s;
		String details="";
		try {
		s = new Socket(MainActivity.url, 15000);
		String message = data;
    	 PrintWriter outp = null;
         outp=new PrintWriter(s.getOutputStream(),true);
         outp.write(message);
         outp.flush();
         BufferedReader inp = new BufferedReader(new InputStreamReader(s.getInputStream()));
         }
		catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}@android.webkit.JavascriptInterface
    public static String wakeServer()
	{
		String ipStr = "255.255.255.255";
	    String macStr = "00-22-4D-9D-9D-73";

	    try {
	        byte[] macBytes = getMacBytes(macStr);
	        byte[] bytes = new byte[6 + 16 * macBytes.length];
	        for (int i = 0; i < 6; i++) {
	            bytes[i] = (byte) 0xff;
	        }
	        for (int i = 6; i < bytes.length; i += macBytes.length) {
	            System.arraycopy(macBytes, 0, bytes, i, macBytes.length);
	        }

	        InetAddress address = InetAddress.getByName(ipStr);
	        DatagramPacket packet = new DatagramPacket(bytes, bytes.length, address, 9);
	        DatagramSocket socket = new DatagramSocket();
	        socket.send(packet);
	        socket.close();
	        try {
	        	DatagramSocket lis = new DatagramSocket(6000,address);
	        	byte[] data1 = new byte[10];
	        	lis.setBroadcast(true);
				lis.receive(new DatagramPacket(data1, 2));
				lis.close();
				MainActivity.webview.reload();
	             }
	    		catch (IOException e) {
	    			// TODO Auto-generated catch block
	    			e.printStackTrace();
	    		}
	    }
	    catch (Exception e) {
	    }
	    return "yes";
	}
	private static byte[] getMacBytes(String macStr) throws IllegalArgumentException {
	    byte[] bytes = new byte[6];
	    String[] hex = macStr.split("(\\:|\\-)");
	    if (hex.length != 6) {
	        throw new IllegalArgumentException("Invalid MAC address.");
	    }
	    try {
	        for (int i = 0; i < 6; i++) {
	            bytes[i] = (byte) Integer.parseInt(hex[i], 16);
	        }
	    }
	    catch (NumberFormatException e) {
	        throw new IllegalArgumentException("Invalid hex digit in MAC address.");
	    }
	    return bytes;
	}
}
