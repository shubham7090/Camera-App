let video = document.querySelector("video");
let vidbtn = document.querySelector("button#record");
let capbtn = document.querySelector("button#capture");
let galleryBtn=document.querySelector("#gallery");
let isRecording = false;
let constraints = { video: true, audio: true };
let mediaRecorder;
let chunks = [];
let body= document.querySelector("body");
let filters=document.querySelectorAll(".filter");  
let filter="";

let zoomin=document.querySelector(".zoom-in");
let zoomout=document.querySelector(".zoom-out");
let minzoom=1,maxzoom=3,currzoom=1;
zoomin.addEventListener("click",function(){
  let vidCurrState=video.style.transform.split("(")[1].split(")")[0];
  if(vidCurrState>maxzoom){
    return;
  }else{
    currzoom= Number(vidCurrState)+0.1;
    console.log(currzoom);
    video.style.transform=`scale(${currzoom})`;
  }
});
zoomout.addEventListener("click",function(){
  if(currzoom>minzoom){
    currzoom-=0.1;
    video.style.transform=`scale(${currzoom})`;
  }
});


for(let i=0;i<filters.length;i++){
  filters[i].addEventListener("click",function(f){
    filter=f.currentTarget.style.backgroundColor;
    //remove filter if exists
    removeFilter();
    //apply filter
    applyFilter(filter);
  });
}
function applyFilter(filterColor){
  let filterDiv=document.createElement("div");
  filterDiv.classList.add("filter-div");
  filterDiv.style.backgroundColor=filterColor;
  // document.querySelector(".vid-container").appendChild(filterDiv);
  body.appendChild(filterDiv);
  
}
function removeFilter(){
  let filterDiv=document.querySelector(".filter-div");
  if(filterDiv)filterDiv.remove();
}
vidbtn.addEventListener("click", function() {
  let innerDiv=vidbtn.querySelector("div");
  if (isRecording) {
    isRecording = false;
    mediaRecorder.stop();
    innerDiv.classList.remove("vid-animate");
  } else {
    isRecording = true;
    mediaRecorder.start();
    filter="";
    removeFilter();
    video.style.transform=`scale(1)`;
    currzoom=1;
    innerDiv.classList.add("vid-animate");
  }
});
capbtn.addEventListener("click",function(){
  let innerDiv=capbtn.querySelector("div");
  innerDiv.classList.add("cap-animate");
  setTimeout(function(){
    innerDiv.classList.remove("cap-animate");

  },900);  
  capture();
});
navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
  video.srcObject = mediaStream;
  mediaRecorder = new MediaRecorder(mediaStream);
  mediaRecorder.addEventListener("dataavailable", function(e) {
    chunks.push(e.data);
  });
  mediaRecorder.addEventListener("stop", function(e) {
    let blob = new Blob(chunks, { type: "video/mp4" });
    addMedia("video",blob);
    chunks = [];
    //code for downloading the recorded video at instace of recording
    // let url = URL.createObjectURL(blob);
    // let a = document.createElement("a");
    // a.href = url;
    // a.download = "video.mp4";
    // a.click();
    // a.remove();

    
  });
});
function capture(){
    let c =document.createElement("canvas");
    c.width=video.videoWidth;
    //video.height means hieght of video element.
    //vide.videoHeight means the height of video playing inside that element.
    c.height=video.videoHeight;
    let ctx= c.getContext("2d");
    ctx.translate(c.width/2,c.height/2);//shifting the origin from top left corener to center
    ctx.scale(currzoom,currzoom); //zoom the canvas from the center;
    //canvas.scale se woh apne andar ka image scale karta hai! apni boundaries nhi.
    ctx.translate(-c.width/2,-c.height/2);//shifting the origin back to its original place to allow it to draw image
    ctx.drawImage(video,0,0);
    if(filter!=""){
      ctx.fillStyle=filter;
      ctx.fillRect(0,0,c.width,c.height);
    }
    // let a = document.createElement("a");
    // a.download = "image.png";
    // a.href = c.toDataURL();//converts the image on canvas to an url
    addMedia("img",c.toDataURL());
    // a.click();
    // a.remove();
}
// #################################GALLERY##########################################
galleryBtn.addEventListener("click",function(){
  location.assign("gallery.html");
  // location is an object that is given to us by the browser
  // it has an assign function who needs a path parameter
  // the function goes to that particular path using your domain
  // Example : https://www.google.com/example/1?a=1+b+=2
  //          protocol  domain      path  (? ke baad querry hoti hai)

})