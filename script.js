
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');

            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    initializeImageGalleries();
    
    initializeFullscreenModals();
});

document.querySelector('.scroll-indicator')?.addEventListener('click', function() {
    document.querySelector('.bio-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

function initializeImageGalleries() {
    const galleries = document.querySelectorAll('.project-image-box, .project-image-box-small');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        const indicators = gallery.querySelector('.image-indicators');
        const prevBtn = gallery.querySelector('.image-nav-btn.prev');
        const nextBtn = gallery.querySelector('.image-nav-btn.next');
        
        if (images.length <= 1) return; 
        
        let currentIndex = 0;
        images[0].classList.add('active');
        
        if (indicators) {
            images.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('indicator-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showImage(index);
                });
                indicators.appendChild(dot);
            });
        }
        
        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            const dots = indicators?.querySelectorAll('.indicator-dot');
            dots?.forEach(dot => dot.classList.remove('active'));
            
            images[index].classList.add('active');
            if (dots) dots[index].classList.add('active');
            currentIndex = index;
        }
        
        function nextImage() {
            const nextIndex = (currentIndex + 1) % images.length;
            showImage(nextIndex);
        }
        
        function prevImage() {
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        }
        
        if (nextBtn) nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextImage();
        });
        
        if (prevBtn) prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevImage();
        });
        
    });
}

function initializeFullscreenModals() {
    const galleries = document.querySelectorAll('.project-image-box, .project-image-box-small');
    
    galleries.forEach((gallery, galleryIndex) => {
        const images = gallery.querySelectorAll('img');
        const fullscreenBtn = gallery.querySelector('.fullscreen-btn');
        
        if (!fullscreenBtn || images.length === 0) return;
        
        const modal = document.createElement('div');
        modal.classList.add('image-modal');
        modal.dataset.gallery = galleryIndex;
        
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        
        const modalClose = document.createElement('button');
        modalClose.classList.add('modal-close');
        modalClose.innerHTML = '×';
        
        const modalImg = document.createElement('img');
        
        const modalPrevBtn = document.createElement('button');
        modalPrevBtn.classList.add('modal-nav-btn', 'prev');
        modalPrevBtn.innerHTML = '‹';
        
        const modalNextBtn = document.createElement('button');
        modalNextBtn.classList.add('modal-nav-btn', 'next');
        modalNextBtn.innerHTML = '›';
        
        const modalIndicators = document.createElement('div');
        modalIndicators.classList.add('modal-indicators');
        
        modalContent.appendChild(modalClose);
        modalContent.appendChild(modalImg);
        
        if (images.length > 1) {
            modalContent.appendChild(modalPrevBtn);
            modalContent.appendChild(modalNextBtn);
            modalContent.appendChild(modalIndicators);
            
            images.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('indicator-dot');
                dot.addEventListener('click', () => showModalImage(index));
                modalIndicators.appendChild(dot);
            });
        }
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        let currentModalIndex = 0;
        
        function showModalImage(index) {
            currentModalIndex = index;
            modalImg.src = images[index].src;
            modalImg.alt = images[index].alt;
            
            const dots = modalIndicators.querySelectorAll('.indicator-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        function openModal() {
            const activeImage = gallery.querySelector('img.active');
            const activeIndex = Array.from(images).indexOf(activeImage);
            showModalImage(activeIndex);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        function nextModalImage() {
            const nextIndex = (currentModalIndex + 1) % images.length;
            showModalImage(nextIndex);
        }
        
        function prevModalImage() {
            const prevIndex = (currentModalIndex - 1 + images.length) % images.length;
            showModalImage(prevIndex);
        }
        
        fullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal();
        });
        
        images.forEach(img => {
            img.addEventListener('click', (e) => {
                if (e.target.classList.contains('active')) {
                    openModal();
                }
            });
        });
        
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        if (images.length > 1) {
            modalPrevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevModalImage();
            });
            
            modalNextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextModalImage();
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft' && images.length > 1) prevModalImage();
            if (e.key === 'ArrowRight' && images.length > 1) nextModalImage();
        });
    });
}