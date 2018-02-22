/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
document.addEventListener('deviceready', DeviceReady, false);

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        window.open = cordova.InAppBrowser.open;
        //window.location = "index.html";
        this.receivedEvent('deviceready');
        screen.orientation.lock('portrait');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
        /* var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;'); */    
        console.log('Received Event: ' + id);
    }
    // request permission
};

app.initialize();
//window.location = "index.html";

function DeviceReady(el){
    /* window.FirebasePlugin.getToken(function(token) {
        // save this server-side and use it to push notifications to this device
        console.log(token);
        
    }, function(error) {
        console.error(error);
       
    });
    if (window && window['FirebasePlugin']) {
        window['FirebasePlugin'].setUserProperty('logon_type', 'demo');
    }
    window['FirebasePlugin'].setUserProperty('logon_type', 'demo'); */
      
}