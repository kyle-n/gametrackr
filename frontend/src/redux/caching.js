export const cacheGlobalState = state => {
  localStorage.setItem('global-state', JSON.stringify(state));
};

export const getCachedGlobalState = () => {
  const cachedState = localStorage.getItem('global-state');
  if (cachedState) {
    try {
      return JSON.parse(cachedState);
    } catch (e) {
      return null;
    }
  } else return null;
};
