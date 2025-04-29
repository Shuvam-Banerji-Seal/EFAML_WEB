// Loading animation
window.addEventListener('load', function() {
    // Initial loading animation
    setTimeout(() => {
        anime({
            targets: '.loading-overlay',
            opacity: 0,
            duration: 800,
            easing: 'easeOutCubic',
            complete: function() {
                document.querySelector('.loading-overlay').style.display = 'none';
                
                // Animate header elements
                anime({
                    targets: 'header',
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 1200,
                    easing: 'easeOutCubic'
                });
                
                // Animate the atom circles around the title
                anime({
                    targets: '.atom-title::before',
                    rotate: '360deg',
                    duration: 8000,
                    loop: true,
                    easing: 'linear'
                });
                
                anime({
                    targets: '.atom-title::after',
                    rotate: '-360deg',
                    duration: 12000,
                    loop: true,
                    easing: 'linear'
                });
                
                // Initialize section animations as they scroll into view
                initScrollAnimations();
            }
        });
    }, 800);
    
    // Add chemistry-themed particle animation
    updateParticlesConfig();
});

// Initialize scroll animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.category-section, .contact-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('category-section')) {
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [50, 0],
                        duration: 800,
                        easing: 'easeOutCubic',
                        complete: function() {
                            // Animate the member cards when section comes into view
                            animateMemberCards(entry.target);
                        }
                    });
                } else {
                    // Contact section animation
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [50, 0],
                        duration: 800,
                        easing: 'easeOutCubic'
                    });
                    
                    // Animate form elements
                    anime({
                        targets: entry.target.querySelectorAll('.form-group, .submit-btn'),
                        opacity: [0, 1],
                        translateY: [20, 0],
                        delay: anime.stagger(100, {start: 300}),
                        duration: 800,
                        easing: 'easeOutCubic'
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Function to animate member cards with staggered timing
function animateMemberCards(section) {
    const cards = section.querySelectorAll('.member-card');
    
    anime({
        targets: cards,
        opacity: [0, 1],
        translateY: [30, 0],
        rotateX: [10, 0],
        rotateZ: [2, 0],
        scale: [0.9, 1],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
    });
}

// Update particles.js configuration for chemistry theme
function updateParticlesConfig() {
    if (window.pJSDom && window.pJSDom[0]) {
        const pJS = window.pJSDom[0].pJS;
        
        // Chemistry-themed color palette
        const colors = ['#64b3f4', '#c2e59c', '#ff7e5f', '#feb47b'];
        
        // Update particles color and shape
        pJS.particles.color.value = colors;
        pJS.particles.shape.type = "circle";
        pJS.particles.size.value = 4;
        pJS.particles.size.random = true;
        pJS.particles.move.speed = 1.5;
        
        // Create connectivity lines between particles (like molecular bonds)
        pJS.particles.line_linked.enable = true;
        pJS.particles.line_linked.distance = 150;
        pJS.particles.line_linked.color = "#64b3f4";
        pJS.particles.line_linked.opacity = 0.4;
        
        // Apply changes
        pJS.fn.particlesRefresh();
    }
}

// Button animation for ripple effect
document.addEventListener('click', function(e) {
    if (e.target.closest('.submit-btn')) {
        const button = e.target.closest('.submit-btn');
        const bubble = button.querySelector('.submit-btn-bubble');
        
        // Set bubble position
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        bubble.style.left = x + 'px';
        bubble.style.top = y + 'px';
        
        // Animate bubble
        anime({
            targets: bubble,
            scale: 30,
            opacity: [0.5, 0],
            duration: 800,
            easing: 'easeOutCubic',
            complete: function() {
                bubble.style.transform = 'scale(0)';
            }
        });
    }
});

// 3D hover effect for member cards
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.member-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = (e.clientX - centerX) / 20;
        const distanceY = (e.clientY - centerY) / 20;
        
        if (rect.left <= e.clientX && e.clientX <= rect.right && 
            rect.top <= e.clientY && e.clientY <= rect.bottom) {
            
            anime({
                targets: card,
                rotateY: distanceX * -0.5,
                rotateX: distanceY * 0.5,
                duration: 100,
                easing: 'linear'
            });
        }
    });
});

// Reset card position when mouse leaves
document.querySelectorAll('.member-card').forEach(card => {
    card.addEventListener('mouseleave', function() {
        anime({
            targets: this,
            rotateY: 0,
            rotateX: 0,
            duration: 300,
            easing: 'easeOutQuad'
        });
    });
});

