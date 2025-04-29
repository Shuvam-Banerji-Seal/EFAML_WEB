        
///// dimesnsions: 22.65 16.40
        
        // Loading animation
        window.addEventListener('load', function() {
            setTimeout(() => {
                document.querySelector('.loading-overlay').style.opacity = '0';
                setTimeout(() => {
                    document.querySelector('.loading-overlay').style.display = 'none';
                }, 1000);
            }, 800);
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