import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { PullRequestList } from './components/PullRequestList';
import { GithubIcon, AlertCircle } from 'lucide-react';

function App() {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [mergedAfter, setMergedAfter] = useState('');
  const [pullRequests, setPullRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const searchPRs = async () => {
    setIsLoading(true);
    setError('');
    setPullRequests([]);

    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&base=prod&sort=updated&direction=desc`;
      console.log('🚀 API Request:', {
        url: apiUrl,
        headers: {
          Authorization: 'token [REDACTED]',
          Accept: 'application/vnd.github.v3+json',
        },
      });

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      const data = await response.json();
      console.log('📥 API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
      });

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pull requests');
      }

      // Filter PRs based on mergedAfter date
      const filteredPRs = data.filter(pr => {
        return pr.merged_at && new Date(pr.merged_at) > new Date(mergedAfter);
      });

      setPullRequests(filteredPRs);
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const markdownContent = pullRequests
    .map((pr) => (
      `## [${pr.title}](${pr.html_url})\n\n` +
      (pr.labels.length > 0 ? `Labels: ${pr.labels.map(label => `\`${label.name}\``).join(', ')}\n\n` : '') +
      `${pr.body || '*No description provided*'}\n\n`
    ))
    .join('');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <GithubIcon size={32} />
            <h1 className="text-3xl font-bold text-gray-900">GitHub PR Viewer</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Search for merged pull requests and export them as markdown
          </p>
        </div>

        <SearchForm
          token={token}
          setToken={setToken}
          owner={owner}
          setOwner={setOwner}
          repo={repo}
          setRepo={setRepo}
          mergedAfter={mergedAfter}
          setMergedAfter={setMergedAfter}
          onSearch={searchPRs}
          isLoading={isLoading}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1">
                  <p className="text-sm text-red-700">{error}</p>
                  {error.includes('Bad credentials') && (
                    <p className="text-sm text-red-600 mt-2">
                      Please check if your GitHub token is valid and has the necessary permissions.
                    </p>
                  )}
                  {error.includes('Not Found') && (
                    <p className="text-sm text-red-600 mt-2">
                      Please verify the owner and repository names are correct and you have access to them.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <PullRequestList pullRequests={pullRequests} markdownContent={markdownContent} />
      </div>
    </div>
  );
}

export default App;