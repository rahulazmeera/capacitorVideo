import { Component, ViewChild } from '@angular/core';
import { CapacitorVideoPlayer } from 'capacitor-video-player';

import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';


import { Storage } from '@ionic/storage-angular';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { combineLatest } from 'rxjs';

const MEDIA_FILES_KEY= 'mediaFiles';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('myvideo') myVideo: any;

  //varibale
  video: any;
  fullPath: any;
  localpath:any;
   
  mediaFiles: any=[];


  constructor(private mediaCapture: MediaCapture, private camera: Camera, private file:File,
     private storage: Storage ) {
      this.storage.create();
    
  }
     
  async captureMedia(){


  try{
  let options: CaptureVideoOptions = { duration: 10, limit:1}
  const data = await this.mediaCapture.captureVideo(options);
  console.log(data);
  this.video= data;
  this.fullPath= this.video[0].fullPath;
  this.localpath= this.video[0].localURL;
   console.log(this.fullPath);
   console.log("video file url"+JSON.stringify(this.video[0]));
   console.log("video file url"+JSON.stringify(this.video[0].fullPath));
   console.log("video file url"+JSON.stringify(this.video[0].localURL));
  }catch(e){
       console.log(e)
  }


  }


  ionViewDidLoad(){
    console.log("mediaFiles data", this.mediaFiles);
      this.storage.get(MEDIA_FILES_KEY).then(res=>{
        this.mediaFiles = JSON.parse(res) || [];
      });
    
  }


 //capture video 
  captureVideo(){

    this.mediaCapture.captureVideo({duration:10, limit:1}).then(res =>{
        let a: any =res;
        console.log("catputre video data", a);
      let capturedFile= a[0];
      this.storeMediaFiles(a);
      let fileName= capturedFile.name;
          console.log(fileName);
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');
      let toDirectory = this.file.dataDirectory;

      this.file.copyFile(fromDirectory, fileName, toDirectory, fileName).then(res =>{
        let url= res.nativeURL.replace(/^file:\/\//, '');
        console.log("url after copy file", url);
        this.storeMediaFiles([{name: fileName, size: capturedFile.size, localURL: url}]);
      });

    })

  }

 
  // startVideo(){
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.VIDEO
  //   }
    
  //   this.camera.getPicture(options).then((imageData) => {
  //    // imageData is either a base64 encoded string or a file URI
  //    // If it's base64 (DATA_URL):
  //    console.log(imageData)
  //    let base64Image = 'data:image/jpeg;base64,' + imageData;
  //   }, (err) => {
  //    // Handle error
  //   });
  // }




  //play video 

  playVideo(myFile:any){
    console.log("video play started")
   let path = this.file.dataDirectory + myFile.name;
   let url = path.replace(/^file:\/\//, '');
   let video = this.myVideo.nativeElement;
   console.log("video play click url",url);
   //video.src = url;
   this.capacitorPlayVideo(path);
   //video.play();
    
  }

  //stored media files 
  storeMediaFiles(files: any){


    console.log("mediaFiles data", this.mediaFiles);
    console.log("files ",files);

    // let res :any = this.storage.get(MEDIA_FILES_KEY);
    // this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files));
    // if(res){
    //   console.log('resp to store', res);
    //   let arr= res;
    //   arr = arr.concat(files);
    //   this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
    
    // }else{
    //   this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files));
    // }
   
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      if (res) {
        let arr = JSON.parse(res);
        arr = arr.concat(files);
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
      } else {
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
      }
      this.mediaFiles = this.mediaFiles.concat(files);
    })

  }


  capacitorPlayVideo(filePath:any){
    console.log("video player started");

    //const videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'; // Replace with the path to your video
    const videoUrl = filePath;
    console.log("capacitor video url",videoUrl);
    CapacitorVideoPlayer.initPlayer({
      mode:"fullscreen",
      url: videoUrl,
      playerId:"vplayer",
      componentTag:"vplayer"
    }).then(()=>{

    },(err)=>{
      console.log(err);
      alert(JSON.stringify(err));
    });

  
    CapacitorVideoPlayer.play({
        playerId:"vplayer"
    })


  }


}
