import { AppData } from '@graasp/apps-query-client';

interface DataGrouped {
  [memberId: string]: AppData[];
}
interface Props {
  dataObject: AppData[] | undefined;
  targetType: string;
}
const DataFilter = ({
  dataObject,
  targetType,
}: Props): DataGrouped | undefined => {
  const dataGrouped = dataObject?.reduce<{ [key: string]: AppData[] }>(
    (acc, item) => {
      if (item.memberId in acc) {
        acc[item.memberId].push(item);
      } else {
        acc[item.memberId] = [item];
      }
      return acc;
    },
    {},
  );

  return dataGrouped;
};

export default DataFilter;
