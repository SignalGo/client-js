function byteArray2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function getFunctionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

function generateUUID() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

function toUTF16Array(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint8Array(buf, 0, str.length);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  var buffer = Array.from(bufView);
  for (var i = 0; i < buffer.length; i++) {
  }
  return buffer;
}

function Int32ToByteArray(/*long*/long) {
  // we want to represent the input as a 8-bytes array
  var byteArray = [0, 0, 0, 0];

  for (var index = 0; index < byteArray.length; index++) {
    var byte = long & 0xff;
    byteArray[index] = byte;
    long = (long - byte) / 256;
  }

  return byteArray;
};

function byteArrayToInt32(/*byte[]*/byteArray) {
  var value = 0;
  for (var i = byteArray.length - 1; i >= 0; i--) {
    value = (value * 256) + byteArray[i];
  }

  return value;
};
//--> example url:"ws://192.168.10.27:5648/FamilyDeskServices"
function toAbsoluteURL(url) {
  var splitUrl = url.split(":");//--> ws , //192.168.10.27 , 5648/FamilyDeskServices
  var urlPart3 = splitUrl[splitUrl.length - 1];//--> 5648/FamilyDeskServices
  var pathUrl = urlPart3.substring(urlPart3.indexOf("/"));//-->/FamilyDeskServices

  this.absoluteUrl = pathUrl;
  var lastPointPosition = url.lastIndexOf(":");
  for (var i = lastPointPosition; i < url.length; i++) {
    if (url[i] == '/') {
      endOfOriginUrl = i;
      break;
    }
  }
  this.Url = url.substring(0, endOfOriginUrl);
  return this;
}

