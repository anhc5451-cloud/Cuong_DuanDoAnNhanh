const CART_STORAGE_KEY = "cart";

function readCart() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (!savedCart) return [];

  let parsedCart;
  try {
    parsedCart = JSON.parse(savedCart);
  } catch (error) {
    console.error("Không thể đọc dữ liệu giỏ hàng đã lưu.", error);
    return [];
  }

  if (!Array.isArray(parsedCart)) {
    console.error("Dữ liệu giỏ hàng đã lưu không hợp lệ.");
    return [];
  }

  const quantities = new Map();
  parsedCart.forEach((item) => {
    if (!item || typeof item !== "object") return;

    const productExists = products.some((product) => product.id === item.id);
    if (productExists && Number.isSafeInteger(item.quantity) && item.quantity > 0) {
      quantities.set(item.id, (quantities.get(item.id) || 0) + item.quantity);
    }
  });

  return Array.from(quantities, ([id, quantity]) => ({ id, quantity }));
}

let cart = readCart();

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) {
    console.error(`Không tìm thấy sản phẩm có mã ${productId}.`);
    return false;
  }

  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  return true;
}

function setCartQuantity(productId, quantity) {
  if (!Number.isSafeInteger(quantity)) return;

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const cartItem = cart.find((item) => item.id === productId);
  if (!cartItem) return;

  cartItem.quantity = quantity;
  saveCart();
}

function removeFromCart(productId) {
  const updatedCart = cart.filter((item) => item.id !== productId);
  if (updatedCart.length === cart.length) return;

  cart = updatedCart;
  saveCart();
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = String(totalQuantity);
}

function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const entries = cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.id),
  })).filter((item) => item.product);

  const quantityCount = entries.reduce((sum, item) => sum + item.quantity, 0);
  const itemCount = document.getElementById("cart-item-count");
  if (itemCount) itemCount.textContent = `${quantityCount} món`;

  const subtotal = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const subtotalElement = document.getElementById("cart-subtotal");
  const totalElement = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");
  if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
  if (totalElement) totalElement.textContent = formatCurrency(subtotal);
  if (checkoutButton) checkoutButton.disabled = entries.length === 0;

  if (entries.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-cart";

    const message = document.createElement("p");
    message.textContent = "Giỏ hàng đang trống. Chọn vài món ngon nhé!";

    const link = document.createElement("a");
    link.className = "button button-primary";
    link.href = "SanPham.html";
    link.textContent = "Khám phá thực đơn →";

    emptyMessage.append(message, link);
    container.replaceChildren(emptyMessage);
    return;
  }

  const fragment = document.createDocumentFragment();
  entries.forEach(({ id, quantity, product }) => {
    const row = document.createElement("article");
    row.className = "cart-row";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;

    const details = document.createElement("div");
    const name = document.createElement("h3");
    name.className = "cart-product-name";
    name.textContent = product.name;
    const price = document.createElement("p");
    price.className = "cart-product-price";
    price.textContent = formatCurrency(product.price);
    details.append(name, price);

    const actions = document.createElement("div");
    actions.className = "cart-row-actions";

    const quantityControl = document.createElement("div");
    quantityControl.className = "quantity-control";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.dataset.action = "decrease";
    decrease.dataset.productId = String(id);
    decrease.setAttribute("aria-label", `Giảm số lượng ${product.name}`);
    decrease.textContent = "−";
    const quantityValue = document.createElement("span");
    quantityValue.textContent = String(quantity);
    const increase = document.createElement("button");
    increase.type = "button";
    increase.dataset.action = "increase";
    increase.dataset.productId = String(id);
    increase.setAttribute("aria-label", `Tăng số lượng ${product.name}`);
    increase.textContent = "+";
    quantityControl.append(decrease, quantityValue, increase);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-item";
    remove.dataset.action = "remove";
    remove.dataset.productId = String(id);
    remove.setAttribute("aria-label", `Xóa ${product.name} khỏi giỏ hàng`);
    remove.textContent = "×";
    actions.append(quantityControl, remove);

    row.append(image, details, actions);
    fragment.append(row);
  });

  container.replaceChildren(fragment);
}

function initializeCartPage() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const checkoutButton = document.getElementById("checkout-button");
  checkoutButton?.addEventListener("click", () => {
    if (cart.length === 0) return;

    if (typeof readSignedInUser !== "function" || !readSignedInUser()) {
      window.alert("Vui lòng đăng nhập trước khi thanh toán.");
      window.location.href = "DangNhap.html";
      return;
    }

    const total = cart.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    window.alert(`Thanh toán thành công!\nTổng đơn hàng: ${formatCurrency(total)}\n(Bản demo không phát sinh giao dịch thực tế.)`);
    cart = [];
    saveCart();
  });

  container.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const productId = Number(button.dataset.productId);
    const cartItem = cart.find((item) => item.id === productId);
    if (!cartItem) return;

    if (button.dataset.action === "increase") setCartQuantity(productId, cartItem.quantity + 1);
    if (button.dataset.action === "decrease") setCartQuantity(productId, cartItem.quantity - 1);
    if (button.dataset.action === "remove") removeFromCart(productId);
  });

  renderCart();
}
