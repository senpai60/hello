document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to elements
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

    // Modal functionality for both create post and edit profile modals
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostModal = document.getElementById('createPostModal');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editModal = document.getElementById('edit-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtns = document.querySelectorAll('#closeModalBtn, #close-modal-btn');
    const cancelBtns = document.querySelectorAll('#cancelBtn, #cancel-btn');

    const profilePicInput = document.getElementById('profile-pic');
    const profilePreview = document.getElementById('profile-preview');
    const coverPhotoInput = document.getElementById('cover-photo');
    const coverPreview = document.getElementById('cover-preview');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePlaceholder = document.getElementById('imagePlaceholder');

    // GSAP timeline for modal animation, only if the edit modal exists
    if (editModal) {
        const tl = gsap.timeline({ paused: true });
        tl.to(editModal, {
            duration: 0.3,
            autoAlpha: 1,
            ease: "power2.inOut",
        }).to(modalContent, {
            duration: 0.3,
            scale: 1,
            opacity: 1,
            ease: "back.out(1.7)"
        }, "-=0.2");

        // Open modal function for edit modal
        const openEditModal = () => {
            editModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            tl.play();
        };

        // Event listeners for edit modal
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', openEditModal);
        }
    }


    // Function to open create post modal
    const openCreatePostModal = () => {
        if (createPostModal) {
            createPostModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };
    
    // Function to close any modal
    const closeModal = (modal) => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    // Event listeners to open modals
    if (createPostBtn) {
        createPostBtn.addEventListener('click', openCreatePostModal);
    }
    
    // Event listeners to close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.fixed');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    cancelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.fixed');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close on backdrop click
    if (createPostModal) {
        createPostModal.addEventListener('click', (e) => {
            if (e.target === createPostModal) {
                closeModal(createPostModal);
            }
        });
    }
    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                // Since editModal has GSAP, we handle it separately
                gsap.timeline({ paused: true }).to(editModal, { autoAlpha: 0, duration: 0.3 }).play();
                document.body.style.overflow = 'auto';
            }
        });
    }


    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (createPostModal && !createPostModal.classList.contains('hidden')) {
                closeModal(createPostModal);
            }
            if (editModal && !editModal.classList.contains('hidden')) {
                // We handle the GSAP animated modal here as well
                gsap.timeline({ paused: true }).to(editModal, { autoAlpha: 0, duration: 0.3 }).play();
                document.body.style.overflow = 'auto';
            }
        }
    });

    // Image preview functionality
    const createPreview = (input, preview) => {
        if (input) {
            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        preview.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    };

    if (profilePicInput && profilePreview) {
      createPreview(profilePicInput, profilePreview);
    }
    if (coverPhotoInput && coverPreview) {
      createPreview(coverPhotoInput, coverPreview);
    }
    if (imageUpload && imagePreviewContainer) {
      const img = document.createElement('img');
      imagePreviewContainer.appendChild(img);
      createPreview(imageUpload, img);
    }


    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });

    // Form validation and loading state
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i>Sharing...';
                submitBtn.disabled = true;
            }
        });
    });

    // Tab functionality
    const tabs = document.querySelectorAll('[id$="-tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => {
                t.classList.remove('bg-gradient-to-r', 'from-blue-500/20', 'to-purple-500/20', 'text-white');
                t.classList.add('text-gray-400', 'hover:text-white', 'hover:bg-gray-800/30');
            });

            this.classList.remove('text-gray-400', 'hover:text-white', 'hover:bg-gray-800/30');
            this.classList.add('bg-gradient-to-r', 'from-blue-500/20', 'to-purple-500/20', 'text-white');
        });
    });
});