// 导航栏滚动效果
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // 滚动时添加阴影效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 移动端菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = (navbar && navbar.querySelector('.nav-container')) ? navbar.querySelector('.nav-container').offsetHeight : 0;
                const y = target.getBoundingClientRect().top + window.scrollY - Math.max(0, navHeight - 20);
                window.scrollTo({ top: y, behavior: 'smooth' });
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            }
        });
    });

    const sectionIds = ['home','legend','about','pricing','testimonials'];
    const linkMap = new Map();
    document.querySelectorAll('.nav-menu a[href^="#"]').forEach(a => linkMap.set(a.getAttribute('href').slice(1), a));
    const spyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const link = linkMap.get(id);
            if (!link) return;
            if (entry.isIntersecting) {
                document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }, { threshold: 0.6 });
    sectionIds.forEach(id => { const el = document.getElementById(id); if (el) spyObserver.observe(el); });
    
    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 根据元素位置添加不同的动画类
                const rect = entry.target.getBoundingClientRect();
                const centerX = window.innerWidth / 2;
                
                if (rect.left < centerX) {
                    entry.target.classList.add('fade-in-left');
                } else {
                    entry.target.classList.add('fade-in-right');
                }
                
                // 为卡片添加缩放动画
                if (entry.target.classList.contains('feature-card') || 
                    entry.target.classList.contains('course-card')) {
                    entry.target.classList.add('scale-in');
                }
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    document.querySelectorAll('.feature-card, .course-card, .pricing-card, .testimonial-card, .section-header').forEach(el => {
        observer.observe(el);
    });
    
    // 表单提交处理
    const enrollForm = document.getElementById('enrollForm');
    if (enrollForm) {
        enrollForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // 显示加载状态
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.innerHTML = '<span class="loading"></span> 提交中...';
            submitButton.disabled = true;
            
            // 模拟提交延迟
            setTimeout(() => {
                // 显示成功消息
                alert(`感谢您的报名！\n\n姓名：${data.name}\n邮箱：${data.email}\n电话：${data.phone}\n课程：${getCourseName(data.course)}\n\n我们的课程顾问将在24小时内与您联系。`);
                
                // 重置表单
                this.reset();
                
                // 恢复按钮状态
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // 滚动到顶部
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
            }, 2000);
        });
    }

    // Testimonials Carousel
    const track = document.querySelector('.carousel-track');
    const viewport = document.querySelector('.carousel-viewport');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    if (track && viewport && prevBtn && nextBtn) {
        let index = 0;
        const cards = Array.from(track.children);
        function update() {
            const width = viewport.clientWidth;
            track.style.transform = `translateX(-${index * width}px)`;
        }
        window.addEventListener('resize', update);
        update();
        prevBtn.addEventListener('click', () => {
            index = Math.max(0, index - 1);
            update();
        });
        nextBtn.addEventListener('click', () => {
            index = Math.min(cards.length - 1, index + 1);
            update();
        });
    }
    
    // Hero countdown (1 month, to the second)
    const countdownEl = document.querySelector('.hero-countdown');
    if (countdownEl) {
        countdownEl.classList.add('countdown-pulse');
        const target = new Date();
        target.setMonth(target.getMonth() + 1);
        function format(n) { return n < 10 ? '0' + n : '' + n; }
        function tick() {
            const now = new Date();
            let diff = target.getTime() - now.getTime();
            if (diff <= 0) {
                countdownEl.textContent = 'Limited-Time Offer has ended';
                countdownEl.classList.remove('countdown-urgent');
                return;
            }
            const dayMs = 1000 * 60 * 60 * 24;
            const hourMs = 1000 * 60 * 60;
            const minMs = 1000 * 60;
            const days = Math.floor(diff / dayMs);
            diff -= days * dayMs;
            const hours = Math.floor(diff / hourMs);
            diff -= hours * hourMs;
            const minutes = Math.floor(diff / minMs);
            diff -= minutes * minMs;
            const seconds = Math.floor(diff / 1000);
            countdownEl.textContent = `Limited-Time Offer — Ends in: ${days}d ${format(hours)}h ${format(minutes)}m ${format(seconds)}s`;
            if ((target.getTime() - now.getTime()) <= 24 * hourMs) {
                countdownEl.classList.add('countdown-urgent');
            } else {
                countdownEl.classList.remove('countdown-urgent');
            }
        }
        tick();
        setInterval(tick, 1000);
    }
    
    // 获取课程名称
    function getCourseName(courseValue) {
        const courseNames = {
            'basic': 'Basic Design Skills',
            'advanced': 'Advanced Brand Design',
            'professional': 'Professional Certification'
        };
        return courseNames[courseValue] || '未知课程';
    }
    
    // 视频播放按钮（模拟）
    const video = document.querySelector('.video-player');
    const overlayPlay = document.querySelector('.video-overlay-play');
    const overlayBanner = document.querySelector('.video-overlay-banner');
    if (video && overlayPlay && overlayBanner) {
        function updateOverlay() {
            if (video.paused) {
                overlayPlay.classList.remove('video-overlay-hidden');
                overlayBanner.classList.add('video-overlay-hidden');
                video.classList.add('video-dimmed');
            } else {
                overlayPlay.classList.add('video-overlay-hidden');
                overlayBanner.classList.remove('video-overlay-hidden');
                video.classList.remove('video-dimmed');
            }
        }
        overlayPlay.addEventListener('click', function() {
            if (video.paused) { video.play(); } else { video.pause(); }
        });
        video.addEventListener('play', updateOverlay);
        video.addEventListener('pause', updateOverlay);
        video.addEventListener('ended', updateOverlay);
        updateOverlay();
    }
    // Legend MOV support detection and autoplay handling
    const legendVideos = document.querySelectorAll('.legend-track .legend-item');
    if (legendVideos.length) {
        const probe = document.createElement('video');
        const canQuickTime = probe.canPlayType('video/quicktime');
        legendVideos.forEach(v => {
            if (v.tagName === 'VIDEO') {
                if (!canQuickTime) {
                    v.removeAttribute('src');
                    v.classList.add('video-unsupported');
                } else {
                    v.preload = 'auto';
                    v.muted = true;
                    v.play().catch(() => {});
                }
            }
        });
    }
    
    // 数字计数动画
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(function() {
            start += increment;
            if (start >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '') + 
                                   (element.textContent.includes('%') ? '%' : '') + 
                                   (element.textContent.includes('天') ? '天' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '') + 
                                   (element.textContent.includes('%') ? '%' : '') + 
                                   (element.textContent.includes('天') ? '天' : '');
            }
        }, 16);
    }
    
    // 当统计数据进入视口时触发动画
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    const digits = statNumber.textContent.match(/\d+/);
                    if (digits) {
                        let target = parseInt(digits[0], 10);
                        animateCounter(statNumber, target);
                    }
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Enhanced course card hover effects
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03) rotateX(5deg)';
            this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateX(0)';
        });
        
        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-15px) scale(1.03) rotateX(5deg)';
            }, 150);
        });
    });
    
    // Enhanced feature card effects
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-12px) scale(1.02)';
            }, 150);
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 0, 0, 0.1) 0%, transparent 50%)`;
            this.style.transform = 'translateY(-12px) scale(1.02)';
            this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = 'var(--accent-color)';
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 响应式导航菜单
    function updateMenuForMobile() {
        const isMobile = window.innerWidth <= 992;
        if (isMobile) {
            navMenu.style.display = 'none';
            hamburger.style.display = 'flex';
        } else {
            navMenu.style.display = 'flex';
            hamburger.style.display = 'none';
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    }
    
    window.addEventListener('resize', updateMenuForMobile);
    updateMenuForMobile();
    
    // 添加CSS样式用于移动端菜单
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(1) {
                transform: translateY(9px) rotate(45deg);
            }
            
            .hamburger.active span:nth-child(3) {
                transform: translateY(-9px) rotate(-45deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('网站脚本加载完成！');
});

// 页面加载完成后的额外效果
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    // 头像加载失败回退
    document.querySelectorAll('.author-avatar').forEach(function(img){
        img.addEventListener('error', function(){
            if (!img.dataset.fallbackApplied) {
                img.dataset.fallbackApplied = '1';
                img.src = 'avatar/根据头像生成类似形象.jpg';
            }
        });
    });
    // 关键板块图片回退，保证显示
    function addFallback(selector, fallback){
        document.querySelectorAll(selector).forEach(function(img){
            img.addEventListener('error', function(){
                if (!img.dataset.fallbackApplied) {
                    img.dataset.fallbackApplied = '1';
                    img.src = encodeURI(fallback);
                }
            });
        });
    }
    addFallback('.sixty-days-gif', 'assets/12月3日.gif');
    addFallback('.inside-gif', 'Icon/1 (1).gif');
    addFallback('.legend-item', 'legend/gif_22.gif');
    addFallback('.brand-logo-img', '../logo/左上角_00000.png');
});

(function(){
    function removeSplash(){
        var all = Array.prototype.slice.call(document.querySelectorAll('*'));
        all.forEach(function(el){
            if (el.closest && el.closest('.navbar')) { return; }
            var cs = window.getComputedStyle(el);
            var zi = parseInt(cs.zIndex || '0', 10);
            var txt = (el.textContent || '').trim();
            var idc = (el.id || '') + ' ' + (el.className || '');
            var bg = (cs.backgroundImage || cs.background || '').toLowerCase();
            var w = parseFloat(cs.width) || 0;
            var h = parseFloat(cs.height) || 0;
            var full = (cs.left === '0px' && cs.top === '0px' && (cs.width === '100%' || w >= window.innerWidth - 1) && (cs.height === '100%' || h >= window.innerHeight - 1));
            var matchTxt = txt.indexOf('正在加载精彩内容') !== -1 || txt.indexOf('创意剪辑学院') !== -1;
            var matchIdc = /loader|loading|splash/i.test(idc);
            var matchBg = bg.indexOf('#667eea') !== -1 || bg.indexOf('#764ba2') !== -1 || bg.indexOf('linear-gradient') !== -1 && bg.indexOf('667eea') !== -1;
            if (cs.position === 'fixed' && (full || matchTxt || matchIdc || matchBg)) {
                el.remove();
            }
        });
        Array.prototype.slice.call(document.querySelectorAll('style')).forEach(function(s){
            var content = s.textContent || '';
            if (content.indexOf('@keyframes pulse') !== -1 || content.toLowerCase().indexOf('667eea') !== -1 && content.toLowerCase().indexOf('764ba2') !== -1) {
                s.remove();
            }
        });
    }
    function bind(){
        document.addEventListener('click', removeSplash, true);
        Array.prototype.slice.call(document.querySelectorAll('video')).forEach(function(v){
            v.addEventListener('play', removeSplash);
            v.addEventListener('pause', removeSplash);
        });
        var mo = new MutationObserver(function(){ removeSplash(); });
        mo.observe(document.documentElement, { childList: true, subtree: true });
        var tries = 0;
        var t = setInterval(function(){ removeSplash(); if (++tries > 30) clearInterval(t); }, 150);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function(){ removeSplash(); bind(); });
    } else {
        removeSplash();
        bind();
    }
})();

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 优化滚动事件
const optimizedScroll = debounce(function() {
    // 滚动相关的优化代码
}, 10);

window.addEventListener('scroll', optimizedScroll);
