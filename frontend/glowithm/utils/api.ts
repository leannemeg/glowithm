export const explainIngredient = async (ingredient: string) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/ingredients/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredient }),
  });
  if (!res.ok) throw new Error("Failed to fetch explanation");
  return res.json();
};

export const chatWithAI = async (message: string) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Chat failed");

  return res.json() as Promise<{ reply: string }>;
};

