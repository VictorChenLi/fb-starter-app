import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Base64 } from 'js-base64';

const useSync = (apiToken) => {
  const [timeTrackingList, setTimeTrackingList] = useState([]);

  const fetchTimeTracking = useCallback(async () => {
    if (apiToken === null) return;
    try {
      const timeTrackingResponse = await axios.get('https://api.track.toggl.com/api/v9/me/time_entries', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Base64.encode(`${apiToken}:api_token`)}`,
        },
      });

      const togglTimeTrackingList = timeTrackingResponse.data;
      const workspaceIDList = [];
      const projectIDList = [];
      const projectNameMap = new Map();
      togglTimeTrackingList.forEach((tt) => {
        if (projectIDList.indexOf(tt.project_id) === -1) {
          workspaceIDList.push(tt.workspace_id);
          projectIDList.push(tt.project_id);
        }
      });
      await Promise.all(
        projectIDList.map(async (projectID, index) => {
          const projectResponse = await axios.get(
            `https://api.track.toggl.com/api/v9/workspaces/${workspaceIDList[index]}/projects/${projectID}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${Base64.encode(`${apiToken}:api_token`)}`,
              },
            }
          );
          projectNameMap.set(projectID, projectResponse.data.name);
        })
      );
      const convertedTimeTrackingList = togglTimeTrackingList?.map((timetracking) => ({
        project: projectNameMap.get(timetracking.project_id),
        description: timetracking.description,
        duration: timetracking.duration,
        billable: timetracking.billable,
        status: 'new',
      }));
      setTimeTrackingList(convertedTimeTrackingList);
    } catch (err) {
      console.log('timetracking sync error');
      console.error(err);
    }
  }, [apiToken]);

  useEffect(() => {
    fetchTimeTracking();
  }, [fetchTimeTracking]);

  return { timeTrackingList, fetchTimeTracking };
};

export default useSync;
