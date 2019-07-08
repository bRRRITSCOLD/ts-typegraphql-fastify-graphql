export const array = {
  filter(items: any, filter: { [key: string]: any }) {
    const keys = Object.keys(filter);
    let filtered: any = items;
    for (let i = 0; i < keys.length; i++) filtered = filtered.filter((item: any) => item[keys[i]] === filter[keys[i]]);
    return filtered;
  },
};
