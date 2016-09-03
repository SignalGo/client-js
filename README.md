# client-js
signalGo client version for javascript

# SignalGo client-net
signalGo client version for .Net framework

SignalGo is a library for Cross-Platform developers that makes it incredibly simple to add real-time web functionality to your applications. What is "real-time web" functionality? It's the ability to have your server-side code push content to the connected clients as it happens, in real-time. like WCF and SignalR

##Features:
  1. Send and receive any data like class,object,parameters,methods,return types
  2. Return data from a method (client and server)

and other fetures...

###Quick Usage JavaScript Client-Side:

```js
    function Test() {
    var provider = new ClientProvider();
    provider.Connect('ws://localhost:5648/FamilyDeskServices', provider, function () {
        provider.RegisterService("FamilyDeskService", function (service) {
            //call server SendMessage method by two parameters
            service.Send("SendMessage", { Text: "ali" }, new Array(), function (value) {
                console.log("send message ok");
            });
            console.log("register method called");
        });

        var callback = provider.RegisterCallbackSerice("FamilyDeskCallback");

        callback.ReceivedMessage = function (response) {
            console.log("ReceivedMessage is called");
        };
        callback.Test = function (a,b) {
            console.log("Test is called");
            //if you want return value to server
            return 556;
        };
    });

}

```
##Install package from nuget:

Install-Package SignalGo.JavaScript.Client


# Pull Requests
I welcome all pull requests from you guys.Here are 3 basic rules of your request:
  1. Match coding style (braces, spacing, etc.)
  2. If its a feature, bugfix, or anything please only change code to what you specify.
  3. Please keep PR titles easy to read and descriptive of changes, this will make them easier to merge :)

  
## Other source on github
  1. [.Net Framework Client Side](https://github.com/SignalGo/client-net)
  2. [.Net Framework Server side](https://github.com/SignalGo/server-net)
  3. [Java Client](https://github.com/SignalGo/server-net)
  

# Maintained By
[Seyed Abbas Seyedi](https://github.com/seyedabbasseyedi)

[Ali Yousefi](https://github.com/hamishebahar)

[Blog](http://framesoft.ir)
