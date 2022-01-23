//database create/open camera
//Database objectstore -> gallery
// photo capure/video record => garalley store
// format:
// data={
//     mid: 11434343141 MediaID
//     type: img/vid 
//     media: actual content (img => c.toDataUrl, video=> blob object)
// }
let dbAccess;
let container=document.querySelector(".container");
let request=indexedDB.open("Camera",1);//name and version
request.addEventListener("success",function(){
    dbAccess=request.result;
})
request.addEventListener("upgradeneeded",function(){
    let db=request.result;
    db.createObjectStore("gallery",{keyPath: "mId"});
});
request.addEventListener("error",function(){
    alert("error occured");
})

function addMedia(type,media){
    //assumption that it will work only after there is db access
    let tx=dbAccess.transaction("gallery","readwrite");
    let galleryObjectStore= tx.objectStore("gallery");
    let data={
        mId: Date.now(),
        type,
        media,
    };
    galleryObjectStore.add(data);
}
function viewMedia(){
    //assumption that db access is given
    let tx=dbAccess.transaction("gallery","readonly");
    let galleryObjectStore=tx.objectStore("gallery");
    let req=galleryObjectStore.openCursor();
    req.addEventListener("success",function(){
        let cursor=req.result
        if(cursor){
            let div=document.createElement("div");
            div.classList.add("media-card");
            
            div.innerHTML=`<div class="media-container">
            </div>
            <div class="action-container">
                <button class="media-download" data-id="${cursor.value.mId}">Download</button>
                <button class="media-delete" data-id="${cursor.value.mId}">Delete</button>
            </div> `;
            
            let dwnldbtn=div.querySelector(".media-download");
            let deletebtn=div.querySelector(".media-delete");
            deletebtn.addEventListener("click",function(e){
                let mID=e.currentTarget.getAttribute("data-id");

                //delete card(div) from UI
                e.currentTarget.parentElement.parentElement.remove();
                //delete data from indexDB
                deleteMediaFromDB(mID);
            });
            
            if(cursor.value.type=="img"){
                let img=document.createElement("img");
                img.src=cursor.value.media;
                img.classList.add("img-gallery");
                let mediaContainer=div.querySelector(".media-container");
                mediaContainer.appendChild(img);

                dwnldbtn.addEventListener("click",function(e){
                    let a=document.createElement("a");
                    a.download="image.jpg";
                    a.href=e.currentTarget.parentElement.parentElement.querySelector(".media-container").children[0].src;
                    a.click();
                    a.remove();
                });

            }else{
                let video=document.createElement("video");
                video.src=window.URL.createObjectURL(cursor.value.media);
                video.classList.add("video-gallery");
                video.addEventListener("mouseenter",function(){
                    video.currentTime=0;
                    video.play();
                });
                video.addEventListener("mouseleave",function(){
                    video.pause();
                });
                video.controls=true;
                video.loop=true;
                let mediaContainer=div.querySelector(".media-container");
                mediaContainer.appendChild(video);

                dwnldbtn.addEventListener("click",function(e){
                    let a=document.createElement("a");
                    a.download="video.mp4";
                    a.href=e.currentTarget.parentElement.parentElement.querySelector(".media-container").children[0].src;
                    a.click();
                    a.remove();
                });

            }

            container.appendChild(div);
            cursor.continue();
        }
    })
}

function deleteMediaFromDB(mID){
    let tx=dbAccess.transaction("gallery","readwrite");
    let galleryObjectStore=tx.objectStore("gallery");
    galleryObjectStore.delete(Number(mID));
}