import { useCallback, useEffect, useState } from 'react';
import { UpdaterContext } from './context';
import { Table } from './Table';

import { getChildren, Child } from './utils/api';

function App() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const [page, setPage] = useState(0);
  const [children, setChildren] = useState<Child[]>([]);
  const [isAllLoaded, setIsAllLoaded] = useState(false);

  const loadChildPage = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getChildren(page);
      setIsAllLoaded(data.length === 0);
      setChildren((prev) => prev.concat(data));
      setPage((prev) => prev + 1);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || err.toString());
      setLoading(false);
    }
  }, [page]);

  const handleChildUpdate = (childId: string, value: Partial<Child>) => {
    setChildren((prev) =>
      prev.map((child) => {
        if (child.childId === childId) {
          return { ...child, ...value };
        }
        return child;
      })
    );
  };

  useEffect(() => {
    loadChildPage();
  }, []);

  return (
    <UpdaterContext.Provider
      value={{ onSetError: setError, onUpdatedChild: handleChildUpdate }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        {isLoading && <span>loading</span>}
        <section className="w-full max-w-5xl p-4 bg-slate-200 rounded-sm">
          <Table
            list={children}
            hasNextPage={!isAllLoaded}
            loadNextPage={loadChildPage}
            isNextPageLoading={isLoading}
          />
        </section>
        {error && <span className="text-red-700">{error}</span>}
      </div>
    </UpdaterContext.Provider>
  );
}

export default App;
