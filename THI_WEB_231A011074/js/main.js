// Đợi DOM load xong
document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================================
        1. Thư viện ảnh đơn giản
    =================================================================== */
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Lấy đường dẫn ảnh lớn từ data-full-src
            const fullSrc = this.getAttribute('data-full-src');
            
            // Cập nhật ảnh lớn
            mainImage.src = fullSrc;
            mainImage.alt = this.alt;

            // Có thể thêm hiệu ứng highlight thumbnail đang chọn nếu cần
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Mặc định, highlight ảnh đầu tiên (tùy chọn)
    if (thumbnails.length > 0) {
        thumbnails[0].classList.add('active');
    }


    /* ===================================================================
        2. Scroll Effect (Thêm class .scrolled vào header)
    =================================================================== */
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        // Kiểm tra vị trí cuộn: nếu cuộn hơn 50px thì thêm class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    /* ===================================================================
        3. Tư duy sáng tạo: Animation khi cuộn tới (Intersection Observer)
    =================================================================== */
    const featureItems = document.querySelectorAll('.feature-item');

    // Tùy chọn cho Observer (khi nào thì gọi callback)
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Khi 20% của phần tử nằm trong viewport
    };

    const featureObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Thêm class để kích hoạt animation (fade-in, slide-in)
                entry.target.classList.add('animate-in');
                
                // Dừng quan sát sau khi đã animation xong
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Bắt đầu quan sát từng feature item
    featureItems.forEach(item => {
        featureObserver.observe(item);
    });
    
    /* ===================================================================
        Responsive: Toggle Menu (Tablet/Mobile)
        Mặc dù yêu cầu chỉ là thay đổi giao diện, nhưng nên thêm JS để hoàn chỉnh
    =================================================================== */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

});










// Game Đoán Số (Chạy code này chỉ khi ở trang bai02.html)
if (document.getElementById('guessInput')) {
    
    // Logic Tư duy: Generate Random
    // Công thức: Math.floor(Math.random() * (max - min + 1)) + min;
    const MIN_NUMBER = 50;
    const MAX_NUMBER = 150;
    const targetNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
    
    let guessCount = 0;
    
    // Lấy các phần tử DOM
    const guessInput = document.getElementById('guessInput');
    const checkButton = document.getElementById('checkButton');
    const message = document.getElementById('message');
    const countDisplay = document.getElementById('count');
    const confettiContainer = document.getElementById('confetti-container');

    // Logic Tư duy: Xử lý Input
    const checkGuess = () => {
        // 1. Lấy giá trị và chuyển sang số nguyên
        const userGuess = parseInt(guessInput.value.trim());

        // 2. Xử lý lỗi (Input Validation)
        if (isNaN(userGuess) || userGuess < MIN_NUMBER || userGuess > MAX_NUMBER) {
            message.textContent = `Vui lòng nhập một số hợp lệ trong khoảng ${MIN_NUMBER} đến ${MAX_NUMBER}.`;
            return; // Dừng hàm nếu input không hợp lệ
        }

        // 3. Cập nhật số lần đoán
        guessCount++;
        countDisplay.textContent = guessCount;

        // 4. So sánh
        if (userGuess === targetNumber) {
            message.textContent = `🎉 CHÚC MỪNG! Bạn đã đoán đúng số ${targetNumber} sau ${guessCount} lần thử!`;
            checkButton.disabled = true; // Tắt nút sau khi thắng
            guessInput.disabled = true;
            triggerConfetti(); // Kích hoạt hiệu ứng Confetti
        } else if (userGuess < targetNumber) {
            message.textContent = 'Quá thấp! Hãy đoán một số lớn hơn.';
        } else {
            message.textContent = 'Quá cao! Hãy đoán một số nhỏ hơn.';
        }
        
        // 5. Xóa input để người dùng nhập lần đoán tiếp theo
        guessInput.value = '';
        guessInput.focus();
    };

    // Gắn sự kiện
    checkButton.addEventListener('click', checkGuess);
    // Cho phép nhấn Enter để đoán
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkGuess();
        }
    });

    // Hàm Confetti Animation đơn giản
    const COLORS = ['#ff7e5f', '#feb47b', '#86a8e7', '#91e5c3', '#ff0066', '#ffcc00'];
    const triggerConfetti = () => {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            
            // Random vị trí và kích thước
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            
            confettiContainer.appendChild(confetti);

            // Xóa confetti sau khi animation kết thúc để tránh làm nặng DOM
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    };
}