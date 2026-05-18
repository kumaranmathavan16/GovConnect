const API_BASE = "http://localhost:8000/api";

// --- Mobile Navigation ---
const mobileMenuBtn = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// --- Admin Mobile Sidebar Toggle ---
const adminHamburger = document.getElementById('admin-hamburger');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

if (adminHamburger && sidebar) {
    adminHamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });
}

if (sidebar && mainContent) {
    mainContent.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
}

// --- Authentication ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        try {
            const response = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('admin_id', data.admin_id);
                window.location.href = 'dashboard.html';
            } else {
                document.getElementById('loginError').textContent = data.detail || 'Login failed';
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('loginError').textContent = 'Server error. Please try again later.';
        }
    });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('admin_id');
        window.location.href = 'login.html';
    });
}

// --- Citizen Submission ---
const complaintForm = document.getElementById('complaintForm');
if (complaintForm) {
    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        const formData = new FormData(complaintForm);
        try {
            const response = await fetch(`${API_BASE}/complaints/submit`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (response.ok) {
                complaintForm.classList.add('hidden');
                const resultDiv = document.getElementById('submissionResult');
                resultDiv.classList.remove('hidden');
                
                document.getElementById('resultTicketId').textContent = data.ticket_id;
                
                const catSpan = document.getElementById('resCategory');
                catSpan.textContent = data.prediction.category;
                
                const urgSpan = document.getElementById('resUrgency');
                urgSpan.textContent = data.prediction.urgency;
                urgSpan.className = `badge ${data.prediction.urgency.toLowerCase()}`;
                
            } else {
                alert('Failed to submit: ' + (data.detail || 'Unknown error'));
                submitBtn.textContent = 'Submit Grievance';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to server.');
            submitBtn.textContent = 'Submit Grievance';
            submitBtn.disabled = false;
        }
    });
}

