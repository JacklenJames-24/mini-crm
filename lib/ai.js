export async function convertNaturalLanguageToRules(naturalText) {
  // Simulate AI processing - replace with actual OpenAI/Gemini API call
  const rules = [];
  
  // Simple pattern matching for demo
  const patterns = [
    {
      pattern: /spent\s+more\s+than\s+(\d+)/i,
      rule: (match) => ({ field: 'spend', operator: '>', value: parseInt(match[1]) })
    },
    {
      pattern: /inactive\s+(\d+)\s+days/i,
      rule: (match) => ({ 
        field: 'last_active_date', 
        operator: '<', 
        value: new Date(Date.now() - parseInt(match[1]) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
    },
    {
      pattern: /visited\s+more\s+than\s+(\d+)\s+times/i,
      rule: (match) => ({ field: 'visits', operator: '>', value: parseInt(match[1]) })
    },
    {
      pattern: /email\s+contains\s+['"](.*?)['"]/i,
      rule: (match) => ({ field: 'email', operator: 'LIKE', value: `%${match[1]}%` })
    }
  ];

  for (const { pattern, rule } of patterns) {
    const match = naturalText.match(pattern);
    if (match) {
      rules.push(rule(match));
    }
  }

  return rules;
}