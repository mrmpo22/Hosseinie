/**
 * حسینیه سیدالشهدا - فایل جاوااسکریپت
 * مدیریت تمام عملکردهای سایت
 */

// ========== کلاس مدیریت داده‌ها ==========
class DataManager {
    constructor() {
        this.storageKeys = {
            social: 'hosseinieh_social_links',
            daily: 'hosseinieh_daily_programs',
            archive: 'hosseinieh_archive',
            files: 'hosseinieh_files',
            auth: 'hosseinieh_auth'
        };
        this.initializeData();
    }

    // مقداردهی اولیه داده‌ها
    initializeData() {
        if (!this.getData('social')) {
            this.saveData('social', [
                { id: 1, name: 'تلگرام', url: 'https://t.me/hosseinieh' },
                { id: 2, name: 'اینستاگرام', url: 'https://instagram.com/hosseinieh' },
                { id: 3, name: 'واتساپ', url: 'https://wa.me/989123456789' }
            ]);
        }

        if (!this.getData('daily')) {
            this.saveData('daily', [
                {
                    id: 1,
                    group: 'قاسم',
                    title: 'مراسم عزاداری',
                    description: 'مجلس عزاداری حضرت اباعبدالله (ع)',
                    time: '18:00'
                },
                {
                    id: 2,
                    group: 'فهمیده',
                    title: 'قرائت قرآن',
                    description: 'برگزاری جلسه قرائت و تفسیر قرآن',
                    time: '17:00'
                },
                {
                    id: 3,
                    group: 'عمار',
                    title: 'جلسه درس اخلاق',
                    description: 'آموزش معارف اسلامی و اخلاق',
                    time: '19:30'
                }
            ]);
        }

        if (!this.getData('archive')) {
            this.saveData('archive', [
                {
                    id: 1,
                    title: 'مراسم عاشورا ۱۴۰۲',
                    description: 'مراسم عزاداری روز عاشورای حسینی',
                    date: '1402-01-10',
                    category: 'محرم',
                    fileUrl: '#'
                },
                {
                    id: 2,
                    title: 'شب احیاء رمضان',
                    description: 'برنامه احیای شب‌های قدر ماه رمضان',
                    date: '1402-02-19',
                    category: 'رمضان',
                    fileUrl: '#'
                }
            ]);
        }

        if (!this.getData('files')) {
            this.saveData('files', []);
        }
    }

    // دریافت داده
    getData(key) {
        try {
            const data = localStorage.getItem(this.storageKeys[key]);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('خطا در دریافت داده:', error);
            return null;
        }
    }

    // ذخیره داده
    saveData(key, data) {
        try {
            localStorage.setItem(this.storageKeys[key], JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('خطا در ذخیره داده:', error);
            return false;
        }
    }

    // اضافه کردن آیتم
    addItem(key, item) {
        const data = this.getData(key) || [];
        item.id = Date.now();
        data.push(item);
        return this.saveData(key, data);
    }

    // حذف آیتم
    deleteItem(key, id) {
        let data = this.getData(key) || [];
        data = data.filter(item => item.id !== id);
        return this.saveData(key, data);
    }

    // ویرایش آیتم
    updateItem(key, id, newData) {
        let data = this.getData(key) || [];
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...newData };
            return this.saveData(key, data);
        }
        return false;
    }

    // چک کردن احراز هویت
    isAuthenticated() {
        const auth = localStorage.getItem(this.storageKeys.auth);
        return auth === 'true';
    }

    // ست کردن احراز هویت
    setAuthentication(value) {
        localStorage.setItem(this.storageKeys.auth, value.toString());
    }
}

