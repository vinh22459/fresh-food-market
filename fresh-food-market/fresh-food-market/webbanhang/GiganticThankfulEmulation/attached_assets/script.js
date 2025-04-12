function showDetails(productId) {
    const details = {
        iphone13: {
            name: "iPhone 13",
            images: ["iphone13.jpg", "matsauiphone13.jpg"],
            price: "12.000.000 VND",
            specs: `
                <ul>
                    <li>Chipset: A15 Bionic</li>
                    <li>Màn hình: OLED, 6.1 inch</li>
                    <li>Camera sau: 12MP</li>
                    <li>Camera trước: 12MP</li>
                    <li>Pin: 3240mAh, sạc nhanh 20W</li>
                    <li>Hệ điều hành: iOS 15</li>
                </ul>
            `
        },
        galaxyS21: {
            name: "Samsung Galaxy S21",
            images: ["galaxys21.jpg", "galaxys21tim.jpg"],
            price: "18.000.000 VND",
            specs: `
                <ul>
                    <li>Chipset: Exynos 2100</li>
                    <li>Màn hình: Dynamic AMOLED 2X, 6.2 inch</li>
                    <li>Camera sau: 64MP</li>
                    <li>Camera trước: 10MP</li>
                    <li>Pin: 4000mAh, sạc nhanh 25W</li>
                    <li>Hệ điều hành: Android 11</li>
                </ul>
            `
        },
        xiaomiMi11: {
            name: "Xiaomi Mi 11",
            images: ["xiaomi11.jpg", "xiaomi11cauhinh.jpg"],
            price: "11.000.000 VND",
            specs: `
                <ul>
                    <li>Chipset: Snapdragon 888</li>
                    <li>Màn hình: AMOLED, 6.81 inch</li>
                    <li>Camera sau: 108MP</li>
                    <li>Camera trước: 20MP</li>
                    <li>Pin: 4600mAh, sạc nhanh 55W</li>
                    <li>Hệ điều hành: MIUI 12.5</li>
                </ul>
            `
        },
        onePlus9: {
            name: "OnePlus 9",
            images: ["oneplus9.jpg", "oneplus9cauhinh.jpg"],
            price: "10.000.000 VND",
            specs: `
                <ul>
                    <li>Chipset: Snapdragon 888</li>
                    <li>Màn hình: Fluid AMOLED, 6.55 inch</li>
                    <li>Camera sau: 48MP</li>
                    <li>Camera trước: 16MP</li>
                    <li>Pin: 4500mAh, sạc nhanh 65W</li>
                    <li>Hệ điều hành: OxygenOS 11</li>
                </ul>
            `
        }
    };

    let product = details[productId];
    let html = `<h2>${product.name}</h2>`;
    product.images.forEach(img => {
        html += `<img src="${img}" width="300">`;
    });
    html += `<p><strong>Giá:</strong> ${product.price}</p>`;
    html += `<p><strong>Thông số chi tiết:</strong></p> ${product.specs}`;

    document.getElementById("details-content").innerHTML = html;
    document.getElementById("product-details").classList.remove("hidden");
}

function closeDetails() {
    document.getElementById("product-details").classList.add("hidden");
}

function showCart() {
    document.getElementById("cart").classList.remove("hidden");
}

function closeCart() {
    document.getElementById("cart").classList.add("hidden");
}

function showContact() {
    document.getElementById("contact").classList.remove("hidden");
}

function closeContact() {
    document.getElementById("contact").classList.add("hidden");
}
