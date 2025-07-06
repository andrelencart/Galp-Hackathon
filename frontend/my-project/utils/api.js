
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(email, password) {
  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}


// export async function registerUser(name, email, password) {
//   const res = await fetch("http://localhost:5000/register", {  // Your backend register endpoint
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ name, email, password }),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.error || "Registration failed");
//   }

//   return data;
// }

export async function registerUser(name, email, password, country, district, council) {
  const res = await fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, country, district, council }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

export async function submitData(title, description) {
  const res = await fetch("http://localhost:5000/submit", {  // Your backend submit endpoint
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Submit failed");
  }

  return data;
}