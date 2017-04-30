const request = require('request');
var Platform = require('./../model/Platform').Platform;

module.exports.FacebookAuth = class FacebookAuth {

  constructor(clientID, clientSecret) {

    this.clientID = clientID;
    this.clientSecret = clientSecret;
  }

  generateAccessToken() {

    let url = 'https://graph.facebook.com/oauth/access_token';
    let parameters = this.getRequestParameters();

    url += `?${parameters}`;

    request
      .get({
        'uri': url,
        'encoding': 'utf-8',
      })
      .on('response', (response) => {

        response.on('data', (data) => {

          if (response.statusCode != 200) {
            console.error(response.statusCode);
            console.error(data);
            return;
          }

          let body = JSON.parse(data);
          Platform.update({ 'name' : 'facebook' },
            { $set : { 'accessToken' : body.access_token }},
            function (err, _) {
              if (err)
                console.error(err.message);
            }
          );
        });
      })
      .on('error', (err) => {
        console.error(err.message);
      });
  }

  getRequestParameters() {

    let parameters = new Map();
    parameters.set('client_id', this.clientID);
    parameters.set('client_secret', this.clientSecret);
    parameters.set('grant_type', 'client_credentials');

    let requestParameters = '';
    for (let [key, value] of parameters.entries())
      if (requestParameters == '')
        requestParameters += `${key}=${value}`;
      else
        requestParameters += `&${key}=${value}`;

    return requestParameters;
  }
}
