import { useCallback, useContext, useRef } from 'react';
import InfiniteLoader from 'react-window-infinite-loader';
import {
  FixedSizeList,
  ListItemKeySelector,
  ListChildComponentProps,
} from 'react-window';

import { Child, doChildCheckin, doChildCheckout } from './utils/api';
import { UpdaterContext } from './context';

interface ITable {
  list: Child[];
  hasNextPage: boolean;
  loadNextPage(): void;
  isNextPageLoading: boolean;
}

const ChildStateChanger = ({ child }: { child: Child }) => {
  const isLoadingRef = useRef(false);

  const context = useContext(UpdaterContext);

  const handleChildCheckout = async () => {
    try {
      if (!isLoadingRef.current) {
        isLoadingRef.current = true;
        await doChildCheckout(child.childId);
        context.onUpdatedChild(child.childId, { checkedIn: false });
        isLoadingRef.current = false;
      }
    } catch (err: any) {
      context.onSetError(err.message || err.toString());
      isLoadingRef.current = false;
    }
  };

  const handleChildCheckin = async () => {
    try {
      if (!isLoadingRef.current) {
        isLoadingRef.current = true;
        await doChildCheckin(child.childId);
        context.onUpdatedChild(child.childId, { checkedIn: true });
        isLoadingRef.current = false;
      }
    } catch (err: any) {
      context.onSetError(err.message || err.toString());
      isLoadingRef.current = false;
    }
  };

  if (child.checkedIn) {
    return (
      <button onClick={handleChildCheckout} className="bg-slate-100">
        Checkout
      </button>
    );
  }

  return (
    <button onClick={handleChildCheckin} className="bg-slate-100">
      Checkin
    </button>
  );
};

const Item: React.FC<ListChildComponentProps<Child[]>> = ({
  index,
  style,
  data,
}) => {
  return (
    <div
      style={style}
      className="w-full bg-white rounded-sm flex items-center justify-start px-4"
    >
      <span>{data[index].name.fullName}</span>
      <span className="ml-auto">
        <ChildStateChanger child={data[index]} />
      </span>
    </div>
  );
};

const itemKey: ListItemKeySelector<Child[]> = (index, data) => {
  const item = data[index];

  return item.childId;
};

export const Table = ({
  list,
  hasNextPage,
  loadNextPage,
  isNextPageLoading,
}: ITable) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isItemLoaded = useCallback(
    (index) => !hasNextPage || index < list.length,
    [list, hasNextPage]
  );

  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  return (
    <div ref={containerRef} className="w-full min-h-300">
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={10000}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            itemCount={list.length}
            itemData={list}
            onItemsRendered={onItemsRendered}
            ref={ref}
            itemSize={50}
            width={containerRef.current?.offsetWidth || 0}
            height={300}
            itemKey={itemKey}
          >
            {Item}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    </div>
  );
};
