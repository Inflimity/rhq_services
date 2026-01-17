

document.addEventListener('DOMContentLoaded', function () {
    // --- 1. UI & NAVIGATION ELEMENTS ---
    const headerInner = document.getElementById('header-inner');
    const btn = document.getElementById('mobile-menu-btn');
    const hubClose = document.getElementById('menu-close-hub');
    const menu = document.getElementById('mobile-menu');
    const lines = [
        document.getElementById('line1'),
        document.getElementById('line2'),
        document.getElementById('line3')
    ];
    const links = document.querySelectorAll('.mobile-link');
    const successModal = document.getElementById('successModal');

    // --- 2. DYNAMIC REVEAL OBSERVER ---
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
            else entry.target.classList.remove('active');
        });
    }, revealOptions);
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 3. HEADER & MENU LOGIC ---
    window.addEventListener('scroll', () => {
        if (headerInner) {
            if (window.scrollY > 50) {
                headerInner.classList.replace('py-4', 'py-2');
            } else {
                headerInner.classList.replace('py-2', 'py-4');
            }
        }
    });

    function toggleMenu() {
        if (!menu) return;
        const isOpening = menu.classList.contains('translate-x-full');
        const radius = window.innerWidth < 400 ? 140 : 180;
        const startAngle = 90;
        const endAngle = 180;
        const step = (endAngle - startAngle) / (links.length - 1);

        if (isOpening) {
            menu.classList.remove('translate-x-full', 'pointer-events-none');
            menu.classList.add('pointer-events-auto');
            lines[0].classList.add('rotate-[35deg]', 'w-9');
            lines[1].classList.add('opacity-0');
            lines[2].classList.add('-rotate-[35deg]', 'w-9');

            links.forEach((link, index) => {
                const angle = startAngle + (index * step);
                const radians = angle * (Math.PI / 180);
                const x = Math.round(radius * Math.cos(radians));
                const y = Math.round(radius * Math.sin(radians));
                link.style.transform = `translate(0, 0)`;
                setTimeout(() => {
                    link.style.opacity = '1';
                    link.style.transform = `translate(${x}px, ${y}px)`;
                }, 100 + (index * 60));
            });
        } else {
            links.forEach(link => {
                link.style.transform = `translate(0, 0)`;
                link.style.opacity = '0';
            });
            setTimeout(() => {
                menu.classList.add('translate-x-full', 'pointer-events-none');
                menu.classList.remove('pointer-events-auto');
                lines[0].classList.remove('rotate-[35deg]', 'w-9');
                lines[1].classList.remove('opacity-0');
                lines[2].classList.remove('-rotate-[35deg]', 'w-9');
            }, 300);
        }
        document.body.classList.toggle('overflow-hidden');
    }

    if (btn) btn.addEventListener('click', toggleMenu);
    if (hubClose) hubClose.addEventListener('click', toggleMenu);
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (!menu.classList.contains('translate-x-full')) toggleMenu();
        });
    });

    // --- 4. CLOUDINARY WIDGET LOGIC ---
    const cloudUrlInput = document.getElementById('uploaded-file-url');
    const fileStatus = document.getElementById('file-status');
    const uploadBtn = document.getElementById("upload_widget");

    const myWidget = cloudinary.createUploadWidget({
        cloudName: 'dqnnxg1z3',
        uploadPreset: 'Recruitment',
        clientAllowedFormats: ["pdf", "doc", "docx"],
        maxFileSize: 5000000,
        multiple: false,
        styles: {
            palette: {
                window: "#1a1a1a",
                sourceBg: "#0a0a0a",
                windowBorder: "#ff4d00",
                tabIcon: "#ff4d00",
                inactiveTabIcon: "#ffffff",
                menuIcons: "#ff4d00",
                link: "#ff4d00",
                action: "#ff4d00",
                inProgress: "#ffffff",
                complete: "#20B832",
                error: "#E42424",
                textDark: "#000000",
                textLight: "#ffffff"
            }
        }
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            if (cloudUrlInput) cloudUrlInput.value = result.info.secure_url;
            if (fileStatus) {
                fileStatus.innerText = "Attached: " + result.info.original_filename;
                fileStatus.classList.remove('text-gray-400');
                fileStatus.classList.add('text-rhqOrange');
            }
        }
    });

    if (uploadBtn) {
        uploadBtn.addEventListener("click", () => myWidget.open(), false);
    }

    // --- 5. RECRUITMENT FORM HANDLER ---
    const recruitmentForm = document.getElementById('recruitmentForm');
    if (recruitmentForm) {
        recruitmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!cloudUrlInput || !cloudUrlInput.value) {
                alert("Please upload your resume before submitting.");
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            if (btnText) btnText.innerText = "Transmitting...";
            if (submitBtn) submitBtn.disabled = true;

            const data = Object.fromEntries(new FormData(recruitmentForm));

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(async (response) => {
                    console.log("Recruitment API Status:", response.status);
                    if (response.status == 200) {
                        if (successModal) successModal.classList.remove('hidden');
                        recruitmentForm.reset();
                        if (fileStatus) fileStatus.innerText = "No file attached";
                        if (cloudUrlInput) cloudUrlInput.value = "";
                    } else {
                        const res = await response.json();
                        alert(res.message || "Submission failed. Check Access Key.");
                    }
                })
                .catch(error => alert("Error: Check your connection."))
                .finally(() => {
                    if (btnText) btnText.innerText = "Send Application";
                    if (submitBtn) submitBtn.disabled = false;
                });
        });
    }

    // --- 6. CONTACT FORM HANDLER ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const contactSubmitBtn = document.getElementById('contactSubmitBtn');
            const contactBtnText = document.getElementById('contactBtnText');
            if (contactBtnText) contactBtnText.innerText = "TRANSMITTING...";
            if (contactSubmitBtn) contactSubmitBtn.disabled = true;

            const data = Object.fromEntries(new FormData(contactForm));

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(async (response) => {
                    console.log("Contact API Status:", response.status);
                    if (response.status == 200) {
                        if (successModal) successModal.classList.remove('hidden');
                        contactForm.reset();
                    } else {
                        const res = await response.json();
                        alert(res.message || "Submission failed. Check Access Key.");
                    }
                })
                .catch(error => alert("Error: Check your connection."))
                .finally(() => {
                    if (contactBtnText) contactBtnText.innerText = "SEND INQUIRY";
                    if (contactSubmitBtn) contactSubmitBtn.disabled = false;
                });
        });
    }

    // --- 7. MODAL CLOSING LOGIC ---
    window.closeModal = function () {
        if (successModal) successModal.classList.add('hidden');
    };
});