class AIService {
    constructor() {
        this.apiKey = null;
        this.model = 'claude-3-5-sonnet-20241022';
    }

    loadSavedApiKey() {
        const savedKey = localStorage.getItem('claude_api_key');
        if (savedKey) {
            this.apiKey = savedKey;
            return savedKey;
        }
        return null;
    }

    saveApiKey(apiKey) {
        if (apiKey) {
            this.apiKey = apiKey;
            localStorage.setItem('claude_api_key', apiKey);
        }
    }

    setModel(model) {
        this.model = model;
    }

    async generatePuzzle(sourceText) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        if (!sourceText || !sourceText.trim()) {
            throw new Error('Source text is required');
        }

        const prompt = `Create a Connections puzzle based on the following text. Extract exactly 16 words from the text and organize them into 4 groups of 4 words each. Each group should have a clear theme or connection.

The groups should have these difficulty levels:
- Yellow (easiest): Most obvious connections
- Green (medium-easy): Slightly more challenging
- Blue (medium-hard): Requires more thought
- Purple (hardest): Most difficult connections, often wordplay or obscure connections

Source text:
${sourceText}

Return your response as a JSON object with this exact structure:
{
  "groups": [
    {
      "category": "Category name",
      "words": ["WORD1", "WORD2", "WORD3", "WORD4"],
      "difficulty": "yellow"
    },
    {
      "category": "Category name",
      "words": ["WORD1", "WORD2", "WORD3", "WORD4"],
      "difficulty": "green"
    },
    {
      "category": "Category name",
      "words": ["WORD1", "WORD2", "WORD3", "WORD4"],
      "difficulty": "blue"
    },
    {
      "category": "Category name",
      "words": ["WORD1", "WORD2", "WORD3", "WORD4"],
      "difficulty": "purple"
    }
  ]
}

Make sure all words are in UPPERCASE and each group has exactly 4 words.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.model,
                max_tokens: 4000,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Claude API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const content = data.content[0].text;

        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No valid JSON found in response');
            }
        } catch (parseError) {
            throw new Error('Failed to parse JSON response: ' + parseError.message);
        }
    }
}