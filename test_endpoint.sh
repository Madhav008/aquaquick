#!/bin/bash

# API Base URL
BASE_URL="http://localhost:5101"
AUTH_TOKEN=""  # Will store the authentication token
USER_ID=""     # Will store the authenticated user's ID
DELIVERY_PARTNER_ID=""  # Will store the created delivery partner ID

# Function to make API requests and check response status
test_endpoint() {
    METHOD=$1
    ENDPOINT=$2
    DATA=$3
    EXPECTED_STATUS=$4
    DESCRIPTION=$5
    USE_AUTH=$6  # Set to "true" if this request needs authentication

    # Build headers
    HEADERS=(-H "Content-Type: application/json")
    if [ "$USE_AUTH" == "true" ] && [ -n "$AUTH_TOKEN" ]; then
        HEADERS+=(-H "Authorization: Bearer $AUTH_TOKEN")
    fi

    # Make the request and capture response + HTTP status
    RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X $METHOD "$BASE_URL$ENDPOINT" \
        "${HEADERS[@]}" \
        -d "$DATA")

    # Extract HTTP status and response body
    HTTP_STATUS=$(echo "$RESPONSE" | sed -E 's/.*HTTP_STATUS:([0-9]+)$/\1/')
    RESPONSE_BODY=$(echo "$RESPONSE" | sed -E 's/HTTP_STATUS:[0-9]+$//')

    if [ "$HTTP_STATUS" -eq "$EXPECTED_STATUS" ]; then
        echo -e "✅ PASS: $DESCRIPTION ($METHOD $ENDPOINT)"
        echo -e "🔹 Response: $RESPONSE_BODY\n"
    else
        echo -e "❌ FAIL: $DESCRIPTION ($METHOD $ENDPOINT) - Expected: $EXPECTED_STATUS, Got: $HTTP_STATUS"
        echo -e "🔹 Response: $RESPONSE_BODY\n"
    fi

    # Capture auth token from login response
    if [ "$ENDPOINT" == "/auth/verify-otp" ] && [ "$HTTP_STATUS" -eq 200 ]; then
        AUTH_TOKEN=$(echo "$RESPONSE_BODY" | jq -r '.token')
        echo -e "🔑 Auth Token Captured: $AUTH_TOKEN\n"
    fi

    # Capture user_id after login
    if [ "$ENDPOINT" == "/customers/me" ] && [ "$HTTP_STATUS" -eq 200 ]; then
        USER_ID=$(echo "$RESPONSE_BODY" | jq -r '.id')
        echo -e "👤 User ID Captured: $USER_ID\n"
    fi

    # Capture delivery partner ID
    if [ "$ENDPOINT" == "/delivery-partners" ] && [ "$HTTP_STATUS" -eq 201 ]; then
        DELIVERY_PARTNER_ID=$(echo "$RESPONSE_BODY" | jq -r '.id')
        echo -e "🚴‍♂️ Delivery Partner ID Captured: $DELIVERY_PARTNER_ID\n"
    fi
}

echo "🔍 Running API Tests..."

# Authentication APIs
test_endpoint "POST" "/auth/send-otp" '{"phone": "+919876543210"}' 200 "Send OTP" "false"
test_endpoint "POST" "/auth/verify-otp" '{"phone": "+919876543210", "otp": "123456"}' 200 "Verify OTP & Login" "false"

# Customer APIs (Require Auth)
test_endpoint "GET" "/customers/me" "" 200 "Get Profile Details" "true"
test_endpoint "PUT" "/customers/me" '{"full_name": "Aditya Puri", "address": "XYZ", "latitude": 28.7041, "longitude": 77.1025}' 200 "Update Profile" "true"
test_endpoint "POST" "/customers/check-service" '{"latitude": 28.7041, "longitude": 77.1025}' 200 "Check Service Availability" "true"

# Product APIs (Public)
test_endpoint "GET" "/products" "" 200 "Get Available Products" "false"

# Create Delivery Partner Before Order Placement
test_endpoint "POST" "/admin/delivery-partners" '{"name": "Delivery Guy", "phone": "+919812345678"}' 201 "Create Delivery Partner" "true"

# Order APIs (Require Auth & Uses USER_ID and DELIVERY_PARTNER_ID)
if [ -n "$USER_ID" ] && [ -n "$DELIVERY_PARTNER_ID" ]; then
    test_endpoint "POST" "/orders" "{\"user_id\": $USER_ID, \"product_id\": 1, \"order_type\": \"refill\", \"security_deposit\": 0}" 201 "Place an Order" "true"
else
    echo "❌ ERROR: User ID or Delivery Partner ID not set. Skipping Order Placement."
fi

test_endpoint "GET" "/orders" "" 200 "Get My Orders" "true"
test_endpoint "GET" "/orders/1" "" 200 "Get Order Details" "true"

# Assign Order to Delivery Partner
if [ -n "$DELIVERY_PARTNER_ID" ]; then
    test_endpoint "PUT" "/orders/1/assign" "{\"delivery_partner_id\": $DELIVERY_PARTNER_ID}" 200 "Assign Order to Delivery Partner" "true"
else
    echo "❌ ERROR: Delivery Partner ID not set. Skipping Order Assignment."
fi

# Delivery Partner APIs (Require Auth)
test_endpoint "GET" "/delivery-partners/me" "" 200 "Get Delivery Partner Profile" "true"
test_endpoint "PUT" "/delivery-partners/me/availability" '{"available": true}' 200 "Update Delivery Availability" "true"
test_endpoint "GET" "/delivery-partners/orders" "" 200 "Get Assigned Orders" "true"

# Admin APIs (Require Auth)
test_endpoint "GET" "/admin/dashboard" "" 200 "Get Dashboard Stats" "true"
test_endpoint "GET" "/admin/orders" "" 200 "Get All Orders" "true"
test_endpoint "PUT" "/admin/orders/101/assign" "{\"delivery_partner_id\": $DELIVERY_PARTNER_ID}" 200 "Assign Order to Delivery Partner" "true"

echo "✅ API Testing Completed!"