// ========== کلاس مدیریت UI ==========
class UIManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.currentTab = 'social';
    }

    // نمایش Toast
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // رندر شبکه‌های اجتماعی
    renderSocialLinks() {
        const socialLinks = this.dataManager.getData('social') || [];
        const container = document.getElementById('socialLinks');
        
        if (socialLinks.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">هیچ لینکی موجود نیست</p>';
            return;
        }

        container.innerHTML = socialLinks.map(link => `
            <div class="social-card">
                <a href="${link.url}" target="_blank">${link.name}</a>
            </div>
        `).join('');
    }

    // رندر برنامه‌های روزانه
    renderDailyPrograms() {
        const programs = this.dataManager.getData('daily') || [];
        const container = document.getElementById('dailyProgramsGrid');

        if (programs.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">هیچ برنامه‌ای برای امروز ثبت نشده است</p>';
            return;
        }

        container.innerHTML = programs.map(program => `
            <div class="program-card">
                <div class="group-name">🎯 ${program.group === 'قاسم' ? 'گروه حضرت قاسم بن الحسن (ع)' : 
                    program.group === 'فهمیده' ? 'گروه شهید فهمیده' : 'گروه حضرت عمار بن یاسر'}</div>
                <h3>${program.title}</h3>
                <span class="program-time">⏰ ${program.time}</span>
                <p>${program.description}</p>
            </div>
        `).join('');
    }

    // رندر آرشیو
    renderArchive(searchTerm = '', category = '') {
        let archive = this.dataManager.getData('archive') || [];
        const container = document.getElementById('archiveGrid');

        // فیلتر بر اساس جستجو و دسته‌بندی
        if (searchTerm) {
            archive = archive.filter(item => 
                item.title.includes(searchTerm) || 
                item.description.includes(searchTerm)
            );
        }

        if (category) {
            archive = archive.filter(item => item.category === category);
        }

        if (archive.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">موردی یافت نشد</p>';
            return;
        }

        container.innerHTML = archive.map(item => `
            <div class="archive-card">
                <div class="archive-card-content">
                    <h3>${item.title}</h3>
                    <div class="archive-meta">
                        <span class="archive-date">📅 ${item.date}</span>
                        <span class="archive-category">${item.category}</span>
                    </div>
                    <p>${item.description}</p>
                    <a href="${item.fileUrl}" class="btn btn-primary" style="font-size: 0.9rem; padding: 8px 16px;">مشاهده / دانلود</a>
                </div>
            </div>
        `).join('');
    }

    // رندر لیست شبکه‌های اجتماعی در تنظیمات
    renderSocialList() {
        const socialLinks = this.dataManager.getData('social') || [];
        const container = document.getElementById('socialList');

        if (socialLinks.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">لینکی موجود نیست</p>';
            return;
        }

        container.innerHTML = socialLinks.map(link => `
            <div class="item-card">
                <div class="item-info">
                    <h4>${link.name}</h4>
                    <p>${link.url}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-delete" onclick="app.deleteSocialLink(${link.id})">حذف</button>
                </div>
            </div>
        `).join('');
    }

    // رندر لیست برنامه‌های روزانه در تنظیمات
    renderDailyList() {
        const programs = this.dataManager.getData('daily') || [];
        const container = document.getElementById('dailyList');

        if (programs.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">برنامه‌ای موجود نیست</p>';
            return;
        }

        container.innerHTML = programs.map(program => `
            <div class="item-card">
                <div class="item-info">
                    <h4>${program.title} - ${program.group}</h4>
                    <p>${program.description} (⏰ ${program.time})</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-delete" onclick="app.deleteDailyProgram(${program.id})">حذف</button>
                </div>
            </div>
        `).join('');
    }

    // رندر لیست آرشیو در تنظیمات
    renderArchiveList() {
        const archive = this.dataManager.getData('archive') || [];
        const container = document.getElementById('archiveList');

        if (archive.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">آرشیوی موجود نیست</p>';
            return;
        }

        container.innerHTML = archive.map(item => `
            <div class="item-card">
                <div class="item-info">
                    <h4>${item.title}</h4>
                    <p>${item.category} - ${item.date}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-delete" onclick="app.deleteArchive(${item.id})">حذف</button>
                </div>
            </div>
        `).join('');
    }

    // رندر فایل‌ها
    renderFiles() {
        const files = this.dataManager.getData('files') || [];
        const container = document.getElementById('filesList');

        if (files.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">فایلی موجود نیست</p>';
            return;
        }

        container.innerHTML = files.map(file => `
            <div class="file-item">
                <img src="${file.data}" alt="${file.name}">
                <button onclick="app.deleteFile(${file.id})">حذف</button>
                <p style="padding: 5px; font-size: 0.8rem; text-align: center;">${file.category}</p>
            </div>
        `).join('');
    }

    // تغییر تب
    switchTab(tabName) {
        // غیرفعال کردن همه تب‌ها
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // فعال کردن تب انتخاب شده
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.currentTab = tabName;

        // رندر محتوای تب
        switch(tabName) {
            case 'social':
                this.renderSocialList();
                break;
            case 'daily':
                this.renderDailyList();
                break;
            case 'archive':
                this.renderArchiveList();
                break;
            case 'files':
                this.renderFiles();
                break;
        }
    }
}

