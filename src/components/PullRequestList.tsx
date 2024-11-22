import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, GitPullRequest } from 'lucide-react';
import { format } from 'date-fns';

interface Label {
  id: number;
  name: string;
  color: string;
  description?: string;
}

interface PullRequest {
  title: string;
  body: string;
  number: number;
  html_url: string;
  labels: Label[];
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  merged_at: string;
}

interface PullRequestListProps {
  pullRequests: PullRequest[];
  markdownContent: string;
}

export function PullRequestList({ pullRequests, markdownContent }: PullRequestListProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdownContent);
  };

  if (pullRequests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Pull Requests ({pullRequests.length})
        </h2>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
        >
          <Copy size={16} />
          Copy Markdown
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {pullRequests.map((pr, index) => (
          <div 
            key={pr.number} 
            className={`p-6 ${index !== pullRequests.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={pr.user.avatar_url} 
                  alt={pr.user.login}
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <GitPullRequest size={16} className="text-green-600" />
                  <a
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-blue-600 hover:text-blue-800 truncate"
                  >
                    #{pr.number} {pr.title}
                  </a>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <a
                    href={pr.user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-700 hover:text-blue-600"
                  >
                    {pr.user.login}
                  </a>
                  <span>•</span>
                  <span>
                    Merged on {format(new Date(pr.merged_at), 'MMM d, yyyy')}
                  </span>
                </div>
                {pr.labels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pr.labels.map(label => (
                      <span
                        key={label.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `#${label.color}20`,
                          color: `#${label.color}`,
                          border: `1px solid #${label.color}40`
                        }}
                        title={label.description}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 prose">
                  <ReactMarkdown>{pr.body || '*No description provided*'}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}