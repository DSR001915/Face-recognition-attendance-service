import { useState, useEffect } from 'react';
import { getAllData } from '../services/db';

const SqlView = () => {
  const [data, setData] = useState<{ users: any[], attendance: any[] }>({ users: [], attendance: [] });

  useEffect(() => {
    setData(getAllData() as { users: any[], attendance: any[] });
  }, []);

  const renderTable = (title: string, rows: any[]) => {
    if (rows.length === 0) {
      return (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2 text-gray-700 capitalize">{title}</h3>
          <p className="text-gray-500 italic">No records found.</p>
        </div>
      );
    }

    const headers = Object.keys(rows[0]);

    return (
      <div className="mb-8 overflow-x-auto">
        <h3 className="text-xl font-bold mb-2 text-gray-700 capitalize">{title}</h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {headers.map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {headers.map(h => (
                  <td key={`${i}-${h}`} className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">
                    {h === 'descriptors' ? (
                      <span className="text-xs text-gray-400 truncate block max-w-xs" title={row[h]}>
                        [Binary Data]
                      </span>
                    ) : (
                      String(row[h])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Database Viewer (SQL)</h2>
      <p className="mb-6 text-gray-600">This view shows the raw data stored in the local SQL database.</p>
      
      {renderTable('users', data.users)}
      {renderTable('attendance', data.attendance)}
    </div>
  );
};

export default SqlView;
