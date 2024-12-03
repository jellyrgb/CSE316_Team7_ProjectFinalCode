import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config.tsx';

interface Jobs {
  id: number;
  job_name: string;
  duration: number;
  reward: number;
  start_time: number;
}

interface JobContextType {
  jobs: Jobs[];
  loading: boolean;
  error: string | null;
}

const JobContext = createContext<JobContextType>({
  jobs: [],
  loading: true,
  error: null,
});

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/jobList`);

        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobList:', err);
        setError('Failed to load jobList');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <JobContext.Provider value={{ jobs, loading, error }}>
      {children}
    </JobContext.Provider>
  );
}

export const useJobContext = () => React.useContext(JobContext);