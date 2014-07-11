
//Global Variables
$.mobile.hashListeningEnabled = false;
$.mobile.pushStateEnabled = false;
seektotal=5+(3*60);
seekorgvalue=0;
audiofileformats=[".mp3",".wav"];
videofileformats=[".mp4",".avi",".flv",".mkv"];
fileformats=audiofileformats;
prev="";
openVlc();
window.addEventListener('popstate', function(evt) {
	if(typeof(currentPath) != "undefined")
	{
		var path=currentPath+"/..";
		if(currentPath.split("/").length >1)
			currentPath=currentPath.replace("/"+currentPath.split("/").pop(),"");
		else
			currentPath=undefined;
	}
	else
		var path="";
	
		if($("#mainpage").is(":visible"))
		{
			sendAjaxRequest("browse.json","dir="+path,renderDirList);
		}
		else if(!$("#powerscreen").is(":visible"))
		{
			$.mobile.changePage($("#mainpage"),{transition:"slidedown"});
		}
	});
//Initial Event Bindings
$(function(){
//$(".powerbutton").bind("touchend",function(){
	//wakeServer();
//});
	//Pre Render all Pages
	$.mobile.loadPage("#mainpage");
	$.mobile.loadPage("#nowplaying");
	//Capture invalid image url
	
	$(".mediaart img,img.coverpage").error(function(e){
	$(".mediaart").addClass("emptyart");
		$(".mediaart img,img.coverpage").css({"display":"none"});
	});
	
	//Avoid Page scrolling on panel scroll
	
	$("#playlist").on("panelopen", function (event, ui) { 
        $('body').css("overflow", "hidden");
    });
    $("#playlist").on("panelclose", function (event, ui) { 
        $('body').css("overflow", "auto");
    });
	
	//Flag variables
	
	tapholdfired=false,moved=false;
	
	
	
	$("#playlistlist").bind("tap",function(evt){
	if(!tapholdfired){
	sendAjaxRequest("status.json","command=pl_play&id="+$(evt.target).attr("data-id"),showToast);
	toastmessage="Now Playing "+$(evt.target).attr("data-name");
	}
	tapholdfired=false;
	});
	$("#playlistlist").bind("touchmove",function(){
		moved=true;
	});
	$("#playlistlist").bind("touchend",function(){
		moved=false;
	});
	$("#playlistlist").bind("taphold",function(evt){
	if(!moved)
	{
	$(evt.target).toggleClass("active");
	tapholdfired=true;
	}
	});
	
	$(".controlsdiv div").bind("touchend",function(e){
		toastmessage=$(e.target).attr("data-fn");
		if(toastmessage=="pause")
			$(e.target).toggleClass("pause");
		sendAjaxRequest("status.json","command=pl_"+toastmessage,showToast);
		
	});
	$(".seekfooter .ui-slider-handle,.seekfooter .ui-slider-track").bind("touchend",function(e){
		sendAjaxRequest("status.json","command=seek&val="+$("#seekbar").val());
	});
	var now = new Date();
	updateAlbumArt();
	$(".playtools li a").bind("tap",function(e){
	sendAjaxRequest("status.json","command="+$(e.target).attr("data-fn"));
		$(e.target).toggleClass("ui-btn-active");
	});
	$("#mediaplayer").bind("tap",function(e){
		$.mobile.changePage($("#nowplaying"),{transition:"slideup"});
		var stateobj={page:"currentplaying"};
			history.pushState({},"Now Playing","#currentplaying");
	});
	$(".fullscreenicon").hide();
});
function renderDirList(data)
{
$(".directorylist").empty();
var fileDir=JSON.parse(data);
for(i=1;i<fileDir.element.length;i++)
{
	var item=undefined;
	if(fileDir.element[i].type=="dir")
	{
		item=$("<div class='dirwrapper'><div class='directoryfolder'></div><div class='dirname'>"+fileDir.element[i].name.substring(0, 20)+"</div></div>");
		item.bind("tap",$.proxy(function(evt){
			sendAjaxRequest("browse.json","dir="+this.attr("data-path"),renderDirList);
			currentPath=this.attr("data-path");
			var state=this.attr("data-path").split("/").pop().replace("\\","");
			var stateobj={page:state};
			history.pushState({},state,"#"+state);
		},item));
	}
	else{
	for(it=0;it<fileformats.length;it++)
	{
	if(fileDir.element[i].name.toLowerCase().indexOf(fileformats[it]) != -1)
	{
		item=$("<div class='dirwrapper'><div class='addicon'></div><div class='playicon'></div><div class='directoryfile'></div><div class='dirname'>"+fileDir.element[i].name.substring(0, 20)+"</div></div>");
		item.bind("tap",$.proxy(function(evt){
			$(".dirwrapper").removeClass("itemactive");
			this.addClass("itemactive");
		},item));
	}
	}
	}
	$(".directorylist").append(item);
	if(item){
	for(var k in fileDir.element[i])
		item.attr("data-"+k,fileDir.element[i][k]);
	}
}
$(".addicon").bind("tap",function(evt){
	sendAjaxRequest("status.json","command=in_enqueue&input="+$(evt.target).closest(".dirwrapper").attr("data-uri"),showToast);
	toastmessage="Song added to playlist";
});
$(".playicon").bind("tap",function(evt){
	sendAjaxRequest("status.json","command=in_play&input="+$(evt.target).closest(".dirwrapper").attr("data-uri"),showToast);
	toastmessage="Song added to playlist";
	});
}
function dragIcons(evt){
			event.preventDefault();
			this.css({"left":evt.originalEvent.touches[0].pageX-65,"top":evt.originalEvent.touches[0].pageY-65});
		}
