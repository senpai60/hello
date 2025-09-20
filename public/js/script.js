const createPostBtn = document.getElementById('createPostBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const createPostModal = document.getElementById('createPostModal');
        const imageUpload = document.getElementById('imageUpload');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        const imagePlaceholder = document.getElementById('imagePlaceholder');

        // Function to show the modal
        function showModal() {
            createPostModal.classList.remove('hidden');
        }

        // Function to hide the modal
        function hideModal() {
            createPostModal.classList.add('hidden');
        }

        // Event listeners for the buttons
        createPostBtn.addEventListener('click', showModal);
        closeModalBtn.addEventListener('click', hideModal);

        // Close modal when clicking outside of it
        createPostModal.addEventListener('click', (e) => {
            if (e.target.id === 'createPostModal') {
                hideModal();
            }
        });

        // Image preview logic
        imageUpload.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    let img = imagePreviewContainer.querySelector('img');
                    if (!img) {
                        img = document.createElement('img');
                        imagePreviewContainer.appendChild(img);
                    }
                    img.src = e.target.result;
                    imagePlaceholder.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            } else {
                // If no file is selected, remove the image and show the placeholder
                const img = imagePreviewContainer.querySelector('img');
                if (img) {
                    img.remove();
                }
                imagePlaceholder.classList.remove('hidden');
            }
        });