// --- Dashboard Loading ---
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE}/dashboard/stats`);
        const data = await response.json();
        
        document.getElementById('totalComplaints').textContent = data.total_complaints;
        document.getElementById('highPriority').textContent = data.high_priority;
        document.getElementById('resolvedComplaints').textContent = data.resolved;
        document.getElementById('pendingComplaints').textContent = data.pending;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadCharts() {
    try {
        // District Chart
        const distRes = await fetch(`${API_BASE}/analytics/district`);
        const distData = await distRes.json();
        const distCtx = document.getElementById('districtChart');
        if (distCtx) {
            new Chart(distCtx, {
                type: 'bar',
                data: {
                    labels: distData.map(d => d.district),
                    datasets: [{
                        label: 'Complaints',
                        data: distData.map(d => d.count),
                        backgroundColor: 'rgba(43, 108, 176, 0.7)',
                        borderColor: 'rgba(43, 108, 176, 1)',
                        borderWidth: 1
                    }]
                },
                options: { responsive: true }
            });
        }

        // Category Chart
        const catRes = await fetch(`${API_BASE}/analytics/category`);
        const catData = await catRes.json();
        const catCtx = document.getElementById('categoryChart');
        if (catCtx) {
            new Chart(catCtx, {
                type: 'doughnut',
                data: {
                    labels: catData.map(d => d.category),
                    datasets: [{
                        data: catData.map(d => d.count),
                        backgroundColor: [
                            '#ed8936', '#48bb78', '#3182ce', '#e53e3e', '#805ad5', '#38b2ac'
                        ]
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        // Trend Chart
        const trendRes = await fetch(`${API_BASE}/analytics/trend`);
        const trendData = await trendRes.json();
        const trendCtx = document.getElementById('trendChart');
        if (trendCtx) {
            new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: trendData.map(d => d.month),
                    datasets: [{
                        label: 'Complaints Trend',
                        data: trendData.map(d => d.count),
                        borderColor: '#ed8936',
                        tension: 0.3,
                        fill: false
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

    } catch (error) {
        console.error('Error loading charts:', error);
    }
}

// --- Complaints List ---
let allComplaints = [];

async function loadComplaints() {
    try {
        const response = await fetch(`${API_BASE}/complaints`);
        allComplaints = await response.json();
        renderComplaints(allComplaints);
        
        // Setup filters
        const searchBox = document.getElementById('searchBox');
        const filterDistrict = document.getElementById('filterDistrict');
        const filterStatus = document.getElementById('filterStatus');
        
        const filterData = () => {
            const searchTerm = searchBox.value.toLowerCase();
            const district = filterDistrict.value;
            const status = filterStatus.value;
            
            const filtered = allComplaints.filter(c => {
                const matchSearch = c.ticket_id.toLowerCase().includes(searchTerm) || c.citizen_name.toLowerCase().includes(searchTerm);
                const matchDist = district ? c.district === district : true;
                const matchStatus = status ? c.status === status : true;
                return matchSearch && matchDist && matchStatus;
            });
            renderComplaints(filtered);
        };
        
        if(searchBox) searchBox.addEventListener('input', filterData);
        if(filterDistrict) filterDistrict.addEventListener('change', filterData);
        if(filterStatus) filterStatus.addEventListener('change', filterData);
        
    } catch (error) {
        console.error('Error loading complaints:', error);
    }
}

function renderComplaints(data) {
    const tbody = document.getElementById('complaintsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">No complaints found.</td></tr>';
        return;
    }
    
    data.forEach(c => {
        const tr = document.createElement('tr');
        
        const urgencyClass = c.urgency_level.toLowerCase();
        const statusClass = c.status.toLowerCase().replace(' ', '-');
        
        tr.innerHTML = `
            <td><strong>${c.ticket_id}</strong></td>
            <td>${c.citizen_name}</td>
            <td>${c.district}</td>
            <td>${c.predicted_category}</td>
            <td><span class="badge ${urgencyClass}">${c.urgency_level}</span></td>
            <td><span class="badge ${statusClass}">${c.status}</span></td>
            <td>
                <button class="btn-outline" onclick="openActionModal('${c.ticket_id}', '${c.status}')" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">
                    Update
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Public Status ---
async function loadPublicComplaints() {
    try {
        const response = await fetch(`${API_BASE}/complaints`);
        const data = await response.json();
        
        const tbody = document.getElementById('publicComplaintsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No complaints found.</td></tr>';
            return;
        }
        
        data.forEach(c => {
            const tr = document.createElement('tr');
            
            const urgencyClass = c.urgency_level.toLowerCase();
            const statusClass = c.status.toLowerCase().replace(' ', '-');
            
            // Masking name slightly for privacy in public view
            const maskedName = c.citizen_name.substring(0, 2) + "***" + c.citizen_name.substring(c.citizen_name.length - 1);
            
            tr.innerHTML = `
                <td><strong>${c.ticket_id}</strong></td>
                <td>${maskedName}</td>
                <td>${c.district}</td>
                <td>${c.predicted_category}</td>
                <td><span class="badge ${urgencyClass}">${c.urgency_level}</span></td>
                <td><span class="badge ${statusClass}">${c.status}</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading public complaints:', error);
    }
}

async function loadPriorityQueue() {
    try {
        const response = await fetch(`${API_BASE}/complaints`);
        const data = await response.json();
        
        // Data is already sorted by priority_score descending from backend
        // Filter out resolved ones for queue
        const queueData = data.filter(c => c.status !== 'Resolved');
        
        const container = document.getElementById('priorityQueueContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (queueData.length === 0) {
            container.innerHTML = '<p>No pending complaints in the queue.</p>';
            return;
        }
        
        queueData.forEach(c => {
            const urgencyClass = c.urgency_level.toLowerCase();
            const date = new Date(c.created_at).toLocaleString();
            
            const card = document.createElement('div');
            card.className = `queue-card ${urgencyClass}`;
            
            card.innerHTML = `
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <strong>${c.ticket_id}</strong>
                        <span class="badge ${urgencyClass}">Score: ${c.priority_score} - ${c.urgency_level}</span>
                    </div>
                    <h3 style="margin-bottom: 0.5rem; font-size: 1.1rem; color: #2d3748;">${c.predicted_category} - ${c.district}</h3>
                    <p style="color: #718096; font-size: 0.9rem; margin-bottom: 0.5rem;">${c.description}</p>
                    <div style="font-size: 0.8rem; color: #a0aec0;">
                        Submitted by ${c.citizen_name} on ${date} | Status: ${c.status}
                    </div>
                </div>
                <div style="margin-left: 2rem;">
                    <button class="btn-primary" onclick="openActionModal('${c.ticket_id}', '${c.status}')">Take Action</button>
                </div>
            `;
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading queue:', error);
    }
}

// --- Action Modal ---
const modal = document.getElementById('actionModal');
const closeBtn = document.querySelector('.close-modal');
const actionForm = document.getElementById('actionForm');

function openActionModal(ticketId, currentStatus) {
    document.getElementById('modalTicketId').textContent = ticketId;
    document.getElementById('actionTicketId').value = ticketId;
    document.getElementById('updateStatus').value = currentStatus;
    document.getElementById('actionNotes').value = '';
    
    modal.classList.remove('hidden');
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

if (modal) {
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

if (actionForm) {
    actionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const ticketId = document.getElementById('actionTicketId').value;
        const formData = new FormData(actionForm);
        formData.append('admin_id', sessionStorage.getItem('admin_id'));
        
        try {
            const response = await fetch(`${API_BASE}/complaints/${ticketId}/action`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                modal.classList.add('hidden');
                // Reload current view
                if (window.location.pathname.includes('complaints.html')) {
                    loadComplaints();
                } else if (window.location.pathname.includes('queue.html')) {
                    loadPriorityQueue();
                }
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server error');
        }
    });
}

function exportToCSV() {
    if(allComplaints.length === 0) return;
    
    const headers = ['Ticket ID', 'Citizen Name', 'Phone', 'District', 'Location', 'Category', 'Urgency', 'Priority Score', 'Status', 'Date'];
    
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    allComplaints.forEach(c => {
        const row = [
            c.ticket_id,
            `"${c.citizen_name}"`,
            c.phone_number,
            `"${c.district}"`,
            `"${c.location}"`,
            c.predicted_category,
            c.urgency_level,
            c.priority_score,
            c.status,
            `"${new Date(c.created_at).toLocaleString()}"`
        ];
        csvRows.push(row.join(','));
    });
    
    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'complaints_export.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
