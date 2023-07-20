import { AppData } from '@graasp/apps-query-client';

interface DataGrouped {
  [memberId: string]: AppData[];
}
interface Props {
  dataObject: any[];
  targetType: string;
}
const DataFilter = ({ dataObject, targetType }: Props): DataGrouped => {
  const dataFiltered = dataObject.flatMap((obj) =>
    obj.filter((item: any) => item.type === targetType && item.data),
  );
  const dataGrouped = dataFiltered.reduce((acc, item) => {
    if (item.memberId in acc) {
      acc[item.memberId].push(item);
    } else {
      acc[item.memberId] = [item];
    }
    return acc;
  }, {});

  return dataGrouped;
};

export default DataFilter;
