// 1. Import Firebase modules (nếu dùng ES Module build)
// Hoặc bỏ qua phần này nếu bạn dùng thẳng từ CDN (ở trên)

const firebaseConfig = {
    apiKey: "AIzaSyDL6O2GUNEq9COG8BY097DoG7rNcM-Hcm0",
    authDomain: "fresh-food-market-5d143.firebaseapp.com",
    databaseURL: "https://fresh-food-market-5d143-default-rtdb.firebaseio.com",
    projectId: "fresh-food-market-5d143",
    storageBucket: "fresh-food-market-5d143.appspot.com",
    messagingSenderId: "935796564384",
    appId: "1:935796564384:web:c43cbf37a456e5948304c5",
    measurementId: "G-0E6MZHCF1F"
  };
  
  // 2. Khởi tạo Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
let cartItems = [];
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || {
    'admin': {
        password: 'admin123',
        isAdmin: true,
        balance: 1000000
    }
};

function showLoginForm() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function closeLoginForm() {
    document.getElementById('login-modal').classList.add('hidden');
}

function showRegisterForm() {
    document.getElementById('register-modal').classList.remove('hidden');
}

function closeRegisterForm() {
    document.getElementById('register-modal').classList.add('hidden');
}

function login(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
  
    const userRef = db.ref("users/" + username);
    userRef.get().then(snapshot => {
      if (!snapshot.exists()) {
        alert("Tài khoản không tồn tại!");
        return;
      }
  
      const data = snapshot.val();
      if (data.password === password) {
        currentUser = { username, balance: data.balance };
        updateUIAfterLogin(currentUser);
        closeLoginForm();
      } else {
        alert("Sai mật khẩu!");
      }
    });
  }
  

function register(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    const confirm = event.target["confirm-password"].value;
  
    if (password !== confirm) {
      alert("Mật khẩu không khớp!");
      return;
    }
  
    const userRef = db.ref("users/" + username);
    userRef.get().then(snapshot => {
      if (snapshot.exists()) {
        alert("Tài khoản đã tồn tại!");
      } else {
        userRef.set({
          password,
          balance: 0
        }).then(() => {
          alert("Đăng ký thành công!");
          closeRegisterForm();
        });
      }
    });
  }
  
function logout() {
    currentUser = null;
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('auth-buttons').classList.remove('hidden');
}

function clearLocalStorage() {
    localStorage.clear();
    users = {
        'admin': {
            password: 'admin123',
            isAdmin: true,
            balance: 1000000
        }
    };
    alert('Đã xóa toàn bộ dữ liệu!');
    location.reload();
}

function showDepositForm() {
    if (!currentUser) {
        alert('Vui lòng đăng nhập để nạp tiền!');
        return;
    }
    document.getElementById('deposit-modal').classList.remove('hidden');
}

function closeDepositForm() {
    document.getElementById('deposit-modal').classList.add('hidden');
}

function deposit(event) {
    event.preventDefault();
    const amount = parseInt(event.target.amount.value);
    if (!currentUser) return;
  
    const userRef = db.ref("users/" + currentUser.username);
    userRef.get().then(snapshot => {
      const currentBalance = snapshot.val().balance || 0;
      const newBalance = currentBalance + amount;
      userRef.update({ balance: newBalance }).then(() => {
        currentUser.balance = newBalance;
        document.getElementById("balance-display").textContent = newBalance + "đ";
        closeDepositForm();
        alert("Nạp tiền thành công!");
      });
    });
  }
  
function addToCart(event, productId) {
    event.stopPropagation();
    const product = products[productId];
    cartItems.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.images[0]
    });
    updateCart();
}

function updateCart() {
    const cartContent = document.getElementById('cart-items');
    const shippingInfo = document.getElementById('shipping-info');
    if (cartItems.length === 0) {
        cartContent.innerHTML = '<p>Giỏ hàng trống</p>';
        shippingInfo.classList.add('hidden');
    } else {
        let total = 0;
        cartContent.innerHTML = cartItems.map(item => {
            const price = parseInt(item.price.replace(/\D/g, ''));
            total += price;
            return `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                            <span>${item.name}</span>
                            <span>${item.price}</span>
                            <button onclick="removeFromCart('${item.id}')" class="remove-btn">Xóa</button>
                        </div>
                    `;
        }).join('') + `
                    <div class="cart-total">
                        <h3>Tổng tiền: ${total.toLocaleString()}đ</h3>
                        <button onclick="checkout()" class="checkout-btn">Thanh Toán</button>
                    </div>
                `;
    }
}

function checkout() {
    if (!currentUser) {
        alert('Vui lòng đăng nhập để thanh toán!');
        return;
    }

    const total = cartItems.reduce((sum, item) => {
        return sum + parseInt(item.price.replace(/\D/g, ''));
    }, 0);

    if (users[currentUser].balance >= total) {
        users[currentUser].balance -= total;
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('balance-display').textContent = users[currentUser].balance.toLocaleString();
        alert('Thanh toán thành công!');
        cartItems = [];
        updateCart();
        closeCart();
    } else {
        alert('Số dư không đủ để thanh toán! Vui lòng nạp thêm tiền.');
    }
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    updateCart();
}

