import OpenAI from 'openai';

const openai = new OpenAI({
 apiKey: 'sk-cBZIHCxf9Cckxs90-4Qr5YQwNzKY6QInz5hqfQIaAwT3BlbkFJdXBz6pGerynmacN0YQ_dzOqyjZ8MgsbEC9sSGXFw0A',
 baseURL: "https://gateway.ai.cloudflare.com/v1/ceb8d96668a0f9b49960ecf3ff6b3739/peerr-ai/openai"
});

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "What is a Fazeen?" }],
      model: "gpt-4o-mini",
    });

    console.log(completion.choices[0].message.content);
    return new Response(JSON.stringify(completion.choices[0].message));
  } catch (e) {
    console.error('Error:', e.message);
    return new Response(JSON.stringify({ error: e.message }));
  }
}

main();