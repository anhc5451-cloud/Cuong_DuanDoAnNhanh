const products = [
  {
    id: 1,
    name: "Gà rán cay đặc biệt",
    price: 45000,
    image: "anh/Gà rán cay đặc biệt.webp",
    category: "new",
    type: "ga-ran",
  },
  {
    id: 2,
    name: "Burger gà sốt phô mai",
    price: 55000,
    image: "anh/Burger gà sốt phô mai.webp",
    category: "new",
    type: "burger",
  },
  {
    id: 3,
    name: "Combo Gà Rán Siêu Hot",
    price: 120000,
    image: "anh/Combo Gà Rán Siêu Hot.webp",
    category: "hot",
    type: "combo",
  },
  {
    id: 4,
    name: "Đùi gà giòn tan",
    price: 35000,
    image: "anh/Đùi gà giòn tan.webp",
    category: "hot",
    type: "ga-ran",
  },
  {
    id: 5,
    name: "Gà rán sốt mật ong",
    price: 30000,
    image: "anh/Gà rán sốt mật ong (Sale).webp",
    category: "sale",
    type: "ga-ran",
  },
  {
    id: 6,
    name: "Khoai tây chiên lắc phô mai",
    price: 25000,
    image: "anh/Khoai tây chiên lắc phô mai.webp",
    category: "sale",
    type: "mon-phu",
  },
  {
    id: 7,
    name: "Đùi Gà Sốt Cay Đặc Biệt",
    price: 50000,
    image: "anh/Đùi Gà Sốt Cay Đặc Biệt.jpg",
    category: "hot",
    type: "ga-ran",
  },
  {
    id: 8,
    name: "Sữa Tươi Trân Châu Đường Đen",
    price: 35000,
    image: "anh/Sữa Tươi Trân Châu Đường Đen.jpg",
    category: "new",
    type: "do-uong",
  },
  {
    id: 9,
    name: "Cơm Gà Xối Mỡ",
    price: 60000,
    image: "anh/Cơm Gà Xối Mỡ.jpg",
    category: "new",
    type: "ga-ran",
  },
  {
    id: 10,
    name: "Cánh Gà Chiên Nước Mắm",
    price: 40000,
    image: "anh/Cánh Gà Chiên Nắm.jpg",
    category: "hot",
    type: "ga-ran",
  },
  {
    id: 11,
    name: "Coca Cola",
    price: 15000,
    image: "anh/Coca Cola.jpg?v=2",
    category: "sale",
    type: "do-uong",
  },
  {
    id: 12,
    name: "Hot Dog",
    price: 35000,
    image: "anh/Hot Dog.jpg",
    category: "new",
    type: "mon-phu",
  },
  {
    id: 13,
    name: "Khoai Tây Sốt Kem",
    price: 30000,
    image: "anh/Khoai Tây Lắc Phô Mai.jpg",
    category: "new",
    type: "mon-phu",
  },
  {
    id: 14,
    name: "Kem Vani",
    price: 20000,
    image: "anh/Kem Vani.jpg",
    category: "sale",
    type: "kem",
  },
  {
    id: 15,
    name: "Kem Socola",
    price: 22000,
    image: "anh/Kem Socola.jpg",
    category: "sale",
    type: "kem",
  },
  {
    id: 16,
    name: "Nước ngọt Sprite",
    price: 15000,
    image: "anh/Sprite.jpg",
    category: "sale",
    type: "do-uong",
  },
  {
    id: 17,
    name: "Mirinda Xá Xị",
    price: 15000,
    image: "anh/Mirinda Xá Xị.jpg",
    category: "sale",
    type: "do-uong",
  },
  {
    id: 18,
    name: "Trà xanh C2",
    price: 12000,
    image: "anh/C2.jpg",
    category: "sale",
    type: "do-uong",
  },
  { id: 19, name: "0 Độ", price: 12000, image: "anh/0 Độ.jpg", category: "sale", type: "do-uong" },
  {
    id: 20,
    name: "Fanta Cam",
    price: 15000,
    image: "anh/Fanta.jpg",
    category: "sale",
    type: "do-uong",
  },
  {
    id: 21,
    name: "Trà Ô Long",
    price: 15000,
    image: "anh/OLong.jpg",
    category: "sale",
    type: "do-uong",
  },
];

const categoryLabels = {
  new: "MÓN MỚI",
  hot: "BEST-SELLER",
  sale: "ƯU ĐÃI",
};

function formatCurrency(amount) {
  return `${new Intl.NumberFormat("vi-VN").format(amount)} ₫`;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image-wrap";

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";

  const tag = document.createElement("span");
  tag.className = "product-tag";
  tag.textContent = categoryLabels[product.category] || "MÓN NGON";
  imageWrap.append(image, tag);

  const info = document.createElement("div");
  info.className = "product-info";

  const name = document.createElement("h3");
  name.textContent = product.name;

  const bottom = document.createElement("div");
  bottom.className = "product-bottom";

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = formatCurrency(product.price);

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "add-to-cart";
  addButton.textContent = "＋ Thêm món";
  addButton.setAttribute("aria-label", `Thêm ${product.name} vào giỏ hàng`);
  addButton.addEventListener("click", () => {
    if (addToCart(product.id)) {
      addButton.textContent = "Đã thêm ✓";
      window.setTimeout(() => {
        addButton.textContent = "＋ Thêm món";
      }, 1200);
    }
  });

  bottom.append(price, addButton);
  info.append(name, bottom);
  card.append(imageWrap, info);
  return card;
}

function renderProductCards(container, items) {
  if (!container) return;

  const fragment = document.createDocumentFragment();
  items.forEach((product) => fragment.append(createProductCard(product)));
  container.replaceChildren(fragment);
}
