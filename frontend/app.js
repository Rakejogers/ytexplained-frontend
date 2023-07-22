async function fetch_explanation(){
    var progress = document.getElementById("progress_bar");
    var button = document.getElementById("explain-button");
    progress.style.display = "block";
    button.style.display = "none";

    // get the youtube id from the input field
    let url = document.getElementById("link_input").value
    function youtube_parser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }
    let yt_id=youtube_parser(url);

    console.log(yt_id)

    
    
    // // make the progress bar increase while fetching the data
    var width = 1;
    var id = setInterval(frame, 20);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            progress.value = width;
        }
    }
    setTimeout(()=>clearInterval(id),5000);//stop increasing after certain time

    const requrl = 'http://127.0.0.1:8000/ytexplainer?yt_id=' + yt_id
    //using fetch get the explanation from teh server with requrl
    fetch(requrl)
    .then(response => response.json())
    .then(data => {
        console.log(data.message)
        document.getElementById("explain-text").innerHTML = data.message
        document.getElementById("explain").style.display = "block"
    })
    .catch(error => {
        console.log(error)
    })

    progress.style.display = "none";
    // document.getElementById("explain").style.display = "block"
}

// add event listener for the button
document.getElementById("explain-button").addEventListener("click", fetch_explanation);