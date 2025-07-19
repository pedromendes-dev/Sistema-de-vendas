import bcrypt from "bcrypt";

async function testPassword() {
  const password = "adm";
  const hash = "$2b$10$o2IFvJbpYnBxGhQv4UBu7OG0NJTIWC7FeBMIwDfLUtsbfG8F9Qjgq";

  console.log("Testing password verification...");
  console.log("Password:", password);
  console.log("Hash:", hash);

  const isValid = await bcrypt.compare(password, hash);
  console.log("Is valid:", isValid);

  // Test creating a new hash
  const newHash = await bcrypt.hash(password, 10);
  console.log("New hash:", newHash);

  const isValidNew = await bcrypt.compare(password, newHash);
  console.log("New hash is valid:", isValidNew);
}

testPassword();
