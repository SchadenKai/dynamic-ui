export interface GenerateUIResponse {
  id: string;
  function: {
    arguments: string;
    name: string;
  };
  type: string;
}

export interface GenerateUIRequest {
  message: string;
  role: string;
}

export const generateUISS = async (
  data: GenerateUIRequest
): Promise<GenerateUIResponse | string | null> => {
  const res = await fetch(
    "http://localhost:8000/chat/send-message?token=3fbdb3634ff0f1fa02b9d6629136ff4e",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const res_json = await res.json();
  return res_json[0];
};

export const sendChatMessage = async (
  data: GenerateUIRequest
): Promise<GenerateUIResponse | string | null> => {
  const res = await fetch(
    "http://localhost:8000/chat/send-message?token=e3556f6962eb05b6e99616c92d020869",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const res_json = await res.json();
  return res_json[0];
};
