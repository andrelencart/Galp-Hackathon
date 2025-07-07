
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(email, password) {
  const res = await fetch(`${apiUrl}/login`, {
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

export async function registerUser(name, email, password, country, district, council, google_id) {
  // Build the payload dynamically
  const payload = { name, email, country, district, council };
  if (password !== undefined) payload.password = password;
  if (google_id !== undefined) payload.google_id = google_id;

  const res = await fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

export async function submitRun({
  run_email,
  name,
  country,
  district,
  council,
  group_type,
  activity,
  date,
  distance_km,
  steps,
  image_url,
  valid,
  profile_id,
  guest_id
}) {
  const res = await fetch(`${apiUrl}/add_run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      run_email,
      name,
      country,
      district,
      council,
      group_type,
      activity,
      date,
      distance_km,
      steps,
      image_url,
      valid,
      profile_id,
      guest_id
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Submission failed");
  }

  return data;
}

export async function uploadProofImage({ imageFile, profile_id, people_count }) {
  const formData = new FormData();
  formData.append("image", imageFile);
  if (profile_id) formData.append("profile_id", profile_id);
  if (people_count) formData.append("people_count", people_count);

  const res = await fetch(`${apiUrl}/api/image-to-text`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erro ao ler imagem");
  }
  return data;
}

export async function getUserByEmail(email) {
     const res = await fetch(`${apiUrl}/api/get_user_by_email?email=${encodeURIComponent(email)}`);
     if (!res.ok) return null;
     return await res.json(); // null or user object
   }
export async function getGuestByEmail(email) {
      const res = await fetch(`${apiUrl}/api/get_guest_by_email?email=${encodeURIComponent(email)}`);
      if (!res.ok) return null;
      return await res.json(); // null or guest object
   }
export async function createGuest({ name, email, district, council, country }) {
  try {
    const res = await fetch(`${apiUrl}/api/create_guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, district, council, country })
    });
    
    if (!res.ok) {
      // Try to get error message from response
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create guest");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error creating guest:", error);
    throw error; // Re-throw to let the caller handle it
  }
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


// export async function submitData(title, description) {
//   const res = await fetch("http://localhost:5000/submit", {  // Your backend submit endpoint
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ title, description }),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.error || "Submit failed");
//   }

//   return data;
// }

// export async function submitData(title, description) {
//   const res = await fetch(`${apiUrl}/submit`, {  // Replace with your backend submit endpoint
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ title, description }),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.error || "Submission failed");
//   }

//   return data;
// }