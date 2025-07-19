// Using native fetch

async function testLogin() {
  try {
    console.log("Testing login with luiz/adm...");

    const response = await fetch("http://localhost:5050/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "luiz",
        password: "adm",
      }),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const data = await response.json();
    console.log("Response data:", data);

    if (response.ok) {
      console.log("✅ Login successful!");
    } else {
      console.log("❌ Login failed");
    }
  } catch (error) {
    console.error("Network error:", error.message);
  }
}

testLogin();
