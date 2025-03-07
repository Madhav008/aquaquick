# Water Can Delivery Service - API Documentation

## **Authentication APIs**

### **1. Send OTP** (For login/sign-up)
**Endpoint:** `POST /auth/send-otp`
**Body:**
```json
{ "phone": "+919876543210" }
```
**Response:**
```json
{ "message": "OTP sent successfully" }
```

### **2. Verify OTP & Login**
**Endpoint:** `POST /auth/verify-otp`
**Body:**
```json
{ "phone": "+919876543210", "otp": "123456" }
```
**Response:**
```json
{ "token": "JWT_TOKEN", "role": "customer/admin/delivery_partner" }
```

---

## **Customer APIs**

### **3. Get Profile Details**
**Endpoint:** `GET /customers/me`
**Response:**
```json
{ "id": 1, "phone": "+919876543210", "full_name": "Aditya", "address": "XYZ", "service_available": true }
```

### **4. Update Profile & Address**
**Endpoint:** `PUT /customers/me`
**Body:**
```json
{ "full_name": "Aditya Puri", "address": "XYZ", "latitude": 28.7041, "longitude": 77.1025 }
```

### **5. Check Service Availability**
**Endpoint:** `POST /customers/check-service`
**Body:**
```json
{ "latitude": 28.7041, "longitude": 77.1025 }
```
**Response:**
```json
{ "service_available": true }
```

### **6. Get Available Products**
**Endpoint:** `GET /products`
**Response:**
```json
[
  { "id": 1, "name": "Can Refill", "price": 45 },
  { "id": 2, "name": "New Filled Can", "price": 140 }
]
```

### **7. Place an Order**
**Endpoint:** `POST /orders`
**Body:**
```json
{
  "product_id": 1,
  "order_type": "refill",
  "security_deposit": 0
}
```
**Response:**
```json
{ "order_id": 101, "status": "pending" }
```

### **8. Get My Orders**
**Endpoint:** `GET /orders`
**Response:**
```json
[
  { "id": 101, "product_name": "Can Refill", "status": "delivered", "created_at": "2025-03-06" }
]
```

### **9. Get Order Details**
**Endpoint:** `GET /orders/{order_id}`
**Response:**
```json
{
  "id": 101,
  "product_name": "Can Refill",
  "status": "pending",
  "assigned_to": { "id": 5, "name": "Ramesh", "phone": "+919876543211" }
}
```

---

## **Delivery Partner APIs**

### **10. Get My Profile**
**Endpoint:** `GET /delivery-partners/me`
**Response:**
```json
{ "id": 5, "phone": "+919876543211", "full_name": "Ramesh", "available": true }
```

### **11. Update Availability**
**Endpoint:** `PUT /delivery-partners/me/availability`
**Body:**
```json
{ "available": true }
```

### **12. Get Assigned Orders**
**Endpoint:** `GET /delivery-partners/orders`
**Response:**
```json
[
  { "id": 101, "customer_name": "Aditya", "address": "XYZ", "status": "assigned" }
]
```

### **13. Update Order Status**
**Endpoint:** `PUT /delivery-partners/orders/{order_id}/status`
**Body:**
```json
{ "status": "picked_up" }
```
**Allowed Statuses:** "picked_up", "on_the_way", "delivered"

### **14. Track Customer Location (Per Order)**
**Endpoint:** `GET /delivery-partners/orders/{order_id}/location`
**Response:**
```json
{ "latitude": 28.7041, "longitude": 77.1025 }
```

---

## **Admin APIs**

### **15. Get Dashboard Stats**
**Endpoint:** `GET /admin/dashboard`
**Response:**
```json
{
  "total_orders": 100,
  "active_deliveries": 5,
  "total_delivery_partners": 10,
  "pending_orders": 7
}
```

### **16. Get All Orders**
**Endpoint:** `GET /admin/orders`

### **17. Assign Order to a Delivery Partner**
**Endpoint:** `PUT /admin/orders/{order_id}/assign`
**Body:**
```json
{ "delivery_partner_id": 5 }
```

### **18. Get Order Status History**
**Endpoint:** `GET /admin/orders/{order_id}/history`

### **19. Get All Delivery Partners**
**Endpoint:** `GET /admin/delivery-partners`

### **20. Create a Delivery Partner**
**Endpoint:** `POST /admin/delivery-partners`
**Body:**
```json
{
  "full_name": "Ramesh",
  "phone": "+919876543211"
}
```

### **21. Deactivate/Delete a Delivery Partner**
**Endpoint:** `DELETE /admin/delivery-partners/{id}`

---

## **Future Enhancements**
- Live Order Tracking (WebSockets)
- Automated Order Assignment
- Push Notifications for Order Updates

Here are the equivalent `curl` requests for each API call made in the script:

### Authentication APIs:
#### 1. Send OTP:
```sh
curl -X POST "http://localhost:5000/auth/send-otp" \
    -H "Content-Type: application/json" \
    -d '{"phone": "+919876543210"}'
```

#### 2. Verify OTP & Login:
```sh
curl -X POST "http://localhost:5000/auth/verify-otp" \
    -H "Content-Type: application/json" \
    -d '{"phone": "+919876543210", "otp": "123456"}'
```

---

### Customer APIs (Require Auth):
#### 3. Get Profile Details:
```sh
curl -X GET "http://localhost:5000/customers/me" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>"
```

#### 4. Update Profile:
```sh
curl -X PUT "http://localhost:5000/customers/me" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>" \
    -d '{"full_name": "Aditya Puri", "address": "XYZ", "latitude": 28.7041, "longitude": 77.1025}'
```

#### 5. Check Service Availability:
```sh
curl -X POST "http://localhost:5000/customers/check-service" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>" \
    -d '{"latitude": 28.7041, "longitude": 77.1025}'
```

---

### Product APIs (Public):
#### 6. Get Available Products:
```sh
curl -X GET "http://localhost:5000/products" \
    -H "Content-Type: application/json"
```

---

### Order APIs (Require Auth & Uses `USER_ID`):
#### 7. Place an Order:
```sh
curl -X POST "http://localhost:5000/orders" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>" \
    -d '{"user_id": "<USER_ID>", "product_id": 1, "order_type": "refill", "security_deposit": 0}'
```

#### 8. Get My Orders:
```sh
curl -X GET "http://localhost:5000/orders" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>"
```

#### 9. Get Order Details:
```sh
curl -X GET "http://localhost:5000/orders/101" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>"
```

---

### Delivery Partner APIs (Require Auth):
#### 10. Get Delivery Partner Profile:
```sh
curl -X GET "http://localhost:5000/delivery-partners/me" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>"
```

#### 11. Update Delivery Availability:
```sh
curl -X PUT "http://localhost:5000/delivery-partners/me/availability" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>" \
    -d '{"available": true}'
```

#### 12. Get Assigned Orders:
```sh
curl -X GET "http://localhost:5000/delivery-partners/orders" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>"
```

---

### Admin APIs (Require Auth):
#### 13. Get Dashboard Stats:
```sh
curl -X GET "http://localhost:5000/admin/dashboard" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>"
```

#### 14. Get All Orders:
```sh
curl -X GET "http://localhost:5000/admin/orders" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>"
```

#### 15. Assign Order to Delivery Partner:
```sh
curl -X PUT "http://localhost:5000/admin/orders/101/assign" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <AUTH_TOKEN>" \
    -d '{"delivery_partner_id": 5}'
```

Replace `<AUTH_TOKEN>` with the actual token obtained from the login API and `<USER_ID>` with the authenticated user's ID.

Let me know if you need modifications! 🚀