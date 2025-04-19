document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleSidebar');
    const sider = document.querySelector('.sider');
    
    // Khôi phục trạng thái sidebar từ localStorage
    const siderState = localStorage.getItem('siderState');
    if (siderState === 'collapsed') {
        sider.classList.add('collapsed');
    }

    // Xử lý sự kiện click vào nút toggle
    toggleBtn.addEventListener('click', function() {
        sider.classList.toggle('collapsed');
        
        // Lưu trạng thái vào localStorage
        if (sider.classList.contains('collapsed')) {
            localStorage.setItem('siderState', 'collapsed');
        } else {
            localStorage.setItem('siderState', 'expanded');
        }
    });

    // Xử lý responsive trên mobile
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleMobileView(e) {
        if (e.matches) {
            sider.classList.remove('collapsed');
            sider.classList.add('mobile');
        } else {
            sider.classList.remove('mobile');
            // Khôi phục trạng thái desktop từ localStorage
            if (localStorage.getItem('siderState') === 'collapsed') {
                sider.classList.add('collapsed');
            }
        }
    }
    
    mediaQuery.addListener(handleMobileView);
    handleMobileView(mediaQuery);
});