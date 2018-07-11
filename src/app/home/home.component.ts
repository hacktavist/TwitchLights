import { Component, enableProdMode } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

enableProdMode();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  title = 'TwitchLights';
  twitchUser;
  x_aio_key;
  adaUser;
  feedKey;
  live = '';
  userID = '';
  today = new Date();
  jstoday = '';
  constructor(private http: HttpClient, private router: Router){
      this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US');
  }

         adaData = [{"value": "", "created_at": this.jstoday}];

         adaHeaders =  new HttpHeaders();

         headers = new HttpHeaders().set('client-id', 'Twitch App Secret'); // need to move this to an environment variable in firebase


         adafruitUrl = "https://io.adafruit.com/api/v2/";

         url = "https://api.twitch.tv/helix/users?login=";

         subUrl = "https://api.twitch.tv/helix/webhooks/hub";

         topicUrl = "https://api.twitch.tv/helix/streams?user_id=";

         hub = {'hub.mode' : "subscribe", 'hub.callback': "http://127.0.0.1:3000/put", 'hub.lease_seconds' : 864000, 'hub.topic' : ""};



  test = function(tUser, aUser, key, feed){
      this.adaHeaders = this.adaHeaders.set('X-AIO-KEY', key); // need to move this to an environment variable in firebase
      this.adafruitUrl = "https://io.adafruit.com/api/v2/";
      this.adafruitUrl = this.adafruitUrl + aUser + "/feeds/" + feed + "/data";
      //
      // this.http.get(this.url, {headers:this.headers}).subscribe(data => {
      //
      //     if(data.data[0] != null){
      //
      //       this.userID = data.data[0].id;
      //       this.hub['hub.topic'] = this.topicUrl + this.userID;
      //       this.http.post(this.subUrl, this.hub, {headers:this.headers}).subscribe(data => {
      //           console.log(data.toJson());
      //           //this.router.navigate(['/webhook']);
      //       });
      //     }
      // });




      this.http.get(this.url + tUser, {headers:this.headers}).subscribe(data => {
                        console.log(data.data);
          if(data.data[0] != null){
              this.userID = data.data[0].id;
            this.http.get(this.topicUrl + this.userID, {headers:this.headers}).subscribe(data => {
                console.log(data.data[0]);
                if(data.data[0] != null){
                    if(data.data[0].type == "live"){
                        console.log("in live loop");
                        this.live = 'Live Now!';
                        this.adaData.value = 'Live';
                        this.http.post(this.adafruitUrl, {"value": "Live"}, {headers: this.adaHeaders}).subscribe(data => {

                        });
                    } else {

                    }
              } else {
                  console.log("in offline loop");
                  this.live = 'Offline';
                  this.adaData.value = 'Offline';
                  this.http.post(this.adafruitUrl, {"value": "Offline"}, {headers: this.adaHeaders}).subscribe(data => {

                  });
              }
            });

      } else {
          console.log("cannot find User");
      }

  });

}
    getSubInfo = function(){
        this.http.get('http://localhost:3000/challenge/').subscribe(data => {
            console.log(data);
  console.log(this.jstoday);
        });
    }
}
