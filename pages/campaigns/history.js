import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function CampaignHistory() {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && user) {
      const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]').sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      const storedLogs = JSON.parse(localStorage.getItem('communication_logs') || '[]');
      setCampaigns(storedCampaigns);
      setLogs(storedLogs);
    }
  }, [user]);

  if (!user) return null;

  return (
    <Layout title="Campaign History">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Campaign History</h2>
        {campaigns.length === 0 ? (
          <p>No campaigns yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Audience Size</th>
                <th className="border p-2">Sent</th>
                <th className="border p-2">Failed</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const campaignLogs = logs.filter((log) => log.campaign_id === campaign.id);
                const sent = campaignLogs.filter((l) => l.status === 'sent').length;
                const failed = campaignLogs.filter((l) => l.status === 'failed').length;
                return (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="border p-2">{campaign.name}</td>
                    <td className="border p-2">{campaign.audience_size}</td>
                    <td className="border p-2">{sent}</td>
                    <td className="border p-2">{failed}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}