// ========== کلاس اصلی اپلیکیشن ==========
class HosseiniehApp {
    constructor() {
        this.dataManager = new DataManager();
        this.uiManager = new UIManager(this.dataManager);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAll();
        this.checkAuthentication();
    }

    // تنظیم Event Listeners
    setupEventListeners() {
        // منوی همبرگری
        const menuToggle = document.getElementById('menuToggle');
        const mainNav = document.getElementById('mainNav');
        menuToggle?.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        // کلید مخفی
        const hiddenKey = document.getElementById('hiddenKey');
        hiddenKey?.addEventListener('click', () => {
            this.showPasswordModal();
        });

        // Modal رمز عبور
        document.getElementById('submitPassword')?.addEventListener('click', () => {
            this.checkPassword();
        });

        document.getElementById('closePasswordModal')?.addEventListener('click', () => {
            this.hidePasswordModal();
        });

        // ورودی رمز - Enter key
        document.getElementById('passwordInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkPassword();
            }
        });

        // بستن تنظیمات
        document.getElementById('closeSettings')?.addEventListener('click', () => {
            this.hideSettings();
        });

        // تب‌های تنظیمات
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.uiManager.switchTab(tabName);
            });
        });

        // فرم‌ها
        this.setupForms();

        // فیلترهای آرشیو
        document.getElementById('searchArchive')?.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            const category = document.getElementById('filterCategory').value;
            this.uiManager.renderArchive(searchTerm, category);
        });

        document.getElementById('filterCategory')?.addEventListener('change', (e) => {
            const category = e.target.value;
            const searchTerm = document.getElementById('searchArchive').value;
            this.uiManager.renderArchive(searchTerm, category);
        });
    }

    // تنظیم فرم‌ها
    setupForms() {
        // فرم شبکه‌های اجتماعی
        document.getElementById('socialForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSocialLink();
        });

        // فرم برنامه‌های روزانه
        document.getElementById('dailyForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addDailyProgram();
        });

        // فرم آرشیو
        document.getElementById('archiveForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addArchive();
        });

        // آپلود فایل
        document.getElementById('uploadFiles')?.addEventListener('click', () => {
            this.uploadFiles();
        });
    }

    // چک کردن احراز هویت
    checkAuthentication() {
        if (this.dataManager.isAuthenticated()) {
            // کاربر قبلاً لاگین کرده
            // می‌تونیم یک نشانگر نمایش بدیم
        }
    }

    // نمایش Modal رمز
    showPasswordModal() {
        const modal = document.getElementById('passwordModal');
        modal.classList.add('active');
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }

    // مخفی کردن Modal رمز
    hidePasswordModal() {
        const modal = document.getElementById('passwordModal');
        modal.classList.remove('active');
    }

    // چک کردن رمز
    checkPassword() {
        const passwordInput = document.getElementById('passwordInput');
        const password = passwordInput.value;

        // رمز صحیح: 123456
        if (password === '123456') {
            this.dataManager.setAuthentication(true);
            this.hidePasswordModal();
            this.showSettings();
            this.uiManager.showToast('ورود موفقیت‌آمیز بود', 'success');
        } else {
            this.uiManager.showToast('رمز عبور اشتباه است', 'error');
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    // نمایش پنل تنظیمات
    showSettings() {
        const panel = document.getElementById('settingsPanel');
        panel.classList.add('active');
        this.uiManager.switchTab('social');
    }

    // مخفی کردن پنل تنظیمات
    hideSettings() {
        const panel = document.getElementById('settingsPanel');
        panel.classList.remove('active');
        this.renderAll();
    }

    // رندر همه
    renderAll() {
        this.uiManager.renderSocialLinks();
        this.uiManager.renderDailyPrograms();
        this.uiManager.renderArchive();
    }

    // اضافه کردن لینک شبکه اجتماعی
    addSocialLink() {
        const name = document.getElementById('socialName').value.trim();
        const url = document.getElementById('socialUrl').value.trim();

        if (!name || !url) {
            this.uiManager.showToast('لطفاً تمام فیلدها را پر کنید', 'error');
            return;
        }

        const newLink = { name, url };
        if (this.dataManager.addItem('social', newLink)) {
            this.uiManager.showToast('لینک با موفقیت اضافه شد', 'success');
            document.getElementById('socialForm').reset();
            this.uiManager.renderSocialList();
            this.uiManager.renderSocialLinks();
        }
    }

    // حذف لینک شبکه اجتماعی
    deleteSocialLink(id) {
        if (confirm('آیا از حذف این لینک مطمئن هستید؟')) {
            if (this.dataManager.deleteItem('social', id)) {
                this.uiManager.showToast('لینک حذف شد', 'success');
                this.uiManager.renderSocialList();
                this.uiManager.renderSocialLinks();
            }
        }
    }

    // اضافه کردن برنامه روزانه
    addDailyProgram() {
        const group = document.getElementById('groupSelect').value;
        const title = document.getElementById('programTitle').value.trim();
        const description = document.getElementById('programDesc').value.trim();
        const time = document.getElementById('programTime').value;

        if (!title || !description || !time) {
            this.uiManager.showToast('لطفاً تمام فیلدها را پر کنید', 'error');
            return;
        }

        const newProgram = { group, title, description, time };
        if (this.dataManager.addItem('daily', newProgram)) {
            this.uiManager.showToast('برنامه با موفقیت اضافه شد', 'success');
            document.getElementById('dailyForm').reset();
            this.uiManager.renderDailyList();
            this.uiManager.renderDailyPrograms();
        }
    }

    // حذف برنامه روزانه
    deleteDailyProgram(id) {
        if (confirm('آیا از حذف این برنامه مطمئن هستید؟')) {
            if (this.dataManager.deleteItem('daily', id)) {
                this.uiManager.showToast('برنامه حذف شد', 'success');
                this.uiManager.renderDailyList();
                this.uiManager.renderDailyPrograms();
            }
        }
    }

    // اضافه کردن به آرشیو
    addArchive() {
        const title = document.getElementById('archiveTitle').value.trim();
        const description = document.getElementById('archiveDesc').value.trim();
        const date = document.getElementById('archiveDate').value;
        const category = document.getElementById('archiveCategory').value;
        const fileInput = document.getElementById('archiveFile');

        if (!title || !description || !date) {
            this.uiManager.showToast('لطفاً فیلدهای الزامی را پر کنید', 'error');
            return;
        }

        const newArchive = { 
            title, 
            description, 
            date, 
            category,
            fileUrl: fileInput.files.length > 0 ? URL.createObjectURL(fileInput.files[0]) : '#'
        };

        if (this.dataManager.addItem('archive', newArchive)) {
            this.uiManager.showToast('آرشیو با موفقیت اضافه شد', 'success');
            document.getElementById('archiveForm').reset();
            this.uiManager.renderArchiveList();
            this.uiManager.renderArchive();
        }
    }

    // حذف آرشیو
    deleteArchive(id) {
        if (confirm('آیا از حذف این آرشیو مطمئن هستید؟')) {
            if (this.dataManager.deleteItem('archive', id)) {
                this.uiManager.showToast('آرشیو حذف شد', 'success');
                this.uiManager.renderArchiveList();
                this.uiManager.renderArchive();
            }
        }
    }

    // آپلود فایل‌ها
    uploadFiles() {
        const fileInput = document.getElementById('fileUpload');
        const category = document.getElementById('fileCategory').value;
        const files = fileInput.files;

        if (files.length === 0) {
            this.uiManager.showToast('لطفاً فایلی انتخاب کنید', 'error');
            return;
        }

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newFile = {
                    name: file.name,
                    category: category,
                    data: e.target.result
                };
                this.dataManager.addItem('files', newFile);
            };
            reader.readAsDataURL(file);
        });

        setTimeout(() => {
            this.uiManager.showToast(`${files.length} فایل آپلود شد`, 'success');
            fileInput.value = '';
            this.uiManager.renderFiles();
        }, 500);
    }

    // حذف فایل
    deleteFile(id) {
        if (confirm('آیا از حذف این فایل مطمئن هستید؟')) {
            if (this.dataManager.deleteItem('files', id)) {
                this.uiManager.showToast('فایل حذف شد', 'success');
                this.uiManager.renderFiles();
            }
        }
    }
}

// ========== راه‌اندازی اپلیکیشن ==========
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new HosseiniehApp();
    console.log('✅ سایت حسینیه سیدالشهدا با موفقیت بارگذاری شد');
});