function sendAjaxRequest(file,param,callback,noPopup)
{
if(!noPopup)
$.mobile.loading('show');
if(param)
	newurl="http://192.168.1.20:5400/requests/"+file+"?"+param;
else
	newurl="http://192.168.1.20:5400/requests/"+file;
	$.ajax({
		url:newurl,
		success:callback,
		error:function(e){
			setError();
		},
		complete:noPopup?undefined:function(){
			$.mobile.loading('hide');
		}
		});
}
function showToast(data)
{
if(window.jarviz)
	window.jarviz.makeToast(toastmessage);
var now = new Date();
updateAlbumArt();
}
function showVolumeToast(data)
{
	
}
function getPlaylist()
{
	sendAjaxRequest("playlist.json",null,renderPlaylist);
}
function renderPlaylist(data)
{
	var playlist=JSON.parse(data);
	playlist=playlist.children[0].children;
	$("#playlistlist").empty();
	debugger;
	for(i=0;i<playlist.length;i++)
	{
	var item=$("<li>"+playlist[i].name+"</li>");
		for(var k in playlist[i])
			item.attr("data-"+k,playlist[i][k]);
		if(playlist[i]["current"])
			item.addClass("currentitem");
		$("#playlistlist").append(item);
		$("#playlistlist").listview("refresh");
	}
}
function decreaseVolume()
{
	sendAjaxRequest("status.json","command=volume&val=-20",showVolumeToast);
}
function increaseVolume()
{
	sendAjaxRequest("status.json","command=volume&val=+20",showVolumeToast);
}

function clearPlaylist()
{
	sendAjaxRequest("status.json","command=pl_empty",showToast);
	$("#playlistlist").empty();
	toastmessage="Playlist Cleared";
}
function removePlaylist()
{
	for(i=0;i<$("#playlistlist .active").length;i++){
		sendAjaxRequest("status.json","command=pl_delete&id="+$($("#playlistlist .active")[i]).attr("data-id"),showToast);
		}
	toastmessage="Songs Removed form playlist";
	$("#playlistlist .active").remove();
}

//update status
function refreshAll()
{
	sendAjaxRequest("playlist.json",null,function(data){
		var playll=JSON.parse(data).children[0].children;
		for(i=0;i<playll.length;i++)
		{
			if(playll[i].current)
			{
				$("#seekbar").attr({min:0,max:playll[i].duration});
				$("#seekbar").slider("refresh");
			}
		}
		sendAjaxRequest("status.json",null,updateAll,true);
	},true);
}
function returnDigit(value)
{
	if(Number(value)<10)
		return "0"+value;
	return value;
}
function updateAll(data){
	var status=JSON.parse(data);
	$("#seekbar").val(status.time);
	$("#seekbar").slider("refresh");
	var time=status.time;
	var hours = Math.floor(time / 3600);
	time = time - hours * 3600;
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	hours=returnDigit(hours.toString());
	minutes=returnDigit(minutes.toString());
	seconds=returnDigit(seconds.toString());
	if(hours != "00")
		$(".seektime").html(hours+":"+minutes+":"+seconds);
	else
		$(".seektime").html(minutes+":"+seconds);
	if(status.state == "stopped" || status.state == "paused")
		$(".play").removeClass("pause");
		$(".shuffle,.repeat,.loop").removeClass("ui-btn-active");
	if(status.random)
		$(".shuffle").addClass("ui-btn-active");
	if(status.repeat)
		$(".repeat").addClass("ui-btn-active");
	if(status.loop)
		$(".loop").addClass("ui-btn-active");
	else if(status.state == "playing")
	{
		$(".play").addClass("pause");
		$(".songname").html(status.information.category.meta.filename);
		$(".artistdetails").html(getDetails(status.information.category.meta));
		if(prev!=status.information.category.meta.filename)
		{
			prev=status.information.category.meta.filename;
			var now = new Date();
			updateAlbumArt();
		}
	}
	setTimeout(function(){
		refreshAll();
	},1000);
}
function getDetails(meta)
{
if(meta.artist && meta.title)
	return meta.artist+"-"+meta.title;
else if(meta.album && meta.title)
	return meta.artist+"-"+meta.title;
else if(meta.title)
	return meta.title;
return "Unknown Artist";
}

function getVideoFiles()
{
$(".fullscreenicon").show();
	fileformats=videofileformats;
	var path="";
	if(currentPath)
		path=currentPath;
	sendAjaxRequest("browse.json","dir="+path,renderDirList);
}

function getAudioFiles()
{
$(".fullscreenicon").hide();
fileformats=audiofileformats;
if(currentPath)
		path=currentPath;
	sendAjaxRequest("browse.json","dir="+path,renderDirList);
}

function setFullscreen()
{
	if(window.jarviz)
	sendAjaxRequest("status.json","command=fullscreen")
}

function updateAlbumArt()
{
var now = new Date();
$(".mediaart img,img.coverpage").attr("src","/art?timestamp=" + now.getTime());
$(".mediaart img,img.coverpage").css({"display":""});
$(".mediaart").removeClass("emptyart");
}
function setError()
{
	toastmessage="Oops !! unable to process your request";
	showToast();
}
function openVlc()
{
	$.ajax({
		url:"http://192.168.1.20:5400/requests/openvlc",
		success:function(e)
		{
		$.mobile.changePage($("#mainpage"),{transition:"slide"});
		//Load initial directory Content
		sendAjaxRequest("browse.json","dir=",renderDirList);
		refreshAll();
		},
		error:function(e){
			setVlcError();
		}
	});
}
function setVlcError()
{
	$(".powerproblem").show();
}
function wakeServer()
{
	$.mobile.loading('show');
	if(window.jarviz)
	{
	window.jarviz.wakeServer();
	}
	$.mobile.loading('hide');
}