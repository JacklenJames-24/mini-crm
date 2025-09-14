import { useState } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';

export default function RuleBuilder({ rules, onChange, onPreview }) {
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fields = [
    { value: 'spend', label: 'Total Spend' },
    { value: 'visits', label: 'Visit Count' },
    { value: 'last_active_date', label: 'Last Active Date' },
    { value: 'email', label: 'Email' },
    { value: 'name', label: 'Name' },
  ];

  const operators = {
    spend: [
      { value: '>', label: 'Greater than' },
      { value: '<', label: 'Less than' },
      { value: '=', label: 'Equal to' },
    ],
    visits: [
      { value: '>', label: 'Greater than' },
      { value: '<', label: 'Less than' },
      { value: '=', label: 'Equal to' },
    ],
    last_active_date: [
      { value: '>', label: 'After' },
      { value: '<', label: 'Before' },
      { value: '=', label: 'On' },
    ],
    email: [
      { value: 'LIKE', label: 'Contains' },
      { value: '=', label: 'Equals' },
    ],
    name: [
      { value: 'LIKE', label: 'Contains' },
      { value: '=', label: 'Equals' },
    ],
  };

  const addRule = () => {
    onChange([...rules, { field: 'spend', operator: '>', value: '' }]);
  };

  const updateRule = (index, updatedRule) => {
    const newRules = [...rules];
    newRules[index] = updatedRule;
    onChange(newRules);
  };

  const removeRule = (index) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  const handleAIConversion = async () => {
    if (!naturalLanguage.trim()) return;
    
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiRules = [];
      
      // Simple pattern matching
      if (naturalLanguage.toLowerCase().includes('spent more than')) {
        const match = naturalLanguage.match(/spent more than (\d+)/i);
        if (match) {
          aiRules.push({ field: 'spend', operator: '>', value: match[1] });
        }
      }
      
      if (naturalLanguage.toLowerCase().includes('inactive')) {
        const match = naturalLanguage.match(/inactive (\d+) days/i);
        if (match) {
          const daysAgo = new Date();
          daysAgo.setDate(daysAgo.getDate() - parseInt(match[1]));
          aiRules.push({ 
            field: 'last_active_date', 
            operator: '<', 
            value: daysAgo.toISOString().split('T')[0] 
          });
        }
      }
      
      if (naturalLanguage.toLowerCase().includes('visited more than')) {
        const match = naturalLanguage.match(/visited more than (\d+)/i);
        if (match) {
          aiRules.push({ field: 'visits', operator: '>', value: match[1] });
        }
      }
      
      if (aiRules.length > 0) {
        onChange([...rules, ...aiRules]);
        setNaturalLanguage('');
      }
    } catch (error) {
      console.error('AI processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Natural Language Input */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
          AI Rule Builder
        </h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            placeholder="e.g., People who spent more than 5000 and inactive 90 days"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleAIConversion}
            disabled={isProcessing || !naturalLanguage.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isProcessing ? 'Processing...' : 'Generate Rules'}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Try: "customers who spent more than 1000", "users inactive 30 days", "visited more than 5 times"
        </p>
      </div>

      {/* Manual Rule Builder */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Rules</h3>
        
        {rules.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No rules defined. Add a rule to start building your audience segment.
          </p>
        ) : (
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <select
                  value={rule.field}
                  onChange={(e) => updateRule(index, { ...rule, field: e.target.value, operator: operators[e.target.value][0].value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {fields.map(field => (
                    <option key={field.value} value={field.value}>{field.label}</option>
                  ))}
                </select>
                
                <select
                  value={rule.operator}
                  onChange={(e) => updateRule(index, { ...rule, operator: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {operators[rule.field]?.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                
                <input
                  type={rule.field === 'last_active_date' ? 'date' : 'text'}
                  value={rule.value}
                  onChange={(e) => updateRule(index, { ...rule, value: e.target.value })}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                
                <button
                  onClick={() => removeRule(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={addRule}
            className="flex items-center px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </button>
          
          {rules.length > 0 && (
            <button
              onClick={onPreview}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Preview Audience
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
