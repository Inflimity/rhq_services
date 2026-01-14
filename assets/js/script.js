
document.addEventListener('DOMContentLoaded', function () {
    const headerInner = document.getElementById('header-inner');
    const btn = document.getElementById('mobile-menu-btn');
    const hubClose = document.getElementById('menu-close-hub');
    const menu = document.getElementById('mobile-menu');
    const lines = [document.getElementById('line1'), document.getElementById('line2'), document.getElementById('line3')];
    const links = document.querySelectorAll('.mobile-link');

    // 1. DYNAMIC REVEAL OBSERVER
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
            else entry.target.classList.remove('active');
        });
    }, revealOptions);
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 2. HEADER SHRINK
    window.addEventListener('scroll', () => {
        if (headerInner) {
            if (window.scrollY > 50) {
                headerInner.classList.remove('py-4');
                headerInner.classList.add('py-2');
            } else {
                headerInner.classList.remove('py-2');
                headerInner.classList.add('py-4');
            }
        }
    });

    // 3. SPIRAL MENU WITH POINTER EVENT FIX
    function toggleMenu() {
        if (!menu) return;
        const isOpening = menu.classList.contains('translate-x-full');

        // Inside your toggleMenu Open Logic
        const radius = window.innerWidth < 400 ? 140 : 180;
        const startAngle = 90; // Start fanning from the bottom
        const endAngle = 180;  // End fanning at the left
        const step = (endAngle - startAngle) / (links.length - 1); // Dynamically calculates spacing

        links.forEach((link, index) => {
            const angle = startAngle + (index * step);
            const radians = angle * (Math.PI / 180);
            const x = Math.round(radius * Math.cos(radians));
            const y = Math.round(radius * Math.sin(radians));

            link.style.transform = `translate(0, 0)`; // Reset
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = `translate(${x}px, ${y}px)`;
            }, 100 + (index * 60));
        });

        if (isOpening) {
            menu.classList.remove('translate-x-full');
            menu.classList.remove('pointer-events-none'); // ENABLE CLICKS
            menu.classList.add('pointer-events-auto');

            lines[0].classList.add('rotate-[35deg]', 'w-9');
            lines[1].classList.add('opacity-0');
            lines[2].classList.add('-rotate-[35deg]', 'w-9');

            // Responsive Radius
            const radius = window.innerWidth < 400 ? 140 : 180;
            const startAngle = 90;
            const endAngle = 180;
            const step = (endAngle - startAngle) / (links.length - 1);

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
            // Close Menu
            links.forEach(link => {
                link.style.transform = `translate(0, 0)`;
                link.style.opacity = '0';
            });
            setTimeout(() => {
                menu.classList.add('translate-x-full');
                menu.classList.add('pointer-events-none'); // DISABLE CLICKS
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
});