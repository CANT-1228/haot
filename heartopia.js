document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    const hobbyCards = document.querySelectorAll('.hobby-card');
    
    hobbyCards.forEach(card => {
        card.addEventListener('click', function() {
            const hobby = this.getAttribute('data-hobby');
            const hobbyNames = {
                fishing: '钓鱼',
                gardening: '园艺',
                cooking: '烹饪',
                bugs: '捕虫',
                birds: '观鸟',
                cats: '养猫',
                dogs: '养狗'
            };
            
            alert(`您点击了：${hobbyNames[hobby]}\n\n即将跳转到${hobbyNames[hobby]}详细攻略页面...`);
        });
    });

    const categoryBtns = document.querySelectorAll('.category-btn');
    const recipeCards = document.querySelectorAll('.recipe-card-small');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            recipeCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transition = 'opacity 0.3s ease';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const npcCards = document.querySelectorAll('.npc-card');
    
    npcCards.forEach(card => {
        card.addEventListener('click', function() {
            const npcName = this.querySelector('h4').textContent;
            alert(`您点击了：${npcName}\n\n可以每天给${npcName}送礼物来提升好感度！`);
        });
    });

    const allCards = document.querySelectorAll('.guide-card, .hobby-card, .tip-box, .recipe-card-small, .npc-card, .video-card, .gallery-item, .guestbook-form, .messages-container');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    allCards.forEach(card => {
        observer.observe(card);
    });

    loadMessages();

    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach((card, index) => {
        if (index !== 0) {
            card.addEventListener('click', function() {
                const title = this.querySelector('h4').textContent;
                alert(`🎬 视频：${title}\n\n（演示功能）实际项目中可以嵌入真实视频链接！`);
            });
        }
    });

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.gallery-title').textContent;
            const desc = this.querySelector('.gallery-desc').textContent;
            alert(`📷 图片：${title}\n\n${desc}\n\n（演示功能）实际项目中可以打开大图预览！`);
        });
    });
});

function copyCode(code) {
    navigator.clipboard.writeText(code).then(function() {
        alert(`兑换码 "${code}" 已复制到剪贴板！`);
    }).catch(function(err) {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
    });
}

function submitGuestbook() {
    const name = document.getElementById('guest-name').value.trim();
    const email = document.getElementById('guest-email').value.trim();
    const message = document.getElementById('guest-message').value.trim();

    if (!name || !message) {
        alert('请填写昵称和留言内容！');
        return;
    }

    const newMessage = {
        id: Date.now(),
        name: name,
        email: email,
        message: message,
        time: new Date().toLocaleString('zh-CN')
    };

    let messages = JSON.parse(localStorage.getItem('heartopia-messages') || '[]');
    messages.unshift(newMessage);
    localStorage.setItem('heartopia-messages', JSON.stringify(messages));

    document.getElementById('guest-name').value = '';
    document.getElementById('guest-email').value = '';
    document.getElementById('guest-message').value = '';

    loadMessages();
    alert('留言发布成功！');
}

function loadMessages() {
    const messagesList = document.getElementById('messages-list');
    const messages = JSON.parse(localStorage.getItem('heartopia-messages') || '[]');

    if (messages.length === 0) {
        messagesList.innerHTML = '<div class="empty-message">还没有留言，快来发布第一条吧！</div>';
        return;
    }

    messagesList.innerHTML = messages.map(msg => `
        <div class="message-card">
            <div class="message-header">
                <span class="message-author">${escapeHtml(msg.name)}</span>
                <span class="message-time">${msg.time}</span>
            </div>
            <div class="message-content">${escapeHtml(msg.message)}</div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
