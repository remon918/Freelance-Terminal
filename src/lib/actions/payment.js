"use server"

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const payment = async (data) => {
  try {
    const res = await fetch(`${baseUrl}/api/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }

    const resData = await res.json();
    return resData;
  } catch (error) {
    console.error("Server Action Payment Error:", error);
    return { success: false, error: error.message };
  }
}