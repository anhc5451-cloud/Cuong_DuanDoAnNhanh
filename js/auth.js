const ACCOUNTS_STORAGE_KEY = "fastfood-accounts";
const SESSION_STORAGE_KEY = "fastfood-user";
const THEME_STORAGE_KEY = "fastfood-theme";

function readAccounts() {
  const savedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!savedAccounts) return [];

  try {
    const accounts = JSON.parse(savedAccounts);
    if (!Array.isArray(accounts)) throw new TypeError("Danh sách tài khoản không hợp lệ.");
    return accounts.filter((account) => (
      account
      && typeof account.name === "string"
      && typeof account.email === "string"
      && typeof account.password === "string"
    ));
  } catch (error) {
    console.error("Không thể đọc dữ liệu tài khoản đã lưu.", error);
    throw new Error("Dữ liệu tài khoản bị lỗi. Vui lòng xóa dữ liệu tài khoản đã lưu và thử lại.");
  }
}

function readSignedInUser() {
  const savedUser = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!savedUser) return null;

  try {
    const user = JSON.parse(savedUser);
    return user && typeof user.name === "string" && typeof user.email === "string" ? user : null;
  } catch (error) {
    console.error("Không thể đọc trạng thái đăng nhập đã lưu.", error);
    return null;
  }
}

function updateAuthNavigation() {
  const user = readSignedInUser();
  document.querySelectorAll("[data-login-link]").forEach((link) => {
    link.hidden = Boolean(user);
  });
  document.querySelectorAll("[data-user-profile]").forEach((link) => {
    link.hidden = !user;
    link.title = user ? `Hồ sơ người dùng: ${user.name}` : "Hồ sơ người dùng";
    link.setAttribute("aria-label", user ? `Hồ sơ người dùng: ${user.name}` : "Hồ sơ người dùng");
  });
  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.hidden = !user;
  });
}

function initializeThemeToggle() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const theme = savedTheme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = theme;

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const updateButton = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      button.textContent = isDark ? "☀" : "☾";
      button.setAttribute("aria-label", isDark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối");
      button.setAttribute("aria-pressed", String(isDark));
    };
    updateButton();
    button.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      updateButton();
    });
  });
}

function setFormMessage(element, message, isError = true) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("is-error", isError);
  element.classList.toggle("is-success", !isError);
}

function initializeRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  const message = document.getElementById("register-message");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim().toLocaleLowerCase("vi");
    const password = form.elements.password.value;
    const confirmPassword = form.elements.confirmPassword.value;

    if (!name || !email || !password || !confirmPassword) {
      setFormMessage(message, "Vui lòng điền đầy đủ các trường thông tin.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormMessage(message, "Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }
    if (password.length < 6) {
      setFormMessage(message, "Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setFormMessage(message, "Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const accounts = readAccounts();
      if (accounts.some((account) => account.email.toLocaleLowerCase("vi") === email)) {
        setFormMessage(message, "Email này đã được đăng ký.");
        return;
      }
      accounts.push({ name, email, password });
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      setFormMessage(message, "Đăng ký thành công! Đang chuyển đến trang đăng nhập.", false);
      form.reset();
      window.setTimeout(() => {
        window.location.href = "DangNhap.html";
      }, 1000);
    } catch (error) {
      console.error("Không thể đăng ký tài khoản.", error);
      setFormMessage(message, error.message || "Không thể lưu tài khoản. Vui lòng thử lại.");
    }
  });
}

function initializeLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const message = document.getElementById("login-message");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.elements.email.value.trim().toLocaleLowerCase("vi");
    const password = form.elements.password.value;

    if (!email || !password) {
      setFormMessage(message, "Vui lòng nhập email và mật khẩu.");
      return;
    }

    try {
      const account = readAccounts().find((item) => (
        item.email.toLocaleLowerCase("vi") === email && item.password === password
      ));
      if (!account) {
        setFormMessage(message, "Email hoặc mật khẩu không chính xác.");
        return;
      }
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ name: account.name, email: account.email }));
      setFormMessage(message, `Đăng nhập thành công. Xin chào ${account.name}!`, false);
      updateAuthNavigation();
      form.reset();
      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    } catch (error) {
      console.error("Không thể đăng nhập.", error);
      setFormMessage(message, error.message || "Không thể đăng nhập. Vui lòng thử lại.");
    }
  });
}

function initializeProfilePage() {
  const form = document.getElementById("profile-form");
  if (!form) return;

  const message = document.getElementById("profile-message");
  const user = readSignedInUser();
  if (!user) {
    window.location.replace("DangNhap.html");
    return;
  }

  const accounts = readAccounts();
  const account = accounts.find((item) => item.email === user.email);
  if (!account) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    window.location.replace("DangNhap.html");
    return;
  }

  form.elements.name.value = account.name;
  form.elements.email.value = account.email;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const currentPassword = form.elements.currentPassword.value;
    const newPassword = form.elements.newPassword.value;
    const confirmPassword = form.elements.confirmPassword.value;

    if (!name || !currentPassword) {
      setFormMessage(message, "Vui lòng nhập họ tên và mật khẩu hiện tại.");
      return;
    }
    if (account.password !== currentPassword) {
      setFormMessage(message, "Mật khẩu hiện tại không chính xác.");
      return;
    }
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        setFormMessage(message, "Mật khẩu mới phải có ít nhất 6 ký tự.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setFormMessage(message, "Mật khẩu xác nhận không khớp.");
        return;
      }
      account.password = newPassword;
    }

    try {
      account.name = name;
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ name: account.name, email: account.email }));
      setFormMessage(message, "Cập nhật thông tin thành công.", false);
      form.elements.currentPassword.value = "";
      form.elements.newPassword.value = "";
      form.elements.confirmPassword.value = "";
      updateAuthNavigation();
    } catch (error) {
      console.error("Không thể cập nhật thông tin tài khoản.", error);
      setFormMessage(message, "Không thể lưu thay đổi. Vui lòng thử lại.");
    }
  });
}

document.querySelectorAll("[data-logout]").forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    updateAuthNavigation();
    window.location.href = "index.html";
  });
});

initializeThemeToggle();
updateAuthNavigation();
initializeRegisterForm();
initializeLoginForm();
initializeProfilePage();
