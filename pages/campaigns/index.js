import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Plus, Target, Users, Calendar, TrendingUp } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setLoading(false); // No loading if not authenticated
      return;
    }
    // Load campaigns from localStorage
    const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const storedLogs = JSON.parse(localStorage.getItem('communication_logs') || '[]');
    const updatedCampaigns = storedCampaigns.map(campaign => {
      const campaignLogs = storedLogs.filter(log => log.campaign_id === campaign.id);
      const sent = campaignLogs.filter(l => l.status === 'sent').length;
      const failed = campaignLogs.filter(l => l.status === 'failed').length;
      const successRate = campaign.audience_size > 0 ? ((sent / campaign.audience_size) * 100).toFixed(1) : 0;

      // Derive campaign status
      let status = 'pending';
      if (sent + failed >= campaign.audience_size) {
        status = failed > sent ? 'failed' : 'completed';
      }

      return { ...campaign, sent, failed, success_rate: Number(successRate), status };
    });
    setTimeout(() => {
      setCampaigns(updatedCampaigns);
      setLoading(false);
    }, 800);
  }, [user]);

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };
    const displayStatus = status || 'pending'; // Default to 'pending' if undefined
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[displayStatus] || styles.pending}`}>
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </span>
    );
  };

  if (!user) {
    return null; // Redirect handled by Layout
  }

  if (loading) {
    return (
      <Layout title="Campaigns">
        <div className="flex items-center justify-center h-64">
          <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Campaigns">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Manage your marketing campaigns and view delivery statistics</p>
        </div>
        <Link
          href="/campaigns/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new campaign.</p>
          <div className="mt-6">
            <Link
              href="/campaigns/new"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reach</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaigns.reduce((sum, c) => sum + c.sent, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(campaigns.reduce((sum, c) => sum + c.success_rate, 0) / campaigns.length)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Campaign History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Target className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.audience_size} customers
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {campaign.sent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {campaign.failed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {campaign.success_rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(campaign.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}