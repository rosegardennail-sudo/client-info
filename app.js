const STORAGE_KEY = 'roseGardenNailCustomersV1';

let customers = loadCustomers();
let manageMode = false;
let activeCustomerId = null;

const $ = (id) => document.getElementById(id);

function loadCustomers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCustomers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  renderAll();
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function currency(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? `$${n.toFixed(2)}` : '—';
}

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

function switchPage(pageId) {
  document.querySelectorAll('.page').forEach((page) => page.classList.remove('active-page'));
  $(pageId).classList.add('active-page');
  document.querySelectorAll('.nav-link').forEach((button) => {
    button.classList.toggle('active', button.dataset.page === pageId);
  });
  closeMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openMenu() {
  $('sideMenu').classList.add('open');
  $('sideMenu').setAttribute('aria-hidden', 'false');
  $('menuOverlay').classList.add('show');
}

function closeMenu() {
  $('sideMenu').classList.remove('open');
  $('sideMenu').setAttribute('aria-hidden', 'true');
  $('menuOverlay').classList.remove('show');
}

function renderStats() {
  const allVisits = customers.flatMap((customer) => customer.visits || []);
  const now = new Date();
  const monthly = allVisits.filter((visit) => {
    const date = new Date(`${visit.date}T00:00:00`);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });

  $('totalCustomers').textContent = customers.length;
  $('totalVisits').textContent = allVisits.length;
  $('monthlyVisits').textContent = monthly.length;
}

function renderCustomerTable() {
  const query = $('searchInput').value.trim().toLowerCase();
  const filtered = customers.filter((customer) => {
    const haystack = [customer.name, customer.gender, customer.features, customer.preferredTech, customer.notes, customer.tipPattern]
      .join(' ')
      .toLowerCase();
    return haystack.includes(query);
  });

  $('customerTableBody').innerHTML = filtered.map((customer) => `
    <tr>
      <td><button class="customer-name-button" data-view="${customer.id}">${escapeHtml(customer.name)}</button></td>
      <td>${escapeHtml(customer.gender || '未填写')}</td>
      <td>${escapeHtml(customer.features || '—')}</td>
      <td>${escapeHtml(customer.preferredTech || '—')}</td>
      <td>${escapeHtml(customer.notes || '—')}</td>
      <td>${customer.visits?.length || 0}</td>
      <td>${escapeHtml(customer.tipPattern || '—')}</td>
      <td class="manage-column ${manageMode ? '' : 'hidden'}">
        <div class="action-group">
          <button class="action-button" data-edit="${customer.id}">编辑</button>
          <button class="action-button danger" data-delete="${customer.id}">删除</button>
        </div>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('th.manage-column').forEach((el) => el.classList.toggle('hidden', !manageMode));
  $('emptyState').classList.toggle('show', filtered.length === 0);
}

function renderDetail() {
  if (!activeCustomerId) return;
  const customer = customers.find((item) => item.id === activeCustomerId);
  if (!customer) {
    switchPage('customersPage');
    return;
  }

  const visits = [...(customer.visits || [])].sort((a, b) => b.date.localeCompare(a.date));
  const totalSpent = visits.reduce((sum, visit) => sum + (Number(visit.amount) || 0), 0);
  const totalTips = visits.reduce((sum, visit) => sum + (Number(visit.tip) || 0), 0);

  $('detailContent').innerHTML = `
    <div class="detail-grid">
      <section class="profile-card">
        <p class="eyebrow">CUSTOMER PROFILE</p>
        <h2>${escapeHtml(customer.name)}</h2>
        <div class="profile-list">
          <div class="profile-item"><span>性别</span><strong>${escapeHtml(customer.gender || '未填写')}</strong></div>
          <div class="profile-item"><span>特征</span><strong>${escapeHtml(customer.features || '—')}</strong></div>
          <div class="profile-item"><span>常找的技师</span><strong>${escapeHtml(customer.preferredTech || '—')}</strong></div>
          <div class="profile-item"><span>注意事项</span><strong>${escapeHtml(customer.notes || '—')}</strong></div>
          <div class="profile-item"><span>小费情况</span><strong>${escapeHtml(customer.tipPattern || '—')}</strong></div>
          <div class="profile-item"><span>来访次数</span><strong>${visits.length}</strong></div>
          <div class="profile-item"><span>累计消费</span><strong>${currency(totalSpent)}</strong></div>
          <div class="profile-item"><span>累计小费</span><strong>${currency(totalTips)}</strong></div>
        </div>
        <button class="primary-button" id="addVisitButton">添加一次来访</button>
      </section>

      <section class="visits-card">
        <p class="eyebrow">VISIT HISTORY</p>
        <h2>来访记录</h2>
        <div class="visit-list">
          ${visits.length ? visits.map((visit) => `
            <article class="visit-item">
              <div class="visit-item-top">
                <strong>${escapeHtml(visit.service)}</strong>
                <span>${escapeHtml(visit.date)}</span>
              </div>
              <div class="visit-meta">
                技师：${escapeHtml(visit.technician || '未填写')}<br>
                金额：${currency(visit.amount)} · 小费：${currency(visit.tip)}<br>
                备注：${escapeHtml(visit.notes || '—')}
              </div>
              <div class="visit-actions"><button class="action-button danger" data-delete-visit="${visit.id}">删除本次记录</button></div>
            </article>
          `).join('') : '<div class="empty-state show">还没有来访记录。</div>'}
        </div>
      </section>
    </div>
  `;

  $('addVisitButton').addEventListener('click', () => openVisitDialog(customer.id));
}

function renderAll() {
  renderStats();
  renderCustomerTable();
  if ($('customerDetailPage').classList.contains('active-page')) renderDetail();
}

function openVisitDialog(customerId) {
  $('visitCustomerId').value = customerId;
  $('visitDate').value = new Date().toISOString().slice(0, 10);
  $('visitService').value = '';
  $('visitTechnician').value = '';
  $('visitAmount').value = '';
  $('visitTip').value = '';
  $('visitNotes').value = '';
  $('visitDialog').showModal();
}

function openEditDialog(customerId) {
  const customer = customers.find((item) => item.id === customerId);
  if (!customer) return;
  $('editCustomerId').value = customer.id;
  $('editName').value = customer.name;
  $('editGender').value = customer.gender || '未填写';
  $('editFeatures').value = customer.features || '';
  $('editPreferredTech').value = customer.preferredTech || '';
  $('editNotes').value = customer.notes || '';
  $('editTipPattern').value = customer.tipPattern || '';
  $('editDialog').showModal();
}

$('customerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  customers.unshift({
    id: uid(),
    name: $('customerName').value.trim(),
    gender: $('customerGender').value,
    features: $('customerFeatures').value.trim(),
    preferredTech: $('preferredTech').value.trim(),
    notes: $('customerNotes').value.trim(),
    tipPattern: $('tipPattern').value.trim(),
    createdAt: new Date().toISOString(),
    visits: []
  });
  saveCustomers();
  event.target.reset();
  showToast('顾客已保存');
});

$('visitForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const customer = customers.find((item) => item.id === $('visitCustomerId').value);
  if (!customer) return;
  customer.visits = customer.visits || [];
  customer.visits.push({
    id: uid(),
    date: $('visitDate').value,
    service: $('visitService').value.trim(),
    technician: $('visitTechnician').value.trim(),
    amount: $('visitAmount').value,
    tip: $('visitTip').value,
    notes: $('visitNotes').value.trim()
  });
  saveCustomers();
  $('visitDialog').close();
  showToast('来访记录已保存，次数已自动更新');
});

$('editCustomerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const customer = customers.find((item) => item.id === $('editCustomerId').value);
  if (!customer) return;
  customer.name = $('editName').value.trim();
  customer.gender = $('editGender').value;
  customer.features = $('editFeatures').value.trim();
  customer.preferredTech = $('editPreferredTech').value.trim();
  customer.notes = $('editNotes').value.trim();
  customer.tipPattern = $('editTipPattern').value.trim();
  saveCustomers();
  $('editDialog').close();
  showToast('顾客资料已更新');
});

$('customerTableBody').addEventListener('click', (event) => {
  const viewId = event.target.dataset.view;
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;

  if (viewId) {
    activeCustomerId = viewId;
    renderDetail();
    switchPage('customerDetailPage');
  }
  if (editId) openEditDialog(editId);
  if (deleteId && confirm('确定要删除这位顾客和她的全部来访记录吗？')) {
    customers = customers.filter((item) => item.id !== deleteId);
    saveCustomers();
    showToast('顾客已删除');
  }
});

$('detailContent').addEventListener('click', (event) => {
  const visitId = event.target.dataset.deleteVisit;
  if (!visitId || !activeCustomerId) return;
  if (!confirm('确定删除这次来访记录吗？')) return;
  const customer = customers.find((item) => item.id === activeCustomerId);
  customer.visits = (customer.visits || []).filter((visit) => visit.id !== visitId);
  saveCustomers();
  showToast('来访记录已删除');
});

$('searchInput').addEventListener('input', renderCustomerTable);
$('menuButton').addEventListener('click', openMenu);
$('closeMenuButton').addEventListener('click', closeMenu);
$('menuOverlay').addEventListener('click', closeMenu);
$('manageButton').addEventListener('click', () => {
  manageMode = !manageMode;
  $('manageButton').textContent = manageMode ? '完成' : '管理';
  renderCustomerTable();
  if (!$('customersPage').classList.contains('active-page')) switchPage('customersPage');
});
$('addFromCustomersButton').addEventListener('click', () => {
  switchPage('homePage');
  setTimeout(() => $('customerName').focus(), 250);
});
$('backToCustomers').addEventListener('click', () => switchPage('customersPage'));
$('closeVisitDialog').addEventListener('click', () => $('visitDialog').close());
$('closeEditDialog').addEventListener('click', () => $('editDialog').close());

document.querySelectorAll('.nav-link').forEach((button) => {
  button.addEventListener('click', () => switchPage(button.dataset.page));
});

renderAll();