// Generate member cards HTML
function generateMemberCards(members) {
    return members.map(member => {
        const imagePath = member.image ? `images/${member.image}` : '';
        return `
            <div class="member-card" data-member="${member.name}">
                <div class="card-image">
                    ${imagePath ? 
                        `<img src="${imagePath}" alt="${member.name}">` : 
                        `<div class="placeholder-image">
                            <i class="fas fa-flask"></i>
                        </div>`
                    }
                </div>
                <div class="card-content">
                    <h3 class="name">${member.name}</h3>
                    <p class="position">${member.position}</p>
                    <p class="research">${member.research}</p>
                    <a href="members/${member.name.toLowerCase().replace(/ /g, '_')}.html" class="read-more">Read More</a>
                </div>
            </div>
        `;
    }).join('');
}

// Fetch and parse the JSONL data
fetch('data/lab_mem.jsonl')
    .then(response => response.text())
    .then(data => {
        // Parse JSONL (each line is a separate JSON object)
        const members = data.trim().split('\n').map(line => JSON.parse(line));
        
        // Group members by category
        const groupedMembers = {};
        members.forEach(member => {
            if (!groupedMembers[member.category]) {
                groupedMembers[member.category] = [];
            }
            groupedMembers[member.category].push(member);
        });
        
        // Create HTML for each category
        if (groupedMembers['Advisor']) {
            document.getElementById('advisorSection').innerHTML = `
                <h2>Research Advisor</h2>
                <div class="member-cards">
                    ${generateMemberCards(groupedMembers['Advisor'])}
                </div>
            `;
        }
        
        if (groupedMembers['Present Members']) {
            document.getElementById('presentMembersSection').innerHTML = `
                <h2>Present Members</h2>
                <div class="member-cards">
                    ${generateMemberCards(groupedMembers['Present Members'])}
                </div>
            `;
        }
        
        if (groupedMembers['Alumni']) {
            document.getElementById('alumniSection').innerHTML = `
                <h2>Alumni</h2>
                <div class="member-cards">
                    ${generateMemberCards(groupedMembers['Alumni'])}
                </div>
            `;
        }
        
        // Add click event listeners after cards are created
        document.querySelectorAll('.member-card').forEach(card => {
            card.addEventListener('click', function() {
                const memberName = this.dataset.member;
                const pageName = memberName.toLowerCase().replace(/ /g, '_');
                
                // Add click animation
                anime({
                    targets: this,
                    scale: [1, 0.9],
                    opacity: [1, 0.8],
                    duration: 300,
                    easing: 'easeInOutQuad',
                    complete: function() {
                        if (pageName === 'shuvam_banerji_seal') {
                            window.open('https://shuvam-banerji-seal.github.io', '_blank');
                        } else {
                            window.location.href = `members/${pageName}.html`;
                        }
                    }
                });
            });
        });
        
        // After loading member data, add molecular animations to the background
        addMolecularAnimations();
        
        // Initialize interactive card effects
        initInteractiveCardEffects();
    })
    .catch(error => {
        console.error('Error loading member data:', error);
    });

