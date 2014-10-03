/**
* Method for authentication for jawbone up with oAuth2
*
* plugins: org.apache.cordova.inappbrowser
*/


var browser;
var client_id = ''; // Your Client id here
var client_secret = ''; // Your Secret here

/**
* This Method call Login Window to open in inAppBrowser
*/
function login() {
    //After Login was possible go back to:
    var redirect_uri = 'fitnessmonitor://oauth_callback';
    //Authentication to read or write Data, see jawbone API
    var scope = 'extended_read+basic_read+move_read+sleep_read';
    //Generate URL
    var url = 'https://jawbone.com/auth/oauth2/auth?response_type=code&client_id=' + client_id +
        '&redirect_uri=' + redirect_uri +
        '&scope=' + scope;
    browser = window.open(url, '_blank', 'location=yes');
}

/**
* With code make a request for oAuth2 Token
*/
function login_Redirect(code) {
    var url = 'https://jawbone.com/auth/oauth2/token';
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    //This will return an error or the token
    xhr.onload = function() {
        if(this.status === 200) {
            var data = JSON.parse(this.response);
            //write expire time in Datetime
            data.expires_in = new Date(new Date().getTime() + data.expires_in*1000);
            //save Token in localStorage
            localStorage.oAuth2 = JSON.stringify(data);
        } else {
            alert('ERROR ON RESPONSE');
            // TODO: Handle Error
        }
    }
    
    //Send client_id, client_secret and code for authentication
    xhr.send('client_id=' + client_id + '&' +
        'client_secret=' + client_secret + '&' +
        'grant_type=authorization_code' + '&' +
        'code=' + code);
}

/**
* After Redirect_uri was called this method will get code, that has 10 minute livetime
*/
function handleOpenURL(url) {
    setTimeout(function() {
        url = url.split('?')[1];
        url = url.replace('code=', '');
        login_Redirect(url);
        
        browser.close();

    }, 100);
}

/**
* This Method get all moves done by user.
*/
function getMoves() {
    var url = 'https://jawbone.com/nudge/api/v.1.1/users/@me/moves';
    
    var oAuthData = JSON.parse(localStorage.oAuth2);
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    
    // authorization header: Authorization: {token_type} {access_token}
    xhr.setRequestHeader('Authorization', oAuthData.token_type + ' ' + oAuthData.access_token);
    
    // This will return an error or the data requested
    xhr.onload = function() {
        if(this.status === 200) {
            var data = JSON.parse(this.response);
        } else {
            alert('ERROR on Response');
            //TODO: Handle Error
        }
    }
    
    xhr.send();
}



