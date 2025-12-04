// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ==========================================
// SMOOTH SCROLLING
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ==========================================
// MODAL FUNCTIONALITY
// ==========================================
const modal = document.getElementById('projectModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.querySelector('.modal-close');

openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// ==========================================
// LOAD PROJECTS FROM DATABASE
// ==========================================
async function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    
    try {
        const response = await fetch('api_get.php');
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            projectsGrid.innerHTML = '';
            
            result.data.forEach(project => {
                const technologies = project.technologies.split(',').map(tech => tech.trim());
                
                const projectCard = `
                    <div class="project-card">
                        <div class="project-image">
                            <div class="project-placeholder">${project.icon || '📁'}</div>
                        </div>
                        <div class="project-content">
                            <h3>${project.project_name}</h3>
                            <p>${project.description}</p>
                            <div class="project-tags">
                                ${technologies.map(tech => `<span>${tech}</span>`).join('')}
                            </div>
                            <div class="project-links">
                                ${project.demo_link ? `<a href="${project.demo_link}" target="_blank" class="project-link">Live Demo</a>` : ''}
                                ${project.source_link ? `<a href="${project.source_link}" target="_blank" class="project-link">Source Code</a>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                
                projectsGrid.innerHTML += projectCard;
            });
        } else {
            projectsGrid.innerHTML = '<div class="no-projects">Belum ada projek. Tambahkan projek pertama Anda!</div>';
        }
        
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = '<div class="error-message">Gagal memuat projek. Silakan refresh halaman.</div>';
    }
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', loadProjects);

// ==========================================
// CREATE PROJECT FORM HANDLER
// ==========================================
const projectForm = document.getElementById('projectForm');
const projectMessage = document.getElementById('projectMessage');

projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(projectForm);
    const submitBtn = projectForm.querySelector('.btn-submit');
    
    // Convert FormData to JSON
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Menyimpan...';
    
    // Hide previous messages
    projectMessage.style.display = 'none';
    projectMessage.className = 'form-message';
    
    try {
        const response = await fetch('api_create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        projectMessage.textContent = result.message;
        
        if (result.success) {
            projectMessage.classList.add('success');
            projectForm.reset();
            
            // Reload projects
            await loadProjects();
            
            // Close modal after 2 seconds
            setTimeout(() => {
                modal.style.display = 'none';
                projectMessage.style.display = 'none';
            }, 2000);
        } else {
            projectMessage.classList.add('error');
        }
        
        projectMessage.style.display = 'block';
        
    } catch (error) {
        projectMessage.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
        projectMessage.classList.add('error');
        projectMessage.style.display = 'block';
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Simpan Projek';
    }
});

// ==========================================
// CONTACT FORM HANDLER
// ==========================================
const contactForm = document.getElementById('contactForm');
const contactMessage = document.getElementById('contactMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('.btn-submit');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';
    
    contactMessage.style.display = 'none';
    contactMessage.className = 'form-message';
    
    try {
        const response = await fetch('submit_contact.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        contactMessage.textContent = result.message;
        
        if (result.success) {
            contactMessage.classList.add('success');
            contactForm.reset();
            
            setTimeout(() => {
                contactMessage.style.display = 'none';
            }, 5000);
        } else {
            contactMessage.classList.add('error');
        }
        
        contactMessage.style.display = 'block';
        
    } catch (error) {
        contactMessage.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
        contactMessage.classList.add('error');
        contactMessage.style.display = 'block';
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Pesan';
    }
});