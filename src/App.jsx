import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import ProductDetails from "./ProductDetails";
import shopLogo from "./sm-transparent.png";

const productNames = [
  // Mobiles (10 products)
  ["Samsung Galaxy A35", 28999, "Mobiles", "phone", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_KSTcWtRYcsAvQYMtNZrwKiAqsNejcx-APO8QvxSAZQ&s=10"],
  ["iPhone 15", 64999, "Mobiles", "iphone", "https://inspireonline.in/cdn/shop/files/iPhone_15_Pro_Max_Blue_Titanium_PDP_Image_Position-1__en-IN.jpg?v=1694758548&width=1445"],
  ["Redmi Note 14 5G", 17499, "Mobiles", "mobile", "https://media-ik.croma.com/Croma%20Assets/Communication/Mobiles/Images/312111_0_ppy4au.png"],
  ["iphone 17", 82999, "Mobiles", "android-phone", "https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/original/apple/494741635/0/kJZiCDvbI1-zv5nKgBuLs-Apple-iPhone-17-Pro-494741635-i-1-1200Wx1200H.jpeg"],
  ["Motorola Edge 50", 27999, "Mobiles", "smartphone", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREh7b3o5Wy6tvysJn9lnsOBeq_tj1kASuY7ZivaJ7uZQwJ6iuLDzwIBpaD&s=10"],
  ["OnePlus 12", 45999, "Mobiles", "smartphone", "https://oasis.opstatics.com/content/dam/oasis/page/2023/cn/12/12-black.png"],
  ["Vivo X100", 52999, "Mobiles", "smartphone", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5PAKAnOmZYxC2sCfBzIOjgMJ9_rQOgRpofSku79e5sGJzo8t8wZgUYsFQ&s=10"],
  ["Oppo F25", 22999, "Mobiles", "smartphone", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhKnyySRN5pE8AyHBLQmgzGAXb0u4Yp8pkozvNT1ZdWXXKEoF2kSa555Y&s=10"],
  ["Nothing 3a 5G", 39999, "Mobiles", "smartphone", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4El-a5IpoJtTja91tm1qufDf34wpkwq2V57-PHNUiNFD1q3dYsNhdXQs&s=10"],
  
  // Electronics (15 products)
  ["MacBook Pro 14", 139999, "Electronics", "laptop", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1Nz1216PhwBITkVKSYAX5Gb9QbwMGJ7D6MjuzwpE9NkwqZdouvWzablSP&s=10"],
  ["ASUS TUF Gaming Laptop", 89999, "Electronics", "gaming-laptop", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrgCIG4t6R_YqHGOlRB2nvysyqNv-4jSFD3IptweIZCg&s=10"],
  ["Dell XPS 13", 99999, "Electronics", "laptop", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDD5XgnY12RhB3EqLOra83cj7L5-xVTMRQgrNN95zOsIMiFpcn_OY2vB8&s=10"],
  ["Sony WH-1000XM5 Headphones", 24999, "Electronics", "headphones", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNcit-2dW5MKlkZr5-DccYjl8PlLmR-DCNbTfC1OfMJH6G1qmKOT6ktlw5&s=10"],
  ["JBL Bluetooth Speaker", 4999, "Electronics", "speaker", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbtpZKC_WXVyChpk2XdX4FJLIBp5P9Dm7OdUKI9L6X0nx0CtAc1sbMMMG9&s=10"],
  ["Apple Watch Series 9", 39999, "Electronics", "smartwatch", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMIFvzUXYNLjginj-SoEU9MQTOMShoc-Fg3bM3fHbmJ0kPWsxF9PLyMFs&s=10"],
  ["Samsung 55 inch QLED TV", 59999, "Electronics", "television", "https://media-ik.croma.com/Croma%20Assets/Entertainment/Television/Images/305600_0_brthv4.png"],
  ["iPad Air M4", 54999, "Electronics", "tablet", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbKNiIRidcnBK58CfyylD7HegDste7GkVMaE3HP9il1gKDiGOhEEb-hZU&s=10"],
  ["Canon EOS R6 Camera", 179999, "Electronics", "camera", "https://rukmini1.flixcart.com/image/1500/1500/xif0q/dslr-camera/6/a/q/-original-imahgget2bqwm3za.jpeg?q=70"],
  ["Anker PowerCore 50000mAh", 3499, "Electronics", "powerbank", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgosfZ8GCAR0Ms3vFS4m9FP2ajFWL6R3T_psODC_L0nABk3qhPyHUBRk0&s=10"],
  ["Logitech MX Master Mouse", 7999, "Electronics", "computer-mouse", "https://images.unsplash.com/photo-1527814050087-3793815479db?w=700&h=700&fit=crop"],
  ["Mechanical Gaming Keyboard", 8999, "Electronics", "keyboard", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUnpUiQKRwkJAPo89jx-SyUTRq2vf9VNsMxfmihrBL8f1rq1JPKRaUcgD1&s=10"],
  ["Baseus 65W USB-C Charger", 2999, "Electronics", "charger", "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=700&h=700&fit=crop"],
  ["NZXT Monitor 4K 32inch", 34999, "Electronics", "monitor", "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=700&h=700&fit=crop"],
  ["Gaming Mouse Pad", 1999, "Electronics", "mousepad", "https://images.unsplash.com/photo-1527814050087-3793815479db?w=700&h=700&fit=crop"],
  
  // Fashion (15 products)
  ["Premium Cotton Shirt", 999, "Fashion", "mens-shirt", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfnJqCnr6OQ2SbI4mZN1rPHqJRqcpsVOH7CifwE5IX_-MA1JF6fa_WcP6K&s=10"],
  ["Designer Kurti Set", 499, "Fashion", "kurti", "https://pictures.kartmax.in/live/inside/800x800/sites/9s145MyZrWdIAwpU0JYS/product-images/blue_cotton_printed_kurti_set_with_matching_dupatta_1721382380as3003891.jpg"],
  ["Nike Running Shoes", 6999, "Fashion", "running-shoes", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&h=700&fit=crop"],
  ["Blue Denim Jacket", 3499, "Fashion", "denim-jacket", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShQHHCHk6gjC3Q3DG-8Mgd-vMBuY2xsCXniCX3FyWR4hr5ILOapxTNDAQ&s=10"],
  ["Italian Leather Wallet", 2999, "Fashion", "wallet", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&h=700&fit=crop"],
  ["Fossil Analog Watch", 999, "Fashion", "watch", "https://images-static.nykaa.com/media/catalog/product/2/7/273d914FOSSI00003801_1.jpg?tr=w-500"],
  ["Travel Backpack 40L", 3999, "Fashion", "backpack", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&h=700&fit=crop"],
  ["Polarized Sunglasses", 1999, "Fashion", "sunglasses", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&h=700&fit=crop"],
  ["Gold Hair Clips Set", 899, "Fashion", "hair-accessories", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&h=700&fit=crop"],
  ["White Sneakers", 1499, "Fashion", "sneakers", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuZEA96PtIHeQeMRgz-ETmH3lpCV89xeuoLcle1o0S4qenJd6Afr05H-c&s=10"],
  ["Formal Blazer", 2499, "Fashion", "blazer", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8bVQZIegHcSnn3zn9N2fOT_B1nMT69AgW4ZuZ2M3QkEcKfQvO_YIZvHI&s=10"],
  ["Saree Collection", 2999, "Fashion", "saree", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtEmgSWQI04I5xKSBALNCIUKl1M7HY7s2wDyzgzItVXW2VbglohvlVXWqU&s=10"],
  ["Baggy pant", 299, "Fashion", "pant", "https://rukminim2.flixcart.com/image/480/640/xif0q/shopsy-track-pant/0/v/x/l-baggy-ne-234-xpecto-style-original-imahf77rvxkthzg3.jpeg?q=90"],
  ["T-Shirt", 199, "Fashion", "t-shirt", "https://thebridgestore.in/cdn/shop/files/JColeFront.jpg?v=1756449359"],
  
  // Beauty (7 products)
  ["VLCC De-TAn", 99,  "Beauty", "Sun cream", "https://cdn2.momjunction.com/wp-content/uploads/2021/02/VLCC-De-Tan-Sunscreen-Gel-Creme.jpg.webp"],
  ["Lipstick ", 99,  "Beauty", "lipstick", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2pT_GigAxmtoe4H404mUAr-sj4iPz0FCaovElT-AcpIHU2cKzoWmJ_vA&s=10"],
  ["Venusia Sun Tint", 849,  "Beauty", "Sun cream", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ97ZAhaQu9uoAER4UVH9T3GRI6q29__BLtoLLNqaNujw&s"],
  ["Z perfume", 3999,  "Beauty", "perfume", "https://images.meesho.com/images/products/232255396/zmgpf_512.webp?width=512"],
  ["Makup kit", 1499, "Beauty", "kit", "https://images-static.nykaa.com/media/catalog/product/2/e/2eaddc6SUGAR00000558d_GS.jpg?tr=w-500"],
  ["Everyouth",  99,  "Beauty", "face-creame", "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/qhf3vqfgyrteggw3hxhg"],
  ["Himalaya", 99,  "Beauty", "face-creame", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWbAYz_dQOL6_R7MinxvZGI1JoHirBf8sGodto0sg52Q&s=10"],
  
  // Home (8 products)
  ["Flower Pot", 399, "Home", "pot", "https://d35l77wxi0xou3.cloudfront.net/opencart/image/catalog/antique%20mirror/Flower%20Pot%20Rs%201800-600x600.jpg"],
  ["Garage Cotton Bedsheet", 499, "Home", "Bedsheet", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKqqAVOIsEfzZnSDYTo2JMzwoXWALbwo_562KNPfugIOiExtfwrBK1Dv8&s=10"],
  ["Plastic chair", 499, "Home", "chair", "https://www.nilkamalfurniture.com/cdn/shop/files/MYSTIQUECCG.webp?v=1753435470&width=1080"],
  ["copper Handi cookware", 699, "Home", "cookware", "https://ashtok.com/cdn/shop/files/Traditional_Copper_Biryani_Handi_with_Lid_Premium_Dum_Biryani_Cooking_Pot_1024x1024.png?v=1781716222"],
  ["Gas Stove 3B", 2999, "Home", "stove", "https://mccoyindia.in/wp-content/uploads/2020/04/Artwork-Agni-3-frontview.jpg"],
  ["Clock", 399, "Home", "clock", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuggwQCrp1wJBdw9nPB331BRCigUd5l_U5Ne74Oe9neeDMmz66TBgo4_U&s=10"],
  ["Wooden Wall Clock", 1799, "Home", "wall-clock", "https://m.media-amazon.com/images/I/51e8I1oukPL._AC_UF894,1000_QL80_.jpg"],
  ["Smart Air Fryer 6L", 8999, "Home", "air-fryer", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCqpfgKqpGOmxUC4cDEUJ1_PnSXlggolJ3Krx6ijMFhD-UoPdMilMeSgY&s=10"],
];

const getProductImage = (name, keyword) => {
  const query = encodeURIComponent(`${name} ${keyword} product`);
  return `https://source.unsplash.com/700x700/?${query}`;
};

const getFallbackImage = (name) => {
  const label = encodeURIComponent(name);
  return `https://placehold.co/700x700/eef5ff/1266e3?text=${label}`;
};

const productsData = productNames.map(([name, price, category, keyword, customImage], index) => ({
  id: index + 1,
  name,
  price,
  category,
  image: customImage || getProductImage(name, keyword),
  fallbackImage: getFallbackImage(name),

}));

const categories = [
  { id: "For You", icon: "bag" },
  { id: "Fashion", icon: "tee" },
  { id: "Mobiles", icon: "phone" },
  { id: "Beauty", icon: "lip" },
  { id: "Electronics", icon: "pc" },
  { id: "Home", icon: "lamp" },
];

const navItems = [
  { id: "home", label: "Home", icon: "home" },
  { id: "wishlist", label: "Wishlist", icon: "heart" },
  { id: "account", label: "Account", icon: "user" },
  { id: "cart", label: "Cart", icon: "cart" },
];

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("For You");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardNumber: "",
    cardName: "",
    cvv: "",
  });
  const [notification, setNotification] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const recognitionRef = useRef(null);

  const filteredProducts = productsData.filter((product) => {
    const matchesSearch = search === "" || product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "For You" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const showNotification = (message) => {
    setNotification(message);
    const audio = new Audio("/not.mpeg");
    audio.volume = 0.45;
    audio.play().catch(() => {});
    setTimeout(() => setNotification(""), 2600);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istTime = now.toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      });
      setCurrentTime(istTime);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log("Speech Recognition API not supported");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("Voice listening started...");
        setListening(true);
      };

      recognition.onresult = (event) => {
        console.log("Speech recognition result:", event);
        if (event.results && event.results.length > 0) {
          const result = event.results[event.results.length - 1];
          if (result.isFinal) {
            const transcript = result[0].transcript.trim().toLowerCase();
            console.log("Final transcript:", transcript);
            setSearch(transcript);
            setListening(false);
            showNotification(`Searching for: ${transcript}`);
          }
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setListening(false);
        if (event.error !== "no-speech") {
          showNotification(`Error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log("Voice listening ended");
        setListening(false);
      };

      recognitionRef.current = recognition;
      setVoiceSupported(true);
    } catch (error) {
      console.error("Error setting up speech recognition:", error);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error("Error aborting recognition:", e);
        }
      }
    };
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart((items) => {
      const exists = items.find((item) => item.id === product.id);
      if (!exists) return [...items, { ...product, quantity }];
      return items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    });
    showNotification(`${product.name} added to cart`);
  };

  const addWishlist = (product) => {
    setWishlist((items) => {
      if (items.some((item) => item.id === product.id)) return items;
      showNotification(`${product.name} added to wishlist`);
      return [...items, product];
    });
  };

  const updateQty = (id, delta) => {
    setCart((items) =>
      items
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter(Boolean)
    );
  };

  const toggleVoiceSearch = () => {
    if (!voiceSupported || !recognitionRef.current) {
      showNotification("Voice search is not available");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    recognitionRef.current.start();
    setListening(true);
    showNotification("Listening now");
  };

  const placeOrder = () => {
    const amount = totalPrice || selectedProduct?.price || 0;
    if (!amount) {
      showNotification("Your cart is empty");
      return;
    }

    if (paymentMethod === "UPI" && !paymentDetails.upiId.includes("@")) {
      showNotification("Enter valid UPI ID");
      return;
    }

    if (
      paymentMethod === "Card" &&
      (paymentDetails.cardNumber.replace(/\s/g, "").length < 12 || paymentDetails.cvv.length < 3)
    ) {
      showNotification("Enter valid card details");
      return;
    }

    showNotification(`Order placed with ${paymentMethod}`);
    setCart([]);
    setSelectedProduct(null);
    setShowCheckout(false);
    setPaymentDetails({ upiId: "", cardNumber: "", cardName: "", cvv: "" });
  };

  const renderIcon = (type) => <span className={`line-icon ${type}`} aria-hidden="true" />;

  const renderProductCard = (product) => (
    <article className="product-card" key={product.id}>
      <button 
        className={`wishlist-dot ${wishlist.some((item) => item.id === product.id) ? "saved" : ""}`}
        onClick={() => addWishlist(product)}
        aria-label="Save product"
      >
        ♥
      </button>
      <img
        src={product.image}
        alt={product.name}
        onError={(event) => {
          event.currentTarget.src = product.fallbackImage;
        }}
      />
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <strong>Rs.{product.price.toLocaleString("en-IN")}</strong>
      <div className="product-actions">
        <button onClick={() => setSelectedProduct(product)}>View</button>
        <button onClick={() => addToCart(product)}>Add</button>
      </div>
    </article>
  );

  const renderHome = () => (
    <>
      <section className="coupon-strip">
        <strong>Exclusive SM Nexus coupon for you!</strong>
        <span>FLAT 10% OFF up to Rs.100</span>
        <small>Already applied</small>
      </section>

      <section className="sale-hero">
        <div>
          <span>Glam Up Sale</span>
          <h1>SALE IS LIVE!</h1>
          <p>SM Nexus beauty, electronics and home picks from Rs.99</p>
        </div>
        <button onClick={() => setCategory("For You")}>Shop</button>
      </section>

      <div className="slider-dots">
            </div>

      <section className="rail">
        <div className="section-title">
          <h2>Best Products</h2>
          <button onClick={() => setCategory("For You")}>View all</button>
        </div>
        <div className="product-row">
          {filteredProducts.map(renderProductCard)}
        </div>
      </section>
    </>
  );

  const renderWishlist = () => (
    <section className="rail">
      <div className="section-title">
        <h2>Wishlist</h2>
        <button onClick={() => setActiveTab("home")}>Shop</button>
      </div>
      {wishlist.length === 0 ? (
        <div className="empty-cart">No wishlist items yet</div>
      ) : (
        <div className="product-row">{wishlist.map(renderProductCard)}</div>
      )}
    </section>
  );

  const renderAccount = () => (
    <section className="account-panel">
      <div className="profile">
        <span>S</span>
        <div>
          <h2>Hello, Subhash</h2>
          <p>Plus member, 632001</p>
        </div>
      </div>
      <div className="account-stats">
        <div>
          <strong>{cart.length}</strong>
          <span>Cart</span>
        </div>
        <div>
          <strong>{wishlist.length}</strong>
          <span>Wishlist</span>
        </div>
        <div>
          <strong>120</strong>
          <span>Coins</span>
        </div>
      </div>
      <button className="primary-action" onClick={() => setShowCheckout(true)}>
        Checkout
      </button>
    </section>
  );

  const renderCart = () => (
    <section className="cart-panel">
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">Your cart is empty</div>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>Rs.{item.price.toLocaleString("en-IN")}</p>
                <div className="quantity">
                  <button onClick={() => updateQty(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
              </div>
              <button
                className="remove-item"
                onClick={() => setCart((items) => items.filter((cartItem) => cartItem.id !== item.id))}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            <span>Total</span>
            <strong>Rs.{totalPrice.toLocaleString("en-IN")}</strong>
          </div>
          <button className="primary-action" onClick={() => setShowCheckout(true)}>
            Proceed to Checkout
          </button>
        </>
      )}
    </section>
  );

  const renderPage = () => {
    if (activeTab === "wishlist") return renderWishlist();
    if (activeTab === "account") return renderAccount();
    if (activeTab === "cart") return renderCart();
    return renderHome();
  };

  return (
    <div className="app">
      {notification && <div className="notification">{notification}</div>}

      <div className="phone-shell">
        <header className="top-area">
          <div className="status-bar">
            <span>{currentTime}</span>
            <span>●●●●●</span>
          </div>

          <div className="service-tabs">
            <button className="active brand-tab" aria-label="SM Nexus">
              <img src={shopLogo} alt="SM Nexus logo" className="shop-logo" />
            </button>
          </div>

          <div className="address-row">
            <div>
              {renderIcon("pin")}
              <strong>632001</strong>
              <button>Add address</button>
            </div>
            <span className="coin-pill">120</span>
          </div>

          <div className="search-row">
            {renderIcon("search")}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
            />
            <button onClick={() => showNotification("Camera search opened")}>
              {renderIcon("camera")}
            </button>
            <button className={listening ? "listening" : ""} onClick={toggleVoiceSearch}>
              {renderIcon("mic")}
            </button>
            <button onClick={() => showNotification("Scanner opened")}>
              {renderIcon("scan")}
            </button>
          </div>

          <nav className="category-nav">
            {categories.map((item) => (
              <button
                key={item.id}
                className={category === item.id ? "active" : ""}
                onClick={() => setCategory(item.id)}
              >
                {renderIcon(item.icon)}
                <span>{item.id}</span>
              </button>
            ))}
          </nav>
        </header>

        <main>{renderPage()}</main>

        <nav className="bottom-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeTab === item.id ? "active" : ""}
              onClick={() => setActiveTab(item.id)}
            >
              {renderIcon(item.icon)}
              <span>{item.label}</span>
              {item.id === "cart" && cart.length > 0 && <b>{cart.length}</b>}
              {item.id === "wishlist" && wishlist.length > 0 && <b>{wishlist.length}</b>}
            </button>
          ))}
        </nav>
      </div>

      {selectedProduct && (
        <div className="modal-overlay">
          <ProductDetails
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            addToCart={addToCart}
            addWishlist={addWishlist}
            openCheckout={() => setShowCheckout(true)}
          />
        </div>
      )}

      {showCheckout && (
        <div className="modal-overlay">
          <section className="checkout-sheet">
            <div className="sheet-header">
              <h2>Checkout</h2>
              <button onClick={() => setShowCheckout(false)}>Close</button>
            </div>
            <div className="checkout-total">
              <span>Payable amount</span>
              <strong>Rs.{(totalPrice || selectedProduct?.price || 0).toLocaleString("en-IN")}</strong>
            </div>
            <div className="payment-options">
              {["UPI", "Card", "COD"].map((method) => (
                <label key={method} className={paymentMethod === method ? "active" : ""}>
                  <input
                    type="radio"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  {method === "COD" ? "Cash on Delivery" : method}
                </label>
              ))}
            </div>
            {paymentMethod === "UPI" && (
              <input
                value={paymentDetails.upiId}
                onChange={(event) =>
                  setPaymentDetails({ ...paymentDetails, upiId: event.target.value })
                }
                placeholder="name@bank"
              />
            )}
            {paymentMethod === "Card" && (
              <div className="card-fields">
                <input
                  value={paymentDetails.cardNumber}
                  onChange={(event) =>
                    setPaymentDetails({ ...paymentDetails, cardNumber: event.target.value })
                  }
                  placeholder="Card number"
                />
                <input
                  value={paymentDetails.cardName}
                  onChange={(event) =>
                    setPaymentDetails({ ...paymentDetails, cardName: event.target.value })
                  }
                  placeholder="Name on card"
                />
                <input
                  value={paymentDetails.cvv}
                  onChange={(event) =>
                    setPaymentDetails({ ...paymentDetails, cvv: event.target.value })
                  }
                  placeholder="CVV"
                />
              </div>
            )}
            <button className="primary-action" onClick={placeOrder}>
              Confirm Order
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