// Add molecular animations to the background
function addMolecularAnimations() {
    // Create floating molecule elements in the background
    const moleculeTypes = [
        { class: 'molecule-h2o', symbol: 'H<sub>2</sub>O' },
        { class: 'molecule-co2', symbol: 'CO<sub>2</sub>' },
        { class: 'molecule-ch4', symbol: 'CH<sub>4</sub>' },
        { class: 'molecule-benzene', symbol: 'C<sub>6</sub>H<sub>6</sub>' },
        { class: 'molecule-nacl', symbol: 'NaCl' }
    ];
    
    const container = document.createElement('div');
    container.className = 'floating-molecules';
    document.body.appendChild(container);
    
    // Add CSS for floating molecules
    const style = document.createElement('style');
    style.textContent = `
        .floating-molecules {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        }
        
        .molecule {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px rgba(100, 179, 244, 0.3);
            color: rgba(255, 255, 255, 0.8);
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
    
    // Create random molecules
    for (let i = 0; i < 20; i++) {
        const type = moleculeTypes[Math.floor(Math.random() * moleculeTypes.length)];
        const size = Math.random() * 30 + 40;
        
        const molecule = document.createElement('div');
        molecule.className = `molecule ${type.class}`;
        molecule.innerHTML = type.symbol;
        molecule.style.width = `${size}px`;
        molecule.style.height = `${size}px`;
        molecule.style.left = `${Math.random() * 100}%`;
        molecule.style.top = `${Math.random() * 100}%`;
        molecule.style.opacity = `${Math.random() * 0.3 + 0.1}`;
        
        container.appendChild(molecule);
        
        // Animate each molecule
        anime({
            targets: molecule,
            translateX: () => anime.random(-200, 200),
            translateY: () => anime.random(-200, 200),
            scale: () => [0.8, 1.2],
            rotate: () => anime.random(-360, 360),
            opacity: [0, molecule.style.opacity, 0],
            duration: () => anime.random(15000, 30000),
            delay: () => anime.random(0, 5000),
            easing: 'easeInOutQuad',
            loop: true,
            direction: 'alternate'
        });
    }
}

// Add interactive effects to member cards
function initInteractiveCardEffects() {
    const cards = document.querySelectorAll('.member-card');
    
    cards.forEach(card => {
        // Add chemical formula overlay animation on hover
        const formula = document.createElement('div');
        formula.className = 'chemical-formula';
        formula.innerHTML = getRandomChemicalFormula();
        formula.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(12, 20, 69, 0.8);
            color: rgba(255, 255, 255, 0.2);
            font-size: 100px;
            opacity: 0;
            z-index: -1;
            pointer-events: none;
            font-family: 'Courier New', monospace;
        `;
        card.appendChild(formula);
        
        // Hover animation for chemical formula
        card.addEventListener('mouseenter', function() {
            anime({
                targets: formula,
                opacity: [0, 0.1],
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutQuad'
            });
            
            // Pulse glow effect on hover
            anime({
                targets: card,
                boxShadow: [
                    '0 8px 32px rgba(31, 38, 135, 0.15)',
                    '0 8px 32px rgba(100, 179, 244, 0.4)',
                    '0 8px 32px rgba(31, 38, 135, 0.15)'
                ],
                duration: 1500,
                easing: 'easeInOutSine',
                loop: true
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: formula,
                opacity: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
            
            // Stop pulse animation
            anime.remove(card);
            
            // Reset box shadow
            anime({
                targets: card,
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                duration: 500,
                easing: 'easeOutQuad'
            });
        });
        
        // Animated background for card content
        const gradient = document.createElement('div');
        gradient.className = 'card-gradient-bg';
        gradient.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, 
                rgba(100, 179, 244, 0.05),
                rgba(255, 126, 95, 0.05),
                rgba(194, 229, 156, 0.05),
                rgba(100, 179, 244, 0.05)
            );
            background-size: 400% 400%;
            transform: translate(-25%, -25%);
            z-index: -1;
        `;
        
        // Find the card content element and add the gradient
        const cardContent = card.querySelector('.card-content');
        if (cardContent) {
            cardContent.style.position = 'relative';
            cardContent.style.overflow = 'hidden';
            cardContent.appendChild(gradient);
            
            // Animate the gradient
            anime({
                targets: gradient,
                translateX: ['0%', '-50%'],
                translateY: ['0%', '-50%'],
                duration: 15000,
                easing: 'linear',
                loop: true
            });
        }
    });
}

// Generate random chemical formulas for the hover effect
function getRandomChemicalFormula() {
    const formulas = [
        'Fe<sub>2</sub>O<sub>3</sub>',
        'SiO<sub>2</sub>',
        'Al<sub>2</sub>O<sub>3</sub>',
        'TiO<sub>2</sub>',
        'CaCO<sub>3</sub>',
        'NaCl',
        'C<sub>60</sub>',
        'H<sub>2</sub>O',
        'MgO',
        'ZnO',
        'Cu<sub>2</sub>O',
        'Ag<sub>2</sub>O'
    ];
    
    return formulas[Math.floor(Math.random() * formulas.length)];
}

// Add periodic table inspired navigation animation
function addPeriodicTableNav() {
    const nav = document.createElement('nav');
    nav.className = 'periodic-nav';
    nav.innerHTML = `
        <div class="element" data-section="advisorSection">
            <div class="atomic-number">1</div>
            <div class="symbol">Ad</div>
            <div class="name">Advisor</div>
        </div>
        <div class="element" data-section="presentMembersSection">
            <div class="atomic-number">2</div>
            <div class="symbol">Mb</div>
            <div class="name">Members</div>
        </div>
        <div class="element" data-section="alumniSection">
            <div class="atomic-number">3</div>
            <div class="symbol">Al</div>
            <div class="name">Alumni</div>
        </div>
        <div class="element" data-section="contact-section">
            <div class="atomic-number">4</div>
            <div class="symbol">Ct</div>
            <div class="name">Contact</div>
        </div>
    `;
    
    document.body.insertBefore(nav, document.querySelector('main'));
    
    // Add CSS for the periodic table navigation
    const style = document.createElement('style');
    style.textContent = `
        .periodic-nav {
            display: flex;
            justify-content: center;
            gap: 15px;
            padding: 20px 0;
            flex-wrap: wrap;
        }
        
        .element {
            width: 80px;
            height: 80px;
            border: 2px solid rgba(100, 179, 244, 0.7);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .element::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, 
                rgba(100, 179, 244, 0.2), 
                rgba(194, 229, 156, 0.2)
            );
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .element:hover::before {
            opacity: 1;
        }
        
        .element:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .atomic-number {
            font-size: 10px;
            position: absolute;
            top: 5px;
            left: 5px;
            opacity: 0.8;
        }
        
        .symbol {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 2px;
        }
        
        .name {
            font-size: 10px;
            opacity: 0.8;
        }
        
        @media screen and (max-width: 480px) {
            .element {
                width: 60px;
                height: 60px;
            }
            .symbol {
                font-size: 18px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add click event for smooth scrolling
    document.querySelectorAll('.element').forEach(element => {
        element.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            const section = document.getElementById(sectionId) || document.querySelector('.' + sectionId);
            
            if (section) {
                // Animate the element when clicked
                anime({
                    targets: this,
                    scale: [1, 0.8, 1],
                    rotate: [0, 5, 0],
                    duration: 500,
                    easing: 'easeInOutQuad'
                });
                
                // Smooth scroll to section
                window.scrollTo({
                    top: section.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize periodic table navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addPeriodicTableNav();
});

    // Fetch and parse the JSONL data
    fetch('data/lab_mem.jsonl')
    .then(response => response.text())
    .then(data => {
        // Parse JSONL (each line is a separate JSON object)
        const members = data.trim().split('\n').map(line => JSON.parse(line));
        
        // Group members by category
        const groupedMembers = {};
        members.forEach(member => {
            if (!groupedMembers[member.category]) {
                groupedMembers[member.category] = [];
            }
            groupedMembers[member.category].push(member);
        });
        
        // Create HTML for each category
        if (groupedMembers['Advisor']) {
            document.getElementById('advisorSection').innerHTML = `
                <h2>Research Advisor</h2>
                <div class="member-cards">
                    ${generateMemberCards(groupedMembers['Advisor'])}
                </div>
            `;
        }
        
        if (groupedMembers['Present Members']) {
            document.getElementById('presentMembersSection').innerHTML = `
                <h2>Present Members</h2>
                <div class="member-cards">
                    ${generateMemberCards(groupedMembers['Present Members'])}
                </div>
            `;
        }
        
        if (groupedMembers['Alumni']) {
            document.getElementById('alumniSection').innerHTML = `
                <h2>Alumni</h2>
                <div class="member-cards">
                    ${generateMemberCards(groupedMembers['Alumni'])}
                </div>
            `;
        }
        
    // Add click event listeners after cards are created
    document.querySelectorAll('.member-card').forEach(card => {
        card.addEventListener('click', function() {
            const memberName = this.dataset.member;
            const pageName = memberName.toLowerCase().replace(/ /g, '_');
            
            if (pageName === 'shuvam_banerji_seal') {
                window.open('https://shuvam-banerji-seal.github.io', '_blank');
            }
            else if (pageName === 'prof._dr._soumyajit_roy') {
                window.open('https://soumyajit-roy.com/', '_blank');
            }
            else {
                window.location.href = `html_pages/${pageName}.html`;
            }
        });
    });
    })
    .catch(error => console.error('Error loading member data:', error));

// Function to generate member cards HTML
function generateMemberCards(members) {
    return members.map(member => {
        const memberName = member.name;
        const pageName = memberName.toLowerCase().replace(/ /g, '_');
        
        // Create image element or placeholder
        let imageHtml;
        if (member.image) {
            imageHtml = `<img src="${member.image}" alt="${member.name}">`;
        } else {
            imageHtml = `<div class="placeholder-image"><i class="fas fa-user"></i></div>`;
        }
        
        return `
            <div class="member-card" data-member="${memberName}">
                <div class="card-image">
                    ${imageHtml}
                </div>
                <div class="card-content">
                    <h3 class="name">${member.name}</h3>
                    <p class="position">${member.position}</p>
                    ${member.research ? `<p class="research">${member.research}</p>` : ''}
                    <a href="html_pages/${pageName}.html" class="read-more">Read More</a>
                </div>
            </div>
        `;
    }).join('');
}
