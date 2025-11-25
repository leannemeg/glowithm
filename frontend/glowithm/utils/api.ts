export const explainIngredient = async (ingredient: string) => {
  const res = await fetch(`http://192.168.1.138:8000/ingredients/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredient }),
  });
  if (!res.ok) throw new Error("Failed to fetch explanation");
  return res.json();
};

export const chatWithAI = async (message: string) => {
  const res = await fetch(`http://192.168.1.138:8000/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Chat failed");

  return res.json() as Promise<{ reply: string }>;
};

