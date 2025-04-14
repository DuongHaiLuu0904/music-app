// Aplayer 
const aplayer = document.querySelector('#aplayer');
if (aplayer) {
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

// button like
const buttonLike = document.querySelector('[button-like]');
if (buttonLike) {
    buttonLike.addEventListener('click', () => {
        const songId = buttonLike.getAttribute('button-like');
        const isActive = buttonLike.classList.contains('active');

        const typeLike = isActive ? 'no' : 'yes';

        const link = `/songs/like/${typeLike}/${songId}`;

        const options = {
            method: 'PATCH'
        };
        fetch(link, options)
            .then(response => response.json())
            .then(data => {
                if(data.code === 200) {
                    const span = buttonLike.querySelector('span');
                    span.innerHTML = `${data.like} thích`

                    buttonLike.classList.toggle('active');
                }
            })
    });
}
// End button like

// Button favorite
const buttonFavorite = document.querySelector('[button-favorite]');
if (buttonFavorite) {
    buttonFavorite.addEventListener('click', () => {
        const songId = buttonFavorite.getAttribute('button-favorite');
        const isActive = buttonFavorite.classList.contains('heart-active');

        const typeFavorite = isActive ? 'no' : 'yes';

        const link = `/songs/favorite/${typeFavorite}/${songId}`;

        const options = {
            method: 'PATCH'
        };
        fetch(link, options)
            .then(response => response.json())
            .then(data => {
                if(data.code === 200) {
                    buttonFavorite.classList.toggle('heart-active');
                }
            })
    });
}