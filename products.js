document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".filter-btn");
    const products = document.querySelectorAll(".product-card");

    function filterProducts(category) {
        products.forEach(product => {
            if (category === "all" || product.dataset.category === category) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    }

    // Handle button clicks
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const category = button.dataset.category;
            filterProducts(category);
        });
    });

    // Handle URL category (from homepage)
    const params = new URLSearchParams(globalThis.location.search);
    const urlCategory = params.get("category");

    if (urlCategory) {
        filterProducts(urlCategory);

        buttons.forEach(btn => {
            btn.classList.remove("active");
            if (btn.dataset.category === urlCategory) {
                btn.classList.add("active");
            }
        });
    }
});
