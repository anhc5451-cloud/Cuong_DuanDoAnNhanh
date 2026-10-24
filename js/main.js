function initializeHomePage() {
  const newProducts = document.getElementById("new-products");
  const hotProducts = document.getElementById("hot-products");
  const saleProducts = document.getElementById("sale-products");

  const newArrivals = products.filter((product) => product.category === "new").slice(0, 6);
  renderProductCards(newProducts, newArrivals);
  renderProductCards(hotProducts, products.filter((product) => product.category === "hot").slice(0, 4));
  renderProductCards(saleProducts, products.filter((product) => product.category === "sale").slice(0, 6));

  const slideImage = document.getElementById("slide-img");
  if (!slideImage) return;

  const slideName = document.getElementById("slide-name");
  const slidePosition = document.getElementById("slide-position");
  let currentIndex = 2;

  const showSlide = (index) => {
    currentIndex = (index + products.length) % products.length;
    const product = products[currentIndex];
    slideImage.src = product.image;
    slideImage.alt = product.name;
    if (slideName) slideName.textContent = product.name;
    if (slidePosition) slidePosition.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(products.length).padStart(2, "0")}`;
  };

  document.querySelector('[data-slide="prev"]')?.addEventListener("click", () => showSlide(currentIndex - 1));
  document.querySelector('[data-slide="next"]')?.addEventListener("click", () => showSlide(currentIndex + 1));
  window.setInterval(() => showSlide(currentIndex + 1), 5000);
}

function initializeCatalogPage() {
  const container = document.getElementById("all-products");
  if (!container) return;

  const searchInput = document.getElementById("product-search");
  const categoryFilter = document.getElementById("product-category");
  const priceFilter = document.getElementById("product-price");
  const sortSelect = document.getElementById("product-sort");
  const productCount = document.getElementById("product-count");

  const updateCatalog = () => {
    const query = searchInput.value.trim().toLocaleLowerCase("vi");
    const filteredProducts = products.filter((product) => {
      const matchesQuery = product.name.toLocaleLowerCase("vi").includes(query);
      const matchesCategory = categoryFilter.value === "all" || product.type === categoryFilter.value;
      const matchesPrice = priceFilter.value === "under-30000"
        ? product.price < 30000
        : priceFilter.value === "30000-50000"
          ? product.price >= 30000 && product.price <= 50000
          : priceFilter.value === "over-50000"
            ? product.price > 50000
            : true;

      return matchesQuery && matchesCategory && matchesPrice;
    });

    if (sortSelect.value === "price-ascending") filteredProducts.sort((a, b) => a.price - b.price);
    if (sortSelect.value === "price-descending") filteredProducts.sort((a, b) => b.price - a.price);
    if (sortSelect.value === "name") filteredProducts.sort((a, b) => a.name.localeCompare(b.name, "vi"));

    renderProductCards(container, filteredProducts);
    if (productCount) productCount.textContent = `${filteredProducts.length} món ngon`;

    if (filteredProducts.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "empty-results";
      emptyMessage.textContent = "Không tìm thấy món phù hợp. Thử tìm bằng từ khóa khác nhé.";
      container.append(emptyMessage);
    }
  };

  searchInput.addEventListener("input", updateCatalog);
  categoryFilter.addEventListener("change", updateCatalog);
  priceFilter.addEventListener("change", updateCatalog);
  sortSelect.addEventListener("change", updateCatalog);
  updateCatalog();
}

updateCartCount();
initializeHomePage();
initializeCatalogPage();
initializeCartPage();
