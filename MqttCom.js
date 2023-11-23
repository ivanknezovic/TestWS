
const xValues = [1,2,3,4,5,6,7,8,9,10, 11,12,13,14,15,16,17,18,19,20, 21,22,23,24,25,26,27,28,29,30, 31,32,33,34,35,36,37,38,39,40, 41,42,43,44,45,46,47,48,49,50, 
				51,52,53,54,55,56,57,58,59,60, 61,62,63,64,65,66,67,68,69,70,  71,72,73,74,75,76,77,78,79,80,  81,82,83,84,85,86,87,88,89,90,  91,92,93,94,95,96,97,98,99,];
const yValues = [1,2,3,4,5,6,7,8,9,10, 11,12,13,14,15,16,17,18,19,20, 21,22,23,24,25,26,27,28,29,30, 31,32,33,34,35,36,37,38,39,40, 41,42,43,44,45,46,47,48,49,50, 
				51,52,53,54,55,56,57,58,59,60, 61,62,63,64,65,66,67,68,69,70,  71,72,73,74,75,76,77,78,79,80,  81,82,83,84,85,86,87,88,89,90,  91,92,93,94,95,96,97,98,99,];
const IDArry = [];
const IDArryOnlyIDS = [];
	

	function onConnectionLost(){
	console.log("connection lost");
	document.getElementById("status").innerHTML = "Connection Lost";
	document.getElementById("status_messages").innerHTML ="Connection Lost";
	connected_flag=0;
	}
	function onFailure(message) {
		console.log("Failed");
		document.getElementById("status_messages").innerHTML = "Connection Failed- Retrying";
        setTimeout(MQTTconnect, reconnectTimeout);
        }
	function onPageLoad(message) {
			console.log("OnPage load");
			MQTTconnect();
			}
		//Message arrived-update page elemnts
	function onMessageArrived(r_message){
		out_msg="Message received "+r_message.payloadString;
		out_msg=out_msg+"      Topic "+r_message.destinationName +"<br/>";
		out_msg="<b>"+out_msg+"</b>";
		//console.log(out_msg+row);
		
		var topic_filtered=topicFilter(r_message.destinationName);
		var val= valueFilter(topic_filtered,r_message.payloadString);
		var typed= typeFilter(topic_filtered);
		try{
			//document.getElementById("out_messages").innerHTML+=out_msg;	
			document.getElementById("out_messages").innerHTML=out_msg;	
			
			if(typed.includes("input"))
				document.getElementById(topic_filtered).value = val;
			else if (typed.includes("button"))				
				setButtonState(topic_filtered,val);	
			else
				document.getElementById(topic_filtered).innerHTML = val;	
				
			if(topic_filtered.includes("Profile"))
			{
				var tg=r_message.payloadBytes;
				WriteWDRProf(r_message.payloadBytes);
				
			}	
		}
		catch(err){
		document.getElementById("out_messages").innerHTML=err.message;
		}	

		// if (row==10){
		// 	row=1;
		// 	document.getElementById("out_messages").innerHTML=out_msg;
		// 	}
		// else
		// 	row+=1;
			
		// mcount+=1;
		// console.log(mcount+"  "+row);
		}
		
	function onConnected(recon,url){
	console.log(" in onConnected " +reconn);	
	}
	function onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	document.getElementById("status_messages").innerHTML ="Connected to "+host +"on port "+port;
	connected_flag=1;
	document.getElementById("status").innerHTML = "Connected";
	console.log("on Connect "+connected_flag);
	sub_topics();
	send_message_mqtt_initialisation();
	}
	function disconnect()
	{
		if (connected_flag==1)
			mqtt.disconnect();
	}
	//Connect MQTT Server
    function MQTTconnect() {
	var clean_sessions=document.forms["connform"]["clean_sessions"].value;
	var user_name=document.forms["connform"]["username"].value;
	console.log("clean= "+clean_sessions);
	var password=document.forms["connform"]["password"].value;
	
	if (clean_sessions=document.forms["connform"]["clean_sessions"].checked)
		clean_sessions=true
	else
		clean_sessions=false

	document.getElementById("status_messages").innerHTML ="";
	var s = document.forms["connform"]["server"].value;
	var p = document.forms["connform"]["port"].value;
	if (p!="")
	{
		port=parseInt(p);
		}
	if (s!="")
	{
		host=s;
		console.log("host");
		}

	console.log("connecting to "+ host +" "+ port +"clean session="+clean_sessions);
	console.log("user "+user_name);
	document.getElementById("status_messages").innerHTML='connecting';
	var x=Math.floor(Math.random() * 10000); 
	var cname="orderform-"+x;
	mqtt = new Paho.MQTT.Client("wss://93.240.89.1:9001/mqtt",port,cname);
	//document.write("connecting to "+ host);
	var options = {
        timeout: 3,
		cleanSession: clean_sessions,
		onSuccess: onConnect,
		onFailure: onFailure,
      
     };
	 if (user_name !="")
		options.userName=document.forms["connform"]["username"].value;
	if (password !="")
		options.password=document.forms["connform"]["password"].value;
	
        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;
		mqtt.onConnected = onConnected;

	mqtt.connect(options);
	
	findAllId();
	
	return false;
  
	}
	//Subscribe topics
	function sub_topics(){
		document.getElementById("status_messages").innerHTML ="";
		// if (connected_flag==0){
		// out_msg="<b>Not Connected so can't subscribe</b>"
		// console.log(out_msg);
		// document.getElementById("status_messages").innerHTML = out_msg;
		// return false;
		// }
	// var stopic= document.forms["subs"]["Stopic"].value;
	// console.log("here");
	// var sqos=parseInt(document.forms["subs"]["sqos"].value);
	
	// if (sqos>2)
	// 	sqos=0;

	var sqos=0;
	// console.log("Subscribing to topic ="+stopic +" QOS " +sqos);
	// document.getElementById("status_messages").innerHTML = "Subscribing to topic ="+stopic;
	var soptions={
	qos:sqos
	};
	//mqtt.subscribe(stopic,soptions);
	 
	IDArry.forEach((element) => {
		mqtt.subscribe( topicFilterRet( element[0]),soptions);
		console.log("Subscribing to topic ="+topicFilterRet( element[0]) +" QOS " +sqos)
	}); //Subscribe all alementts with ID
	return false;
	}
	//Send message
	function send_message(){
		document.getElementById("status_messages").innerHTML ="";
		if (connected_flag==0){
		out_msg="<b>Not Connected so can't send</b>"
		console.log(out_msg);
		document.getElementById("status_messages").innerHTML = out_msg;
		return false;
		}
		var pqos=parseInt(document.forms["smessage"]["pqos"].value);
		if (pqos>2)
			pqos=0;
		var msg = document.forms["smessage"]["message"].value;
		console.log(msg);
		document.getElementById("status_messages").innerHTML="Sending message  "+msg;

		var topic = document.forms["smessage"]["Ptopic"].value;
		//var retain_message = document.forms["smessage"]["retain"].value;
		if (document.forms["smessage"]["retain"].checked)
			retain_flag=true;
		else
			retain_flag=false;
		message = new Paho.MQTT.Message(msg);
		if (topic=="")
			message.destinationName = "test-topic";
		else
			message.destinationName = topic;
		message.qos=pqos;
		message.retained=retain_flag;
		mqtt.send(message);
		return false;
	}
	//Send message only to mqtt to topic=element id (this function only for input fields(numeric, string...))
	function send_message_mqtt(ID){			
		var msg=valueFilter(ID, document.getElementById(ID).value);
		send_message_mqtt_cmd(ID, msg)
		return false;
	}
	//Send message only to mqtt to topic=element id
	function send_message_mqtt_cmd(ID, msg){		

		if (connected_flag==0){
		out_msg="<b>Not Connected so can't send</b>"
		console.log(out_msg);
		document.getElementById("status_messages").innerHTML = out_msg;
		return false;
		}

		if(msg==null)
			return false;

		//var msg=valueFilter(ID, document.getElementById(ID).value);
		var pqos=0;
		var topic = topicFilterRet(ID);
		

		message = new Paho.MQTT.Message(msg);
		if (topic=="") return;
		if (msg=="") return;

		//message.destinationName = "/HTML/" + document.getElementById(ID).accessKey.toString()  +  topic;
		message.destinationName = "/HTML/" +  topic;			
		message.qos=pqos;
		message.payloadString=msg ;
		mqtt.send(message);
		return false;

	}
	//Send all topic=element for initaialisation
	function send_message_mqtt_initialisation(){		
		var pqos=0;
		var msg=IDArryOnlyIDS.join(";");

		messageINIT = new Paho.MQTT.Message(msg);
		messageINIT.destinationName = "/HTML/INIT/" ;			
		messageINIT.qos=pqos;
		messageINIT.payloadString=msg ;
		mqtt.send(messageINIT);
		return false;

	}
	//Find all IDs of document
	function findAllId() {  
            $("*").each(function() {
                if ((this.id) && (this.accessKey))  //Nehme nur die die eien ID und AccessKey haben
				{
					var arr = [ this.id, document.getElementById(this.id).accessKey,""];
					var keywords = document.getElementById(this.id).accessKey.split('~');  //Split AccesKey with ~  1. numeric typ 2. Type Input, Output..
					if(keywords.length>1)						
						arr = [ this.id, keywords[0], keywords[1]];
					if(keywords.length>2)						
						arr = [ this.id, keywords[0], keywords[1], keywords[2]];
					if(keywords.length>3)						
						arr = [ this.id, keywords[0], keywords[1], keywords[2], keywords[3], keywords[3]];		  ///Id, filter case,type, set value, reset value, actual value			

					IDArry.push(arr );	  
					IDArryOnlyIDS.push(this.id);	 
					//var test=document.getElementById(this.id);
                }
            });	
			//var ss=valueFilter("/OpcUaClient1/ns=3~s=AirConditioner_1.Temperature","33,3");
		}
		//Topic filter , Decimals, point instead komma
		function topicFilter( top ) {           
		var topic_filtered=(top.replace(";","~"));  //In Topic no Semikolon-> replace with ~ 
         return topic_filtered;         
      	}
		function topicFilterRet( top ) {           
		var topic_filtered=(top.replace("~",";"));  //Return-In Topic no Semikolon-> replace with ~ 
         return topic_filtered;         
      	}
		//Value filter, Decimals, point instead komma
		function valueFilter(top, val ) {  
			
			if(IDArryOnlyIDS.includes(top))
			{
				var FilterCase;
				var valFilt=val;
				var IDElement;
				var ResVal=0;

				IDArry.forEach((element) => {
  				if(element[0]==top)
				{
				if(element[1])
					FilterCase=element[1];

					IDElement=element;
				}				
				});

				switch (FilterCase) {
				// case 'num_1d':  valFilt= (parseFloat(String(val))).toFixed(1); break;  //No komma and decimals
  				// case 'num_2d':  valFilt= (parseFloat(String(val))).toFixed(2); break;//No komma and decimals
				// case 'num_3d':  valFilt= (parseFloat(String(val))).toFixed(3); break;
				// case 'num':  valFilt= (parseInt(String(val))).toFixed(0); break;
				case 'num_1d':  valFilt= (Number(val.replace(",","."))).toFixed(1); break;  //No komma and decimals
  				case 'num_2d':  valFilt= (Number(val.replace(",","."))).toFixed(2); break;  //No komma and decimals
				case 'num_3d':  valFilt= (Number(val.replace(",","."))).toFixed(3); break;
				case 'num':  valFilt= (Number(val.replace(",","."))).toFixed(0); break;
  				default:return valFilt=val;
				}	
				return valFilt;
			}
			
         return val;         
      	}

		//Type filter, Check if Input, Output, button, Form..
		function typeFilter(top) {  
			
			var val="";
			if(IDArryOnlyIDS.includes(top))
			{	
				IDArry.forEach((element) => {
  				if(element[0]==top)
				{
				if(element[2])
					val=element[2];
				}				
				});
			}
			
         return val;         
      	}

	//Button click down
	function button_click_down(ID){
		after_button_click(ID, false);
	}	
	//Button click down
	function button_click_up(ID){	
		after_button_click(ID, true);
	}	
	//After Button click
	function after_button_click(ID, click_up){		
		if(IDArryOnlyIDS.includes(ID))
			{	
				var topic = topicFilterRet(ID);
				var valFilt;
				IDArry.forEach((element) => {
				 if(element[0]==topic)
				  	{
					  if ((element.length >4) )
						{	
							if(element[2]=="button")  			//is that button ?
							{
								if	(element[1]=="Set")			//If set button -> Reset on mouse up (only ona as long pushed)
								{
									if(click_up)				//Is mouse up click->reset set button
									valFilt= element[4];		//button reset value
								}
								else if(element[1]=="SetReset")
								{
									if(click_up)	
										return false;

									if(element[5]==element[3])//Button is allready on	 ->reset
										element[5]= element[4];	//button reset value
										else							//Button ioff	 ->set on							
										element[5]= element[3];	//button set value	
								}
							}								
						}
						send_message_mqtt_cmd(ID,element[5]);
						setButtonState(ID,null);
						return false;
					}				
				});
			}			
			return false;	
	}
		//Set button State- green=Set  transparent =reset
		function setButtonState(topic, newVal ) { 
			if(IDArryOnlyIDS.includes(topic))
			{	

				IDArry.forEach((element) => {
					if(element[0]==topic)
						 {
						 if ((element.length >4) )
						   {	
								if (newVal!=null)					//New value is sent otherwise take last
									element[5]=newVal

								if(element[5]==element[3])			//Button is on	
									document.getElementById(topic).style.background="green";
								else
									document.getElementById(topic).style.background="lightgray"	;									
						   }
						   return false;
					   }				
				   });
			}	
			
			

			





		}

		function WriteWDRProf(array) {
			for (var i = 0; i < 100; i++) 
			 {
				yValues[i] = readFloatFromBytes(bytes, i * 4);
			  }
			
		}
