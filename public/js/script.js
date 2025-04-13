// Aplayer 
const aplayer = document.querySelector('#aplayer');
if(aplayer) {
    let dataSong = aplayer.getAttribute('data-song');
    dataSong = JSON.parse(dataSong);

    let dataSinger = aplayer.getAttribute('data-singer');
    dataSinger = JSON.parse(dataSinger);
 
    const ap = new APlayer({
        container: aplayer,
        autoplay: true,
        audio: [
            {
                name: dataSong.title,
                artist: dataSinger,
                url: dataSong.audio,
                cover: dataSong.avatar,
            }
        ]
    });
    
    // Lấy phần tử ảnh album
    const albumImage = document.querySelector('.inner-avatar img');
    
    // Hàm kiểm tra trạng thái và cập nhật class cho ảnh
    const updateRotation = () => {
        if (ap.audio.paused) {
            albumImage.style.animationPlayState = 'paused';
        } else {
            albumImage.style.animationPlayState = 'running';
        }
    };
    
    // Cập nhật ban đầu
    updateRotation();
    
    // Lắng nghe sự kiện play và pause
    ap.on('play', updateRotation);
    ap.on('pause', updateRotation);
}
// End Aplayer 