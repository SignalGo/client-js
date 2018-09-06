# client-js
signalGo client version for javascript

# SignalGo client-net
signalGo client version for .Net framework

SignalGo is a library for Cross-Platform developers that makes it incredibly simple to add real-time web functionality to your applications. What is "real-time web" functionality? It's the ability to have your server-side code push content to the connected clients as it happens, in real-time. like WCF and SignalR

## Features:
  1. Send and receive any data like class,object,parameters,methods,return types
  2. Return data from a method (client and server)
  3. Support priority system
  4. Support $id and $ref for json and objects
  5. Auto Reconnect
and other fetures...

### Quick Usage JavaScript Client-Side:

```js
<<<<<<< HEAD
         var provider = new ClientProvider();
        var service;
        var setting = new ConnectionSettings();
        provider.InitializeConnectionSettings(setting);
        setting.addPriorityFunction(function () {
            return provider.RegisterService('ServiceName', ['HelloWorld', 'Sum'], function (providerService) {
                service = providerService;
            });
        });
        setting.addPriorityFunction(function () {
            return service.HelloWorld("ali", function (x) {
                console.log(x);
            });
        });
        setting.addPriorityFunction(function () {
            return service.Sum(11, 12, function (x) {
                console.log(x);
            });
        });
        provider.Connect('ws://localhost:9752/SignalGoTestService', provider, function () {
        });
        var callback = provider.RegisterCallbackService("CallbackServiceName");
        callback.ReceivedMessage = function (response) {
            console.log("ReceivedMessage is called: " + response);
=======
    function Test() {
        var provider = new ClientProvider();
       
        var setting = new ConnectionSettings();

        provider.InitializeConnectionSettings(setting);
		var service = provider.RegisterService('HealthFamilyService', ['HelloWorld', 'Sum']);
		//priority functions always run after connect before call anything
		//this help you for login method etc
        setting.addPriorityFunction(function () {
            return service.HelloWorld("ali", function (x) {
                console.log("priority: " + x);
            });
        });
        setting.addPriorityFunction(function () {
            return service.Sum(11, 12, function (x) {
                console.log("priority: " + x);
            });
        });

        provider.Connect('ws://localhost:9752/SignalGoTestService', provider, function () {
			//after connect
			//HealthFamilyService is your service name and HelloWorld and Sum is your service methods
			
			service.HelloWorld("ali", function (x) {
					console.log(x);
			});
        });
		

		//HealthFamilyClientService is your client service servicename
        var callback = provider.RegisterCallbackService("HealthFamilyClientService");
		//ReceivedMessage is your method name and name , family is your method parameters
        callback.ReceivedMessage = function (name,family) {
            console.log("ReceivedMessage is called: name=" + name + " family="+family);
			//result of your client method to server
			return "welcome to client method!";
>>>>>>> 498e21ef8edf097ddb2d4547e3907d052c2a7b1a
        };

}

```

# Full Sample: 
https://github.com/SignalGo/client-js/blob/master/index.html

## Install package from nuget:

Install-Package SignalGo.JavaScript.Client


# Pull Requests
I welcome all pull requests from you guys.Here are 3 basic rules of your request:
  1. Match coding style (braces, spacing, etc.)
  2. If its a feature, bugfix, or anything please only change code to what you specify.
  3. Please keep PR titles easy to read and descriptive of changes, this will make them easier to merge :)

  
## Other source on github
  1. [.Net Framework full client and server of SignalGo](https://github.com/SignalGo/SignalGo-full-net)
  2. [Java Client](https://github.com/SignalGo/client-java)
  

# Maintained By
[Seyed Abbas Seyedi](https://github.com/seyedabbasseyedi)

[Ali Yousefi](https://github.com/Ali-YousefiTelori) [Blog](http://framesoft.ir)
