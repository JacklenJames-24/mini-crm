import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import RuleBuilder from '@/components/RuleBuilder';
import { ArrowLeft, Send, Eye, Users } from 'lucide-react';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export default function NewCampaign() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [campaignName, setCampaignName] = useState('');
  const [rules, setRules] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Mock customer data for preview
  const mockCustomers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', spend: 2500, visits: 15, last_active_date: '2024-09-10' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', spend: 4200, visits: 8, last_active_date: '2024-09-12' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', spend: 1800, visits: 22, last_active_date: '2024-08-30' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', spend: 6500, visits: 12, last_active_date: '2024-09-13' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', spend: 950, visits: 3, last_active_date: '2024-07-15' },
  ];

  const handlePreview = () => {
    if (rules.length === 0) return;

    let filteredCustomers = [...mockCustomers];

    rules.forEach(rule => {
      filteredCustomers = filteredCustomers.filter(customer => {
        switch (rule.operator) {
          case '>':
            return customer[rule.field] > parseFloat(rule.value);
          case '<':
            if (rule.field === 'last_active_date') {
              return new Date(customer[rule.field]) < new Date(rule.value);
            }
            return customer[rule.field] < parseFloat(rule.value);
          case '=':
            return customer[rule.field] == rule.value;
          case 'LIKE':
            return customer[rule.field].toLowerCase().includes(rule.value.toLowerCase());
          default:
            return true;
        }
      });
    });

    setPreviewData({
      count: filteredCustomers.length,
      customers: filteredCustomers.slice(0, 5),
      totalSpend: filteredCustomers.reduce((sum, c) => sum + c.spend, 0),
    });
    setShowPreview(true);
  };

  const handleCreateCampaign = async () => {
    if (!campaignName || rules.length === 0) {
      alert('Please enter a campaign name and add at least one rule');
      return;
    }

    setIsCreating(true);

    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

    const newCampaign = {
      id: Date.now(),
      name: campaignName,
      rules,
      audience_size: previewData?.count || 0,
      created_at: new Date().toISOString(),
    };

    // Save to localStorage
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    localStorage.setItem('campaigns', JSON.stringify([...campaigns, newCampaign]));

    // Simulate delivery logs
    const filteredCustomers = previewData ? previewData.customers : [];
    const logs = filteredCustomers.map((customer, i) => ({
      id: Date.now() + i,
      campaign_id: newCampaign.id,
      customer_id: customer.id,
      message: `Hi ${user?.name || 'User'}, here's 10% off!`,
      status: Math.random() > 0.1 ? 'sent' : 'failed', // 90% success
      created_at: new Date().toISOString(),
    }));
    localStorage.setItem('communication_logs', JSON.stringify(logs));

    setIsCreating(false);
    alert('Campaign created successfully!');
    router.push('/campaigns');
  };

  if (!user) return null; // Protect route

  return (
    <Layout title="Create New Campaign">
      <div className="mb-6">
        <Link
          href="/campaigns"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Link>
        <p className="text-gray-600">Create targeted marketing campaigns using customer segmentation rules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Name */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Campaign Details</h2>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Enter campaign name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Rule Builder */}
          <RuleBuilder
            rules={rules}
            onChange={setRules}
            onPreview={handlePreview}
          />

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleCreateCampaign}
              disabled={!campaignName || rules.length === 0 || isCreating}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Campaign...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Create & Send Campaign
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Audience Preview
            </h3>

            {!showPreview ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-300" />
                <p className="text-gray-500 mt-2">Add rules and click "Preview Audience" to see matching customers</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Audience Size</p>
                  <p className="text-2xl font-bold text-blue-900">{previewData.count}</p>
                  <p className="text-xs text-blue-700">customers match your criteria</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Total Spend</p>
                  <p className="text-xl font-bold text-green-900">${previewData.totalSpend.toLocaleString()}</p>
                </div>

                {previewData.customers.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Sample Customers:</p>
                    <div className="space-y-2">
                      {previewData.customers.map(customer => (
                        <div key={customer.id} className="bg-gray-50 p-3 rounded text-sm">
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-gray-600 text-xs">{customer.email}</p>
                          <p className="text-xs text-gray-500">Spend: ${customer.spend}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}