const products = {
    rauCai: {
        name: "Rau Cải Ngọt",
        images: ["https://tse4.mm.bing.net/th/id/OIP.tT6eHG4cK15Y7h-p-b8aLwHaGo?rs=1&pid=ImgDetMain"],
        price: "15.000đ/kg",
        description: "Rau cải ngọt tươi từ vườn, đảm bảo không thuốc trừ sâu"
    },
    caRot: {
        name: "Cà Rốt",
        images: ["https://th.bing.com/th/id/R.09992bd09dcb791b0c69f1276591a970?rik=4mOqWrGhQXIJgQ&riu=http%3a%2f%2fwww.theayurveda.org%2fwp-content%2fuploads%2f2015%2f09%2fCarrot-fruits.jpg&ehk=VxTGCN5rKfbNmckesr1TgZwTJvbHrtJb%2byGuylQI7gc%3d&risl=&pid=ImgRaw&r=0"],
        price: "25.000đ/kg",
        description: "Cà rốt Đà Lạt tươi ngon, giàu vitamin A"
    },
    khoaiTay: {
        name: "Khoai Tây",
        images: ["https://thuocchuabenh.vn/wp-content/uploads/khoai-tay.jpg"],
        price: "35.000đ/kg",
        description: "Khoai tây Đà Lạt, củ to đều"
    },
    taoMy: {
        name: "Táo Mỹ",
        images: ["https://th.bing.com/th/id/OIP.zOQx5JSmnYp7WVu17RkSCAHaFj?rs=1&pid=ImgDetMain"],
        price: "95.000đ/kg",
        description: "Táo Mỹ nhập khẩu, ngọt giòn"
    },
    caHoi: {
        name: "Cá Hồi Fillet",
        images: ["https://gomeat.vn/upload/sanpham/cahoifillet2-16411142840.png"],
        price: "450.000đ/kg",
        description: "Cá hồi Na Uy tươi ngon, giàu omega-3"
    }
};

function showDetails(productId) {
    const product = products[productId];
    if (!product) return;

    const detailsContent = document.getElementById('details-content');
    detailsContent.innerHTML = `
    <div class="product-details-content">
        <h2>${product.name}</h2>
        <div class="product-image">
            <img src="${product.images[0]}" alt="${product.name}" style="max-width: 300px; height: auto; margin: 15px 0;">
        </div>
        <div class="product-info">
            <p class="price">${product.price}</p>
            <p class="description">${product.description}</p>
        </div>
    </div>
    `;

    document.getElementById('product-details').classList.remove('hidden');
}

function closeDetails() {
    document.getElementById('product-details').classList.add('hidden');
}

function showCart() {
    document.getElementById('cart').classList.remove('hidden');
}

function closeCart() {
    document.getElementById('cart').classList.add('hidden');
}

function showContact() {
    document.getElementById('contact').classList.remove('hidden');
}

function closeContact() {
    document.getElementById('contact').classList.add('hidden');
}

function showAdminPanel() {
    if (!currentUser || !users[currentUser].isAdmin) {
        alert('Bạn không có quyền truy cập!');
        return;
    }
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.classList.remove('hidden');

    // Hiển thị danh sách sản phẩm hiện tại
    const productList = document.createElement('div');
    productList.innerHTML = '<h3>Danh sách sản phẩm</h3>';
    for (let id in products) {
        productList.innerHTML += `
                <div class="product-item">
                    <img src="${products[id].images[0]}" alt="${products[id].name}" style="width: 50px; height: 50px;">
                    <span>${products[id].name} - ${products[id].price}</span>
                    <button onclick="removeProduct('${id}')">Xóa</button>
                </div>
            `;
    }

    // Thêm danh sách vào panel
    const form = adminPanel.querySelector('form');
    form.parentNode.insertBefore(productList, form);
}

function addProduct(name, price, image, description) {
    if (!currentUser || !users[currentUser].isAdmin) {
        alert('Chỉ admin mới có quyền thêm sản phẩm!');
        return;
    }
    const productId = name.toLowerCase().replace(/\s+/g, '');
    products[productId] = {
        name: name,
        images: [image],
        price: price,
        description: description
    };
    alert('Thêm sản phẩm thành công!');
    showAdminPanel(); // Làm mới danh sách
}

function removeProduct(productId) {
    if (!currentUser || !users[currentUser].isAdmin) {
        alert('Chỉ admin mới có quyền xóa sản phẩm!');
        return;
    }
    delete products[productId];
    alert('Xóa sản phẩm thành công!');
    showAdminPanel(); // Làm mới danh sách
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    }
}
function addProduct(name, price, image, description) {
    if (!currentUser || !users[currentUser].isAdmin) {
        alert('Chỉ admin mới có quyền thêm sản phẩm!');
        return;
    }
    const productId = name.toLowerCase().replace(/\s+/g, '');
    products[productId] = {
        name: name,
        images: [image],
        price: price,
        description: description
    };
    renderProducts();
    alert('Đã thêm sản phẩm thành công!');
}

function removeProduct(productId) {
    if (!currentUser || !users[currentUser].isAdmin) {
        alert('Chỉ admin mới có quyền xóa sản phẩm!');
        return;
    }
    delete products[productId];
    renderProducts();
    alert('Đã xóa sản phẩm thành công!');
}

function showAdminPanel() {
    if (!currentUser || !users[currentUser].isAdmin) {
        alert('Bạn không có quyền truy cập!');
        return;
    }
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.classList.remove('hidden');

    // Hiển thị danh sách sản phẩm hiện tại
    const productList = document.createElement('div');
    productList.innerHTML = '<h3>Danh sách sản phẩm hiện tại:</h3>';
    for (let id in products) {
        productList.innerHTML += `
            <div class="product-item">
                <p>${products[id].name} - ${products[id].price}</p>
                <button onclick="removeProduct('${id}')">Xóa</button>
            </div>
        `;
    }

    // Thêm danh sách vào trước form
    const form = adminPanel.querySelector('form');
    form.parentNode.insertBefore(productList, form);
}
