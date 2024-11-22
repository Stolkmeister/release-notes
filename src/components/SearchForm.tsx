import React from 'react';
import { Calendar, GitPullRequest, Key, User } from 'lucide-react';
import { format, startOfMonth, subMonths } from 'date-fns';

interface SearchFormProps {
  token: string;
  setToken: (token: string) => void;
  owner: string;
  setOwner: (owner: string) => void;
  repo: string;
  setRepo: (repo: string) => void;
  mergedAfter: string;
  setMergedAfter: (date: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function SearchForm({
  token,
  setToken,
  owner,
  setOwner,
  repo,
  setRepo,
  mergedAfter,
  setMergedAfter,
  onSearch,
  isLoading,
}: SearchFormProps) {
  const setCurrentMonthStart = () => {
    const date = startOfMonth(new Date());
    setMergedAfter(format(date, 'yyyy-MM-dd'));
  };

  const setPreviousMonthStart = () => {
    const date = startOfMonth(subMonths(new Date(), 1));
    setMergedAfter(format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Key size={16} />
          GitHub Token
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <User size={16} />
            Owner/Organization
          </label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="e.g., facebook"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <GitPullRequest size={16} />
            Repository
          </label>
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="e.g., react"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Calendar size={16} />
          Merged After
        </label>
        <div className="flex gap-2">
          <input
            type="date"
            value={mergedAfter}
            onChange={(e) => setMergedAfter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={setCurrentMonthStart}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 rounded-md transition-colors whitespace-nowrap"
          >
            Current Month
          </button>
          <button
            onClick={setPreviousMonthStart}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 rounded-md transition-colors whitespace-nowrap"
          >
            Previous Month
          </button>
        </div>
      </div>

      <button
        onClick={onSearch}
        disabled={isLoading || !token || !owner || !repo || !mergedAfter}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Searching...' : 'Search PRs'}
      </button>
    </div>
  );
}