//class for web socket
function ClientProvider() {
  var socket;
  var listOfMethodCallGuids;
  var listOfServices;
  var listOfCallbackServices;
  var segments = {};

  this.Connect = function (url, provider, onRegister, onError, onClose) {
    var result = toAbsoluteURL(url);
    //console.log(url);
    //console.log(result.absoluteUrl);
    listOfMethodCallGuids = {};
    listOfServices = {};
    listOfCallbackServices = {};
    socket = new WebSocket(result.Url);
    socket.binaryType = "arraybuffer";
    socket.onopen = function () {
      // Web Socket is connected, send data using send()
      provider.ConnectData(result.absoluteUrl);
      onRegister();
    };

    socket.onerror = function (error) {
      onError();
    };

    socket.onmessage = function (evt) {
      provider.GenerateResponseCall(evt.data);
    };

    socket.onclose = function (m) {
      console.log("// websocket is closed.");
      onClose();
    };
  };

  this.ConnectData = function (url) {
    var list = new Array();
    list.push(url);
    var json = JSON.stringify(list);
    socket.send(json);
  };

  this.RegisterService = function (serviceName, completeAction) {
    var call = GenerateCallInfo(generateUUID(), serviceName, "/RegisterService", null, null);
    var provider = this;
    listOfServices[serviceName] =
    {
      Send: function () {
        var methodName = arguments[0];
        var params = new Array();
        for (i = 1; i < arguments.length; i++) {
          var obj = new Object();
          if (isFunction(arguments[i]))
            break;
          if (arguments[i] != null)
            obj.Value = JSON.stringify(arguments[i]);
          params.push(obj);
        }
        var call = GenerateCallInfo(generateUUID(), serviceName, methodName, null, params);
        listOfMethodCallGuids[call.Guid] = { call: call, func: null, isRegister: false, serviceName: serviceName };
        if (isFunction(arguments[arguments.length - 1]))
          listOfMethodCallGuids[call.Guid].func = arguments[arguments.length - 1];
        provider.CallServerMethod(call);
      }
    };
    listOfServices[serviceName].ServiceName = serviceName;
    listOfMethodCallGuids[call.Guid] = { call: call, func: completeAction, isRegister: true, serviceName: serviceName };
    this.CallServerMethod(call);
  }

  this.RegisterCallbackService = function (serviceName) {
    var provider = this;
    listOfCallbackServices[serviceName] = {};
    return listOfCallbackServices[serviceName];
  }

  this.SetCallbackService = function (serviceName, cb) {
    listOfCallbackServices[serviceName] = cb;
  }

  this.GenerateResponseCall = function (data) {
    var dataType = data.substring(0, data.indexOf("/"));
    var splitDataType = dataType.split(",");
    if (splitDataType[0] == 2) {
      var json = data.substring(data.indexOf("/") + 1);
      var obj = JSON.parse(json);
      if (obj.PartNumber != undefined && obj.PartNumber != 0) {

        var mix = this.GenerateAndMixSegments(obj);
        if (mix != null)
          obj = JSON.parse(mix.Data);
        else
          return;
      }


      var call = listOfMethodCallGuids[obj.Guid];
      if (call.isRegister !== undefined && call.isRegister)
        call.func(listOfServices[call.serviceName]);
      else if (call.func != null && obj.Data != null)
        call.func(JSON.parse(obj.Data));
      listOfMethodCallGuids[obj.Guid] = null;


    }
    else if (splitDataType[0] == 1) {
      var json = data.substring(data.indexOf("/") + 1);
      var obj = JSON.parse(json);
      if (obj.PartNumber != undefined && obj.PartNumber != 0) {
        var mix = this.GenerateAndMixSegments(obj);
        if (mix != null)
          obj = JSON.parse(mix.Data);
        else
          return;
      }
      var service = listOfCallbackServices[obj.ServiceName];
      for (var method in service) {
        if (isFunction(service[method])) {
          if (method == obj.MethodName) {
            var params = new Array();
            for (var i = 0; i < obj.Parameters.length; i++) {
              params.push(JSON.parse(obj.Parameters[i].Value))
            }
            var result = service[method].apply(this, params);

            this.SendCallbackResultToServer(result, obj.Guid);
            break;
          }
        }
      }
    }
  }

  this.GenerateAndMixSegments = function (data) {
      this.AddToSegments(data);
      if (data.PartNumber == -1)
      {
        var result = JSON.parse(JSON.stringify(data));
        var resultData = "";
        for (var i = 0; i < segments[data.Guid].length; i++) {
          resultData += segments[data.Guid][i].Data;
        }
        result.Data = resultData;
        return result;
      }
      return null;
  }

  this.AddToSegments = function (data) {
    if (segments[data.Guid] == null || segments[data.Guid] == undefined) {
      segments[data.Guid] = [];
      segments[data.Guid].push(data);
    }
    else {
      segments[data.Guid].push(data);
    }
  }

  this.SendCallbackResultToServer = function (returnValue, guid) {
    var callBackInfo = { Guid: guid, Data: returnValue };
    var jdata = JSON.stringify(callBackInfo);
    if (jdata.length > 30000) {
      var partData = this.GenerateParts(jdata)

      for (i = 0; i < partData.length; i++) {
        var dataOfPart = partData[i];
        var newCall = JSON.parse(JSON.stringify(callBackInfo))
        if (i == partData.length - 1) {
          newCall.PartNumber = -1;
        }
        else {
          newCall.PartNumber = i + 1;
        }
        newCall.Data = dataOfPart;
        newCall.Parameters = null;
        this.SendCallbackToServer(newCall);
      }
    }
    else {
      this.SendCallbackToServer(callBackInfo);
    }
  }

  this.SendCallbackToServer = function (callBackInfo) {
    var json = JSON.stringify(callBackInfo);

    var bytearray = new Uint8Array(1);
    bytearray[0] = 2;
    socket.send(bytearray.buffer);

    var bytearray = new Uint8Array(1);
    bytearray[0] = 0;
    socket.send(bytearray.buffer);


    socket.send(json);
  }

  this.GenerateParts = function (data) {
    var partCount = Math.ceil(data.length / 30000);
    var partData = [];
    for (i = 0; i < partCount; i++) {
      if (i != partCount - 1) {
        partData.push(data.substr((i * 30000), 30000));
      } else {
        partData.push(data.substr((i * 30000), data.length - (i * 30000)));
      }
    }
    return partData;
  }

  this.CallServerMethod = function (methodCalInfo) {
    var jdata = JSON.stringify(methodCalInfo);
    if (jdata.length > 30000) {
      var partData = this.GenerateParts(jdata)

      for (i = 0; i < partData.length; i++) {
        var dataOfPart = partData[i];
        var newCall = JSON.parse(JSON.stringify(methodCalInfo));
        if (i == partData.length - 1) {
          newCall.PartNumber = -1;
        }
        else {
          newCall.PartNumber = i + 1;
        }
        newCall.Data = dataOfPart;
        newCall.Parameters = null;
        this.SendMethodToServer(newCall);
      }
    }
    else {
      this.SendMethodToServer(methodCalInfo);
    }
  }

  this.SendMethodToServer = function (methodCalInfo) {
    var json = JSON.stringify(methodCalInfo);
    json += "#end";
    var bytearray = new Uint8Array(1);
    bytearray[0] = 1;
    socket.send(bytearray.buffer);

    var bytearray = new Uint8Array(1);
    bytearray[0] = 0;
    socket.send(bytearray.buffer);
    //console.log(json.length);
    socket.send(json);
  }


}

function GenerateCallInfo(guid, serviceName, methodName, data, parameters) {
  var callInfo = {};
  callInfo.Guid = guid;
  callInfo.ServiceName = serviceName;
  callInfo.MethodName = methodName;
  callInfo.Data = data;//response of function
  callInfo.Parameters = parameters;
  return callInfo;
}

function GenerateParameter(value) {
  var parameterInfo = {};
  parameterInfo.Value = value;
  return parameterInfo;
}
