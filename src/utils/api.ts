import { appFetch } from './appFetch';

export interface Child {
  childId: string;
  checkedIn: boolean;
  name: {
    firstName: string;
    fullName: string;
    lastName: string;
    middleName: string;
  };
}

const PAGE_SIZE = 10;
let LOCAL_CHILDREN: Child[] = [];

const getListPage = (arr: any[], page: number) => {
  return arr.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
};

export const getChildren = async (page: number): Promise<any> => {
  if (LOCAL_CHILDREN.length === 0) {
    const data = await appFetch({
      path: '/daycare/tablet/group',
      method: 'GET',
      data: {
        groupId: '86413ecf-01a1-44da-ba73-1aeda212a196',
        institutionId: 'dc4bd858-9e9c-4df7-9386-0d91e42280eb',
      },
    });
    LOCAL_CHILDREN = data.children;
    return getListPage(LOCAL_CHILDREN, page);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getListPage(LOCAL_CHILDREN, page));
    }, 3000);
  });
};

export const doChildCheckin = (childId: string) =>
  appFetch({
    path: `/v2/children/${childId}/checkins`,
    method: 'POST',
    data: { pickupTime: '16:00' },
  });

export const doChildCheckout = (childId: string) =>
  appFetch({
    path: `/v2/children/${childId}/checkout`,
    method: 'POST',
  });
